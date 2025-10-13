import React, { useState, useEffect } from 'react';
import audioManager from '../utils/audioManager';

const AudioDebugger = () => {
  const [lastPlayed, setLastPlayed] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Override audio manager's playSound to show feedback
    const originalPlaySound = audioManager.playSound.bind(audioManager);
    
    audioManager.playSound = async function(audioKey, options = {}) {
      setLastPlayed(audioKey);
      setIsVisible(true);
      
      // Hide after 2 seconds
      setTimeout(() => setIsVisible(false), 2000);
      
      return await originalPlaySound(audioKey, options);
    };

    return () => {
      // Cleanup would go here if needed
    };
  }, []);

  if (!isVisible) return null;

  const getAudioIcon = (audioKey) => {
    if (audioKey.includes('score')) {
      const score = audioKey.replace('score', '').replace('to', '-');
      return `📊 Score ${score}%`;
    }
    
    const icons = {
      'buttonClick': '🔘',
      'levelComplete': '🎉',
      'moveToNewLevel': '⬆️',
      'resultGenerate': '🖼️',
      'reset': '🔄',
      'accuracyGoingBack': '📉',
      'backgroundSound': '🎵',
      'soundToggle': '🔊'
    };
    
    return icons[audioKey] || '🔊';
  };

  return (
    <div className="fixed bottom-4 left-4 bg-purple-600 text-white px-3 py-2 rounded-lg shadow-lg z-50 text-sm">
      {getAudioIcon(lastPlayed)} {lastPlayed}
    </div>
  );
};

export default AudioDebugger;