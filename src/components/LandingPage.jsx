

import React, { useState, useEffect } from "react";
import {
  Play,
  Sparkles,
  Palette,
  Target,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import audioManager from "../utils/audioManager";
import "../styles/landing.css";
// Import image assets properly for production
import leftTopIcon from "../assets/left-top.svg";

const LandingPage = ({ onStartGame }) => {
  const [isStarting, setIsStarting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Preload the logo image
    const img = new Image();
    img.onload = () => {
      console.log("Landing page logo loaded successfully");
      setImageLoaded(true);
    };
    img.onerror = (e) => {
      console.error("Failed to load landing page logo:", e);
      setImageError(true);
    };
    img.src = leftTopIcon;
  }, []);

  const handleStartGame = async () => {
    setIsStarting(true);

    try {
      // Play button click sound
      await audioManager.playButtonClick();

      // Smooth transition delay
      setTimeout(() => {
        onStartGame();
      }, 1200);
    } catch (error) {
      console.warn("Audio failed to start:", error);
      setTimeout(() => {
        onStartGame();
      }, 800);
    }
  };

  return (
    <div
      className="landing-page-container min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 25% 25%, var(--color-dot) 2px, transparent 2px),
          radial-gradient(circle at 75% 75%, var(--color-dot) 2px, transparent 2px),
          var(--color-bg)
        `,
        backgroundSize: "60px 60px",
        backgroundPosition: "0 0, 30px 30px",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs with brand colors */}
        <div
          className={`absolute top-20 left-20 w-32 h-32 rounded-full opacity-10 transition-all duration-[3000ms] ${
            mounted ? "animate-float" : ""
          }`}
          style={{
            backgroundColor: "var(--color-primary)",
            filter: "blur(20px)",
            animationDelay: "0s",
          }}
        />
        <div
          className={`absolute top-32 right-24 w-24 h-24 rounded-full opacity-15 transition-all duration-[4000ms] ${
            mounted ? "animate-float" : ""
          }`}
          style={{
            backgroundColor: "var(--color-secondary)",
            filter: "blur(15px)",
            animationDelay: "1s",
          }}
        />
        <div
          className={`absolute bottom-32 left-32 w-40 h-40 rounded-full opacity-8 transition-all duration-[5000ms] ${
            mounted ? "animate-float" : ""
          }`}
          style={{
            backgroundColor: "var(--color-accent)",
            filter: "blur(25px)",
            animationDelay: "2s",
          }}
        />
        <div
          className={`absolute bottom-20 right-20 w-28 h-28 rounded-full opacity-12 transition-all duration-[3500ms] ${
            mounted ? "animate-float" : ""
          }`}
          style={{
            backgroundColor: "var(--color-success)",
            filter: "blur(18px)",
            animationDelay: "0.5s",
          }}
        />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Logo area */}
        <div
          className={`mb-8 mt-8 sm:mt-0 transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div
            className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-110"
            style={{
              backgroundColor: "var(--color-primary-light)",
              border: "2px solid var(--color-primary)",
            }}
          >
            {!imageError ? (
              <img
                src={leftTopIcon}
                alt="Prompt Learning Tool"
                className={`w-10 h-10 transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onError={(e) => {
                  console.error("Failed to load logo image:", e);
                  setImageError(true);
                }}
                onLoad={() => {
                  console.log("Logo loaded successfully");
                  setImageLoaded(true);
                }}
              />
            ) : (
              // Fallback icon if image fails to load
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ color: "var(--color-primary)" }}
              >
                <ImageIcon size={28} />
              </div>
            )}
          </div>
        </div>

        {/* Hero content */}
        <div className="max-w-4xl mx-auto">
          {/* Main headline */}
          <h1
            className={`mb-6 transition-all duration-1000 delay-400 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              lineHeight: "1.2",
              color: "var(--color-text-primary)",
              textShadow: "2px 2px 0px rgba(115, 69, 228, 0.1)",
            }}
          >
            <span
              style={{
                display: "block",
                // marginBottom: "0.5rem",
                color: "var(--color-text-primary)",
              }}
            >
              Image genie
            </span>
            <span
              style={{
                display: "block",
                color: "var(--color-primary)",
              }}
            >
              Abracadraw
            </span>
          </h1>

          {/* Subtitle - Three lines with visual hierarchy */}
          <div
            className={`mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-600 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-text-secondary)",
              letterSpacing: "0.3px",
            }}
          >
            {/* Main tagline - Larger and bold */}
            <p
              style={{
                fontSize: "clamp(1.2rem, 2.8vw, 1.5rem)",
                lineHeight: "1.6",
                fontWeight: "600",
                marginBottom: "1.5rem",
                color: "var(--color-text-primary)",
              }}
            >
              Say the magic words and bring images to life. Level up your prompt
              power play with the Image Genie!
            </p>

            {/* Supporting line 1 */}
            <p
              style={{
                fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
                lineHeight: "1.7",
                marginBottom: "0.75rem",
              }}
            >
              Beat every challenge with the magic of your words!
            </p>

            {/* Supporting line 2 */}
            <p
              style={{
                fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
                lineHeight: "1.7",
              }}
            >
              Describe it right, and your genie brings it to life!
            </p>
          </div>

          {/* Feature highlights */}
          <div
            className={`flex flex-wrap justify-center gap-6 mb-12 transition-all duration-1000 delay-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div
              className="flex items-center space-x-2 px-4 py-2 rounded-full"
              style={{ backgroundColor: "var(--color-secondary-light)" }}
            >
              <Target size={16} style={{ color: "var(--color-secondary)" }} />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-secondary-dark)",
                  fontSize: "14px",
                }}
              >
                5 Challenge Levels
              </span>
            </div>
            <div
              className="flex items-center space-x-2 px-4 py-2 rounded-full"
              style={{ backgroundColor: "var(--color-accent-light)" }}
            >
              <Palette size={16} style={{ color: "var(--color-accent)" }} />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-accent-dark)",
                  fontSize: "14px",
                }}
              >
                AI Image Generation
              </span>
            </div>
            <div
              className="flex items-center space-x-2 px-4 py-2 rounded-full"
              style={{ backgroundColor: "var(--color-success-light)" }}
            >
              <Star size={16} style={{ color: "var(--color-success)" }} />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-success)",
                  fontSize: "14px",
                }}
              >
                Real-time Feedback
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div
            className={`transition-all duration-1000 delay-900 ${
              mounted
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-95"
            }`}
          >
            <button
              onClick={handleStartGame}
              disabled={isStarting}
              className={`
                group relative inline-flex items-center justify-center
                px-12 py-5 text-xl font-medium rounded-2xl
                transition-all duration-500 transform
                hover:scale-105 hover:shadow-2xl
                focus:outline-none focus:ring-4 focus:ring-opacity-50
                disabled:cursor-not-allowed
                ${
                  isStarting ? "animate-pulse scale-95" : "hover:-translate-y-1"
                }
              `}
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-contrast)",
                border: "3px solid var(--color-primary-dark)",
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
                letterSpacing: "0.5px",
                textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                boxShadow: `
                  0 8px 32px rgba(115, 69, 228, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `,
                focusRingColor: "var(--color-primary)",
                minWidth: "240px",
              }}
            >
              {isStarting ? (
                <>
                  <Sparkles className="mr-3 animate-spin" size={24} />
                  Launching Adventure...
                </>
              ) : (
                <>
                  <Play
                    className="mr-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110"
                    size={24}
                  />
                  Let's Play
                </>
              )}

              {/* Button shine effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 landing-shimmer-effect" />
            </button>
          </div>
        </div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full opacity-30 transition-all duration-1000 delay-${
              (i + 1) * 200
            } ${mounted ? "animate-particle" : ""}`}
            style={{
              backgroundColor:
                i % 2 === 0 ? "var(--color-primary)" : "var(--color-secondary)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;