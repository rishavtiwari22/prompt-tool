import { useState, useEffect } from "react";
import audioManager from "../utils/audioManager";
import speakerIcon from "../assets/speaker.svg";
import offSpeakerIcon from "../assets/offspeaker.svg";

const AudioControl = ({ className = "" }) => {
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    const initAudio = async () => {
      try {
        // Initialize audio state from audioManager
        const audioState = audioManager.getAudioState();
        setAudioEnabled(audioState.enabled);

        // Test audio accessibility
        console.log("AudioControl: Testing audio system...");
        await audioManager.testAudioAccessibility();
      } catch (error) {
        console.warn("AudioControl: Audio initialization failed:", error);
      }
    };

    initAudio();

    // Cleanup on unmount
    return () => {
      // No cleanup needed for background music anymore
    };
  }, []);

  const handleToggleAudio = async () => {
    const newState = await audioManager.toggleAudio();
    setAudioEnabled(newState);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Audio Toggle Button */}
      <button
        onClick={handleToggleAudio}
        className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-26 lg:h-26 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
        title={audioEnabled ? "Mute Sound" : "Enable Sound"}
        style={{ willChange: "transform" }}
      >
        <img 
          src={audioEnabled ? speakerIcon : offSpeakerIcon} 
          alt={audioEnabled ? "Sound On" : "Sound Off"}
          className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-13 lg:h-13 transition-all duration-200"
        />
      </button>
    </div>
  );
};

export default AudioControl;