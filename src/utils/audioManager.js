// Audio Manager for Prompt Learning Tool Game
// Manages all game audio effects with proper UX considerations

class AudioManager {
  constructor() {
    this.audioEnabled = true;
    this.volume = 0.7;
    this.audioCache = new Map();
    this.currentBackgroundAudio = null;

    // Audio file mappings - using public folder paths for deployment
    this.audioFiles = {
      backgroundSound: "/audio/backgroundSound.mp3",
      buttonClick: "/audio/ButtonClick.mp3",
      levelComplete: "/audio/Level-completion.mp3",
      moveToNewLevel: "/audio/Move-to-new_level.mp3",
      resultGenerate: "/audio/resultgenerate.mp3",
      reset: "/audio/Reset.mp3",
      accuracyGoingBack: "/audio/AccuracyGoingBack.mp3",
      soundToggle: "/audio/SoundOnOffButton.mp3",
      // Score-based feedback audio
      score0to25: "/audio/0-25.mp3",
      score26to50: "/audio/26-50.mp3",
      score51to80: "/audio/51-80.mp3",
      score81to100: "/audio/81-100.mp3",
    };

    this.init();
  }

  async init() {
    // Load audio preference from localStorage
    const savedPreference = localStorage.getItem("audioEnabled");
    if (savedPreference !== null) {
      this.audioEnabled = JSON.parse(savedPreference);
    }

    const savedVolume = localStorage.getItem("audioVolume");
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }

    // Test audio file accessibility
    console.log("Testing audio file accessibility...");
    await this.testAudioAccessibility();

