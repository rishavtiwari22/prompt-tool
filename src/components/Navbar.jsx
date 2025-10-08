import React, { useState } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <nav className="bg-transparent px-2 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center justify-between">
      {/* Left side - Logo/Icon */}
      <div className="flex items-center flex-shrink-0">
        <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 bg-gray-100 rounded-lg flex items-center justify-center">
          {/* Custom Logo Icon */}
          <img 
            src="/src/assets/left-top.svg" 
            alt="Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
          />
        </div>
      </div>

      {/* Hamburger Menu Button (Mobile Only) */}
      <button 
        className="md:hidden w-8 h-8 flex flex-col justify-center items-center space-y-1"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>

      {/* Center - Level buttons (Desktop) */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-lg mx-2 sm:mx-4">
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg transition-all duration-200 hover:scale-105 sm:hover:scale-110 ${
                level === 1
                  ? 'bg-purple-50'
                  : 'bg-transparent hover:bg-gray-50'
              }`}
            >
              <img 
                src={`/src/assets/${level}.svg`} 
                alt={`Level ${level}`}
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-16 lg:h-16"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Right side - Action buttons (Desktop) */}
      <div className="hidden md:flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
        {/* Document/Guide button */}
        <button className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-200">
          <img 
            src="/src/assets/speaker.svg" 
            alt="Speaker/Guide"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
          />
        </button>

        {/* Rules button */}
        <button className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-26 lg:h-26 rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-200">
          <img 
            src="/src/assets/rules.svg" 
            alt="Rules"
            className="w-18 h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 lg:w-24 lg:h-24"
          />
        </button>

        {/* Settings button */}
        <button className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-200">
          <img 
            src="/src/assets/user.svg" 
            alt="User/Settings"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
          />
        </button>
      </div>
    </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden z-50">
          {/* Level buttons for mobile */}
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Levels</h3>
            <div className="flex items-center justify-center space-x-3">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 hover:scale-105 ${
                    level === 1
                      ? 'bg-purple-50'
                      : 'bg-transparent hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img 
                    src={`/src/assets/${level}.svg`} 
                    alt={`Level ${level}`}
                    className="w-8 h-8"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons for mobile */}
          <div className="px-4 py-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Actions</h3>
            <div className="flex items-center justify-center space-x-4">
              {/* Document/Guide button */}
              <button 
                className="w-12 h-12 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <img 
                  src="/src/assets/speaker.svg" 
                  alt="Speaker/Guide"
                  className="w-7 h-7"
                />
              </button>

              {/* Rules button */}
              <button 
                className="w-12 h-12 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <img 
                  src="/src/assets/rules.svg" 
                  alt="Rules"
                  className="w-9 h-9"
                />
              </button>

              {/* Settings button */}
              <button 
                className="w-12 h-12 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <img 
                  src="/src/assets/user.svg" 
                  alt="User/Settings"
                  className="w-7 h-7"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
