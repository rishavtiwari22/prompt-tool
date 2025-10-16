
import React, { useState } from "react";
import RulesModal from "../components/RulesModal";
import AudioControl from "../components/AudioControl";
import audioManager from "../utils/audioManager";

// Import images from src/assets
import leftTopIcon from "../assets/left-top.svg";
import speakerIcon from "../assets/speaker.svg";
import rulesIcon from "../assets/rules.svg";
import userIcon from "../assets/user.svg";
import level1Icon from "../assets/1.svg";
import level2Icon from "../assets/2.svg";
import level3Icon from "../assets/3.svg";
import level4Icon from "../assets/4.svg";
import level5Icon from "../assets/5.svg";

function Navbar({
  currentLevel,
  onLevelChange,
  unlockedLevels = [1],
  completedLevels = [],
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  // Only handle currentLevel change for unlocked levels
  const handleLevelChange = async (level) => {
    if (unlockedLevels.includes(level)) {
      await audioManager.playLevelChange();
      onLevelChange && onLevelChange(level);
    }
  };

  const handleMenuToggle = async () => {
    await audioManager.playButtonClick();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleRulesToggle = async () => {
    await audioManager.playButtonClick();
    setIsRulesOpen(!isRulesOpen);
  };

  const levelIcons = [
    level1Icon,
    level2Icon,
    level3Icon,
    level4Icon,
    level5Icon,
  ];

  return (
    <>
      {/* Wrapper to prevent horizontal overflow */}
      <div
        className="relative"
        style={{ overflow: isMenuOpen ? "visible" : "hidden" }}
      >
        <nav
          className="bg-transparent py-2 sm:py-3"
          style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
        >
          <div
            className="w-full px-3 sm:px-6 lg:px-8 grid items-center gap-4 sm:gap-6 md:gap-6"
            style={{
              gridTemplateColumns: "1fr auto 1fr",
              overflow: "visible",
            }}
          >
            {/* Left side - Logo/Icon (Hidden on mobile) */}
            <div className="hidden md:flex items-center flex-shrink-0">
              <div
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 bg-white rounded-lg flex items-center justify-center"
                style={{ willChange: "transform" }}
              >
                <img
                  src={leftTopIcon}
                  alt="Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
                />
              </div>
            </div>

            {/* Center - Level buttons (Mobile) */}
            <div className="flex md:hidden items-center justify-center flex-1 mx-2 pt-3">
              <div className="flex items-center space-x-3">
                {[1, 2, 3, 4, 5].map((level, idx) => {
                  const isUnlocked = unlockedLevels.includes(level);
                  const isCompleted = completedLevels.includes(level);
                  const isActive = level === currentLevel;

                  // Determine icon color filter
                  let iconFilter = "none";
                  if (isActive && isUnlocked) {
                    // Purple for active level: rgba(115, 69, 228, 1)
                    iconFilter =
                      "brightness(0) saturate(100%) invert(28%) sepia(74%) saturate(2447%) hue-rotate(246deg) brightness(90%) contrast(91%)";
                  } else if (isCompleted) {
                    // Green for completed: rgba(34, 139, 34, 1)
                    iconFilter =
                      "brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(556%) hue-rotate(81deg) brightness(94%) contrast(88%)";
                  }

                  return (
                    <div key={level} className="flex flex-col items-center">
                      <span
                        className="text-sm sm:text-base md:text-lg lg:text-xl"
                        style={{
                          fontFamily: "'Patrick Hand SC', cursive",
                          fontWeight: 400,
                          fontStyle: "normal",
                          lineHeight: "1",
                          letterSpacing: "-0.28px",
                          textAlign: "center",
                          color: isUnlocked
                            ? "rgba(0, 0, 0, 1)"
                            : "var(--Text-Icon, rgba(130, 130, 130, 1))",
                          marginBottom: "-7px",
                        }}
                      >
                        Level
                      </span>
                      <button
                        onClick={() => handleLevelChange(level)}
                        className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
                          isUnlocked ? "hover:scale-105 cursor-pointer" : ""
                        }`}
                        style={{ willChange: "transform" }}
                        aria-disabled={!isUnlocked}
                        disabled={!isUnlocked}
                      >
                        <img
                          src={levelIcons[idx]}
                          alt={`Level ${level}`}
                          className="w-14 h-14"
                          style={{
                            opacity: isUnlocked ? 1 : 0.45,
                            pointerEvents: isUnlocked ? "auto" : "none",
                            filter: iconFilter,
                            transition: "filter 0.3s ease",
                          }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hamburger Menu Button (Mobile Only) */}
            <button
              className="md:hidden w-8 h-8 flex flex-col justify-center items-center space-y-1"
              onClick={handleMenuToggle}
            >
              <span
                className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </button>

            {/* Center - Level buttons (Desktop) */}
            <div className="hidden md:flex items-center justify-center mx-2 sm:mx-4 justify-self-center">
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4">
                {[1, 2, 3, 4, 5].map((level, idx) => {
                  const isUnlocked = unlockedLevels.includes(level);
                  const isCompleted = completedLevels.includes(level);
                  const isActive = level === currentLevel;

                  // Determine icon color filter
                  let iconFilter = "none";
                  if (isActive && isUnlocked) {
                    // Purple for active level: rgba(115, 69, 228, 1)
                    iconFilter =
                      "brightness(0) saturate(100%) invert(28%) sepia(74%) saturate(2447%) hue-rotate(246deg) brightness(90%) contrast(91%)";
                  } else if (isCompleted) {
                    // Green for completed: rgba(34, 139, 34, 1)
                    iconFilter =
                      "brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(556%) hue-rotate(81deg) brightness(94%) contrast(88%)";
                  }

                  return (
                    <div key={level} className="flex flex-col items-center">
                      <span
                        className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
                        style={{
                          fontFamily: "'Patrick Hand SC', cursive",
                          fontWeight: 400,
                          fontStyle: "normal",
                          lineHeight: "1",
                          letterSpacing: "-0.28px",
                          textAlign: "center",
                          color: isUnlocked
                            ? "rgba(0, 0, 0, 1)"
                            : "var(--Text-Icon, rgba(130, 130, 130, 1))",
                          marginBottom: "-6px",
                        }}
                      >
                        Level
                      </span>
                      <button
                        onClick={() => handleLevelChange(level)}
                        className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg transition-all duration-200 ${
                          isUnlocked
                            ? "hover:scale-105 sm:hover:scale-110 cursor-pointer"
                            : ""
                        }`}
                        style={{ willChange: "transform" }}
                        aria-disabled={!isUnlocked}
                        disabled={!isUnlocked}
                      >
                        <img
                          src={levelIcons[idx]}
                          alt={`Level ${level}`}
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-18 lg:h-18"
                          style={{
                            opacity: isUnlocked ? 1 : 0.45,
                            pointerEvents: isUnlocked ? "auto" : "none",
                            filter: iconFilter,
                            transition: "filter 0.3s ease",
                          }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right side - Action buttons (Desktop) */}
            <div className="hidden md:flex items-center space-x-0.5 sm:space-x-1 md:space-x-1.5 flex-shrink-0 justify-self-end mr-2 sm:mr-3 md:mr-5">
              <AudioControl />

              <button
                onClick={handleRulesToggle}
                className="rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-200 cursor-pointer"
                style={{ willChange: "transform" }}
              >
                <img
                  src={rulesIcon}
                  alt="Rules"
                  className="w-18 h-18 sm:w-22 sm:h-22 md:w-26 md:h-26 lg:w-30 lg:h-30"
                />
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden z-50 py-5">
            <div className="px-4">
              <h3 className="text-base font-medium text-gray-700 mb-5 text-center">
                Actions
              </h3>

              {/* Horizontal Icon Row */}
              <div className="flex items-center justify-center gap-6">
                {/* Sound Control Button */}
                <button
                  onClick={async () => {
                    await audioManager.toggleAudio();
                    audioManager.playButtonClick();
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <div className="w-16 h-16 flex items-center justify-center">
                    <AudioControl className="!space-x-0" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Sound
                  </span>
                </button>

                {/* Rules Button */}
                <button
                  onClick={async () => {
                    await audioManager.playButtonClick();
                    setIsMenuOpen(false);
                    setIsRulesOpen(true);
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-pink-200 bg-pink-50 hover:bg-pink-100 transition-colors cursor-pointer"
                >
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img src={rulesIcon} alt="Rules" className="w-14 h-14" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    How to Play
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rules Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </>
  );
}

export default Navbar;
