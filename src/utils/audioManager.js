// Audio Manager for Prompt Learning Tool Game
// Manages all game audio effects with proper UX considerations

class AudioManager {
  constructor() {
    this.audioEnabled = true;
    this.volume = 0.7;
    this.audioCache = new Map();
    this.currentBackgroundAudio = null;
    
    // Audio file mappings
    this.audioFiles = {
      backgroundSound: '/src/assets/Audio/backgroundSound.mp3',
      buttonClick: '/src/assets/Audio/ButtonClick.mp3',
      levelComplete: '/src/assets/Audio/Level-completion.mp3',
      moveToNewLevel: '/src/assets/Audio/Move-to-new_level.mp3',
      resultGenerate: '/src/assets/Audio/resultgenerate.mp3',
      reset: '/src/assets/Audio/Reset.mp3',
      accuracyGoingBack: '/src/assets/Audio/AccuracyGoingBack.mp3',
      soundToggle: '/src/assets/Audio/SoundOnOffButton.mp3',
      // Score-based feedback audio
      score0to25: '/src/assets/Audio/0-25.mp3',
      score26to50: '/src/assets/Audio/26-50.mp3',
      score51to80: '/src/assets/Audio/51-80.mp3',
      score81to100: '/src/assets/Audio/81-100.mp3'
    };
    
    this.init();
  }

  async init() {
    // Preload critical sounds for better UX
    await this.preloadAudio([
      'buttonClick', 
      'resultGenerate', 
      'levelComplete',
      'score0to25',
      'score26to50', 
      'score51to80',
      'score81to100'
    ]);
    
    // Load audio preference from localStorage
    const savedPreference = localStorage.getItem('audioEnabled');
    if (savedPreference !== null) {
      this.audioEnabled = JSON.parse(savedPreference);
    }
    
    const savedVolume = localStorage.getItem('audioVolume');
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }
  }

  async preloadAudio(audioKeys) {
    const loadPromises = audioKeys.map(key => this.loadAudio(key));
    await Promise.allSettled(loadPromises);
  }

  async loadAudio(audioKey) {
    if (this.audioCache.has(audioKey)) {
      return this.audioCache.get(audioKey);
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio(this.audioFiles[audioKey]);
      audio.preload = 'auto';
      audio.volume = this.volume;
      
      audio.addEventListener('canplaythrough', () => {
        this.audioCache.set(audioKey, audio);
        resolve(audio);
      });
      
      audio.addEventListener('error', (e) => {
        console.warn(`Failed to load audio: ${audioKey}`, e);
        reject(e);
      });
    });
  }

  async playSound(audioKey, options = {}) {
    if (!this.audioEnabled && audioKey !== 'soundToggle') {
      return;
    }

    try {
      let audio = this.audioCache.get(audioKey);
      
      if (!audio) {
        audio = await this.loadAudio(audioKey);
      }
      
      // Clone audio for overlapping sounds
      const audioClone = audio.cloneNode();
      audioClone.volume = options.volume ?? this.volume;
      
      if (options.loop) {
        audioClone.loop = true;
      }
      
      const playPromise = audioClone.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Audio play failed:', error);
        });
      }
      
      return audioClone;
    } catch (error) {
      console.warn(`Failed to play audio: ${audioKey}`, error);
    }
  }

  // Specific game action sounds
  async playButtonClick() {
    await this.playSound('buttonClick', { volume: 0.5 });
  }

  async playLevelChange() {
    await this.playSound('moveToNewLevel', { volume: 0.6 });
  }

  async playLevelComplete() {
    await this.playSound('levelComplete', { volume: 0.8 });
  }

  async playImageGenerated() {
    await this.playSound('resultGenerate', { volume: 0.7 });
  }

  async playReset() {
    await this.playSound('reset', { volume: 0.6 });
  }

  async playAccuracyDecrease() {
    await this.playSound('accuracyGoingBack', { volume: 0.5 });
  }

  /**
   * Play audio feedback based on accuracy score
   * @param {number} accuracy - Score from 0-100
   */
  async playScoreBasedFeedback(accuracy) {
    let audioKey;
    let volume = 0.7;

    // Determine audio file and volume based on score ranges
    if (accuracy >= 81 && accuracy <= 100) {
      audioKey = 'score81to100';    // Excellent! 🎉
      volume = 0.8; // Loudest for excellent performance
    } else if (accuracy >= 51 && accuracy <= 80) {
      audioKey = 'score51to80';     // Good job! 👍
      volume = 0.7; // Good performance
    } else if (accuracy >= 26 && accuracy <= 50) {
      audioKey = 'score26to50';     // Keep trying! 💪
      volume = 0.6; // Average performance
    } else if (accuracy >= 0 && accuracy <= 25) {
      audioKey = 'score0to25';      // Try again! 🤔
      volume = 0.5; // Quiet for poor performance
    }

    console.log(`🎵 Playing score feedback for ${accuracy}%: ${audioKey}`);
    await this.playSound(audioKey, { volume });
  }

  async playBackgroundMusic() {
    if (this.currentBackgroundAudio) {
      return; // Already playing
    }
    
    this.currentBackgroundAudio = await this.playSound('backgroundSound', { 
      volume: 0.3, 
      loop: true 
    });
  }

  stopBackgroundMusic() {
    if (this.currentBackgroundAudio) {
      this.currentBackgroundAudio.pause();
      this.currentBackgroundAudio.currentTime = 0;
      this.currentBackgroundAudio = null;
    }
  }

  async toggleAudio() {
    await this.playSound('soundToggle', { volume: 0.8 });
    this.audioEnabled = !this.audioEnabled;
    localStorage.setItem('audioEnabled', JSON.stringify(this.audioEnabled));
    
    if (!this.audioEnabled) {
      this.stopBackgroundMusic();
    } else {
      // Small delay before starting background music
      setTimeout(() => this.playBackgroundMusic(), 500);
    }
    
    return this.audioEnabled;
  }

  setVolume(newVolume) {
    this.volume = Math.max(0, Math.min(1, newVolume));
    localStorage.setItem('audioVolume', this.volume.toString());
    
    // Update volume for cached audio
    this.audioCache.forEach(audio => {
      audio.volume = this.volume;
    });
    
    if (this.currentBackgroundAudio) {
      this.currentBackgroundAudio.volume = this.volume * 0.3; // Background music is quieter
    }
  }

  getAudioState() {
    return {
      enabled: this.audioEnabled,
      volume: this.volume
    };
  }

  // Clean up resources
  destroy() {
    this.stopBackgroundMusic();
    this.audioCache.forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    this.audioCache.clear();
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;

// Export individual functions for convenience
export const {
  playButtonClick,
  playLevelChange,
  playLevelComplete,
  playImageGenerated,
  playReset,
  playAccuracyDecrease,
  playScoreBasedFeedback,
  playBackgroundMusic,
  stopBackgroundMusic,
  toggleAudio,
  setVolume,
  getAudioState
} = audioManager;