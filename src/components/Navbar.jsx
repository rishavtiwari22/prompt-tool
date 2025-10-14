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


function Navbar({ currentLevel, onLevelChange, unlockedLevels = [1] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const handleLevelChange = async (level) => {
    await audioManager.playLevelChange();
    onLevelChange && onLevelChange(level);
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
        <nav className="bg-transparent py-2 sm:py-3">
          <div
            className="w-full px-3 sm:px-6 lg:px-10 grid items-center gap-4 sm:gap-6 md:gap-8"
            style={{
              gridTemplateColumns: "1fr auto 1fr",
              overflow: "visible", // Allow children to be visible but parent clips
            }}
          >
            {/* Left side - Logo/Icon (Hidden on mobile) */}
            <div className="hidden md:flex items-center flex-shrink-0">
              <div
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 bg-gray-100 rounded-lg flex items-center justify-center"
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
                {[1, 2, 3, 4, 5].map((level) => {
                  const isUnlocked = unlockedLevels.includes(level);
                  const isCurrent = level === currentLevel;
                  const iconColor = isCurrent
                    ? 'var(--Primary-Primary, rgba(115, 69, 228, 1))'
                    : isUnlocked
                    ? 'rgba(34, 139, 34, 1)'
                    : 'rgba(130,130,130,1)';
                  return (
                    <button
                      key={level}
                      onClick={() => isUnlocked && onLevelChange && onLevelChange(level)}
                      className="flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 hover:scale-105"
                      style={{ willChange: 'transform' }}
                      aria-disabled={!isUnlocked}
                    >
                      {/* icon as masked element so we can recolor via backgroundColor */}
                      <span
                        aria-hidden="true"
                        className="w-14 h-14"
                        style={{
                          display: 'inline-block',
                          backgroundColor: iconColor,
                          WebkitMaskImage: `url(/src/assets/${level}.svg)`,
                          maskImage: `url(/src/assets/${level}.svg)`,
                          WebkitMaskSize: 'contain',
                          maskSize: 'contain',
                          WebkitMaskRepeat: 'no-repeat',
                          maskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center',
                          maskPosition: 'center',
                          opacity: isUnlocked ? 1 : 0.45
                        }}
                      />
                    </button>
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
                {[1, 2, 3, 4, 5].map((level) => {
                  const isUnlocked = unlockedLevels.includes(level);
                  const isCurrent = level === currentLevel;
                  const iconColor = isCurrent
                    ? 'var(--Primary-Primary, rgba(115, 69, 228, 1))'
                    : isUnlocked
                    ? 'rgba(34, 139, 34, 1)'
                    : 'rgba(130,130,130,1)';
                  return (
                    <button
                      key={level}
                      onClick={() => isUnlocked && handleLevelChange(level)}
                      className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg transition-all duration-200 hover:scale-105 sm:hover:scale-110"
                      style={{ willChange: 'transform' }}
                      aria-disabled={!isUnlocked}
                    >
                      <span
                        aria-hidden="true"
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-18 lg:h-18"
                        style={{
                          display: 'inline-block',
                          backgroundColor: iconColor,
                          WebkitMaskImage: `url(/src/assets/${level}.svg)`,
                          maskImage: `url(/src/assets/${level}.svg)`,
                          WebkitMaskSize: 'contain',
                          maskSize: 'contain',
                          WebkitMaskRepeat: 'no-repeat',
                          maskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center',
                          maskPosition: 'center',
                          opacity: isUnlocked ? 1 : 0.45
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right side - User, Speaker, Rules (Hidden on mobile) */}
            <div className="hidden md:flex items-center flex-shrink-0 space-x-4">
              {/* User Icon */}
             

              {/* Speaker Icon with Audio Control */}
              <div className="flex items-center space-x-2">
                
                <AudioControl />
              </div>

              {/* Rules Button */}
              <button
                onClick={handleRulesToggle}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg transition-all duration-200 hover:bg-gray-200"
              >
                <img
                  src={rulesIcon}
                  alt="Rules"
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">Rules</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu - Levels and Rules */}
        {isMenuOpen && (
          <div className="absolute top-0 left-0 w-full bg-white shadow-lg z-50">
            <div className="px-4 py-2">
              {/* Close button */}
              <div className="flex justify-end">
                <button
                  onClick={handleMenuToggle}
                  className="text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Level buttons - stacked layout for mobile */}
              <div className="grid grid-cols-3 gap-4 py-4">
                {[1, 2, 3, 4, 5].map((level) => {
                  const isUnlocked = unlockedLevels.includes(level);
                  const isCurrent = level === currentLevel;
                  const iconColor = isCurrent
                    ? 'var(--Primary-Primary, rgba(115, 69, 228, 1))'
                    : isUnlocked
                    ? 'rgba(34, 139, 34, 1)'
                    : 'rgba(130,130,130,1)';
                  return (
                    <button
                      key={level}
                      onClick={() => isUnlocked && onLevelChange && onLevelChange(level)}
                      className="flex items-center justify-center w-full h-16 rounded-lg transition-all duration-200 hover:scale-105"
                      style={{ willChange: 'transform' }}
                      aria-disabled={!isUnlocked}
                    >
                      <span
                        aria-hidden="true"
                        className="w-10 h-10"
                        style={{
                          display: 'inline-block',
                          backgroundColor: iconColor,
                          WebkitMaskImage: `url(/src/assets/${level}.svg)`,
                          maskImage: `url(/src/assets/${level}.svg)`,
                          WebkitMaskSize: 'contain',
                          maskSize: 'contain',
                          WebkitMaskRepeat: 'no-repeat',
                          maskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center',
                          maskPosition: 'center',
                          opacity: isUnlocked ? 1 : 0.45
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Rules button (stacked under levels) */}
              
            </div>
          </div>
        )}

        {/* Rules Modal */}
        {isRulesOpen && <RulesModal onClose={handleRulesToggle} />}
      </div>
    </>
  );
}

export default Navbar;
