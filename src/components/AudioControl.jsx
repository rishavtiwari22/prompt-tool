import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import audioManager from "../utils/audioManager";

const AudioControl = ({ className = "" }) => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    const initAudio = async () => {
      try {
        // Initialize audio state from audioManager
        const audioState = audioManager.getAudioState();
        setAudioEnabled(audioState.enabled);
        setVolume(audioState.volume);

        // Test audio accessibility
        console.log("AudioControl: Testing audio system...");
        await audioManager.testAudioAccessibility();

        // Start background music when component mounts (if audio is enabled)
        if (audioState.enabled) {
          console.log("AudioControl: Starting background music...");
          audioManager.playBackgroundMusic().catch((error) => {
            console.warn(
              "AudioControl: Failed to start background music:",
              error
            );
          });
        }
      } catch (error) {
        console.warn("AudioControl: Audio initialization failed:", error);
      }
    };

    initAudio();

    // Cleanup on unmount
    return () => {
      audioManager.stopBackgroundMusic();
    };
  }, []);

  const handleToggleAudio = async () => {
    const newState = await audioManager.toggleAudio();
    setAudioEnabled(newState);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioManager.setVolume(newVolume);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Volume Slider (Desktop only) */}
      <div className="hidden lg:flex items-center space-x-2">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${
              volume * 100
            }%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`,
          }}
        />
      </div>

      {/* Audio Toggle Button */}
      <button
        onClick={handleToggleAudio}
        className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 ${
          audioEnabled
            ? "bg-green-100 text-green-600 hover:bg-green-200"
            : "bg-red-100 text-red-600 hover:bg-red-200"
        }`}
        title={audioEnabled ? "Mute Sound" : "Enable Sound"}
        style={{ willChange: "transform" }}
      >
        {audioEnabled ? (
          <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
        ) : (
          <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
        )}
      </button>
    </div>
  );
};

export default AudioControl;