    // Preload critical sounds for better UX (only if audio is enabled)
    if (this.audioEnabled) {
      console.log("Preloading critical audio files...");
      await this.preloadAudio([
        "buttonClick",
        "resultGenerate",
        "levelComplete",
        "score0to25",
        "score26to50",
        "score51to80",
        "score81to100",
      ]);
    }
  }

  async testAudioAccessibility() {
    const testKeys = ["buttonClick", "resultGenerate"];
    const results = [];

    for (const key of testKeys) {
      try {
        const response = await fetch(this.audioFiles[key], { method: "HEAD" });
        results.push({
          file: key,
          path: this.audioFiles[key],
          accessible: response.ok,
          status: response.status,
        });
        console.log(
          `Audio file ${key}: ${response.ok ? "OK" : "FAILED"} (${
            response.status
          })`
        );
      } catch (error) {
        results.push({
          file: key,
          path: this.audioFiles[key],
          accessible: false,
          error: error.message,
        });
        console.error(`Audio file ${key}: FAILED -`, error.message);
      }
    }

    return results;
  }

  async preloadAudio(audioKeys) {
    const loadPromises = audioKeys.map((key) => this.loadAudio(key));
    const results = await Promise.allSettled(loadPromises);

    // Log results
    results.forEach((result, index) => {
      const key = audioKeys[index];
      if (result.status === "fulfilled") {
        console.log(`✓ Preloaded: ${key}`);
      } else {
        console.warn(`✗ Failed to preload: ${key}`, result.reason);
      }
    });
  }

  // Fallback audio generation using Web Audio API
  createFallbackTone(frequency = 440, duration = 0.2, type = "sine") {
    if (typeof window === "undefined" || !window.AudioContext) {
      return null;
    }

    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        this.volume * 0.3,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);

      return oscillator;
    } catch (error) {
      console.warn("Failed to create fallback tone:", error);
      return null;
    }
  }

  async loadAudio(audioKey) {
    if (this.audioCache.has(audioKey)) {
      return this.audioCache.get(audioKey);
    }

    return new Promise((resolve, reject) => {
      const audioPath = this.audioFiles[audioKey];
      if (!audioPath) {
        console.warn(`Audio key not found: ${audioKey}`);
        reject(new Error(`Audio key not found: ${audioKey}`));
        return;
      }

      const audio = new Audio(audioPath);
      audio.preload = "auto";
      audio.volume = this.volume;

      // Add timeout for loading
      const timeout = setTimeout(() => {
        console.warn(`Audio loading timeout for: ${audioKey}`);
        reject(new Error(`Audio loading timeout: ${audioKey}`));
      }, 5000);

      audio.addEventListener("canplaythrough", () => {
        clearTimeout(timeout);
        this.audioCache.set(audioKey, audio);
        console.log(`Audio loaded successfully: ${audioKey}`);
        resolve(audio);
      });

      audio.addEventListener("loadeddata", () => {
        // Fallback if canplaythrough doesn't fire
        if (!this.audioCache.has(audioKey)) {
          clearTimeout(timeout);
          this.audioCache.set(audioKey, audio);
          console.log(`Audio loaded (fallback): ${audioKey}`);
          resolve(audio);
        }
      });

      audio.addEventListener("error", (e) => {
        clearTimeout(timeout);
        console.error(`Failed to load audio: ${audioKey}`, {
          error: e,
          path: audioPath,
          networkState: audio.networkState,
          readyState: audio.readyState,
        });
        reject(e);
      });

      // Start loading
      audio.load();
    });
  }

  async playSound(audioKey, options = {}) {
    if (!this.audioEnabled && audioKey !== "soundToggle") {
      return Promise.resolve();
    }

    try {
      let audio = this.audioCache.get(audioKey);

      if (!audio) {
        console.log(`Loading audio for: ${audioKey}`);
        audio = await this.loadAudio(audioKey);
      }

      // Clone audio for overlapping sounds
      const audioClone = audio.cloneNode();
      audioClone.volume = options.volume ?? this.volume;

      if (options.loop) {
        audioClone.loop = true;
      }

      // Add error handling for the cloned audio
      audioClone.addEventListener("error", (e) => {
        console.warn(`Playback error for ${audioKey}:`, e);
      });

      const playPromise = audioClone.play();

      if (playPromise !== undefined) {
        return playPromise.catch((error) => {
          console.warn(`Audio play failed for ${audioKey}:`, error);
        });
      }

      return audioClone;
    } catch (error) {
      console.warn(`Failed to play audio: ${audioKey}`, error);
      // Fallback to generated tone
      this.playFallbackTone(audioKey);
    }
  }

  playFallbackTone(audioKey) {
    const toneMap = {
      buttonClick: { frequency: 800, duration: 0.1 },
      levelComplete: { frequency: 523, duration: 0.5 }, // C note
      resultGenerate: { frequency: 659, duration: 0.3 }, // E note
      reset: { frequency: 392, duration: 0.2 }, // G note
      moveToNewLevel: { frequency: 698, duration: 0.4 }, // F note
      score0to25: { frequency: 330, duration: 0.3 },
      score26to50: { frequency: 440, duration: 0.3 },
      score51to80: { frequency: 554, duration: 0.3 },
      score81to100: { frequency: 659, duration: 0.4 },
    };

    const toneConfig = toneMap[audioKey] || { frequency: 440, duration: 0.2 };
    this.createFallbackTone(toneConfig.frequency, toneConfig.duration);
  }

  // Specific game action sounds
  async playButtonClick() {
    await this.playSound("buttonClick", { volume: 0.5 });
  }

  async playLevelChange() {
    await this.playSound("moveToNewLevel", { volume: 0.6 });
  }

  async playLevelComplete() {
    await this.playSound("levelComplete", { volume: 0.8 });
  }

  async playImageGenerated() {
    await this.playSound("resultGenerate", { volume: 0.7 });
  }

  async playReset() {
    await this.playSound("reset", { volume: 0.6 });
  }

  async playAccuracyDecrease() {
    await this.playSound("accuracyGoingBack", { volume: 0.5 });
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
      audioKey = "score81to100"; // Excellent! 🎉
      volume = 0.8; // Loudest for excellent performance
    } else if (accuracy >= 51 && accuracy <= 80) {
      audioKey = "score51to80"; // Good job! 👍
      volume = 0.7; // Good performance
    } else if (accuracy >= 26 && accuracy <= 50) {
      audioKey = "score26to50"; // Keep trying! 💪
      volume = 0.6; // Average performance
    } else if (accuracy >= 0 && accuracy <= 25) {
      audioKey = "score0to25"; // Try again! 🤔
      volume = 0.5; // Quiet for poor performance
    }

    console.log(`🎵 Playing score feedback for ${accuracy}%: ${audioKey}`);
    await this.playSound(audioKey, { volume });
  }

  async playBackgroundMusic() {
    if (this.currentBackgroundAudio) {
      return; // Already playing
    }

    this.currentBackgroundAudio = await this.playSound("backgroundSound", {
      volume: 0.3,
      loop: true,
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
    await this.playSound("soundToggle", { volume: 0.8 });
    this.audioEnabled = !this.audioEnabled;
    localStorage.setItem("audioEnabled", JSON.stringify(this.audioEnabled));

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
    localStorage.setItem("audioVolume", this.volume.toString());

    // Update volume for cached audio
    this.audioCache.forEach((audio) => {
      audio.volume = this.volume;
    });

    if (this.currentBackgroundAudio) {
      this.currentBackgroundAudio.volume = this.volume * 0.3; // Background music is quieter
    }
  }

  getAudioState() {
    return {
      enabled: this.audioEnabled,
      volume: this.volume,
    };
  }

  // Clean up resources
  destroy() {
    this.stopBackgroundMusic();
    this.audioCache.forEach((audio) => {
      audio.pause();
      audio.src = "";
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
  getAudioState,
} = audioManager;
