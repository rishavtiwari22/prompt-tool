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
        className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 ${
          audioEnabled
            ? "bg-green-100 hover:bg-green-200"
            : "bg-red-100 hover:bg-red-200"
        }`}
        title={audioEnabled ? "Mute Sound" : "Enable Sound"}
        style={{ willChange: "transform" }}
      >
        <img 
          src={audioEnabled ? speakerIcon : offSpeakerIcon} 
          alt={audioEnabled ? "Sound On" : "Sound Off"}
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 transition-all duration-200"
        />
      </button>
    </div>
  );
};

export default AudioControl;
