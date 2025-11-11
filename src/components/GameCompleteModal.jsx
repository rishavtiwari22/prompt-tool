import React, { useState, useEffect } from "react";
import { ExternalLink, RotateCcw, X } from "lucide-react";

const GameCompleteModal = ({ isOpen, onClose, onPlayAgain }) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);

    if (isOpen) {
      // Create confetti effect
      const timer1 = setTimeout(() => createConfetti(), 500);
      const timer2 = setTimeout(() => createConfetti(), 1500);
      const timer3 = setTimeout(() => createConfetti(), 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  const createConfetti = () => {
    const colors = [
      "var(--color-primary)",
      "var(--color-secondary)",
      "var(--color-accent)",
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#ffa502",
      "#ff6348",
    ];
    const shapes = ["●", "■", "▲", "★", "♦", "●"];
    const confettiCount = 80;

    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        confetti.className = "game-complete-confetti";
        confetti.textContent =
          shapes[Math.floor(Math.random() * shapes.length)];
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.color =
          colors[Math.floor(Math.random() * colors.length)];
        confetti.style.fontSize = Math.random() * 12 + 16 + "px";
        confetti.style.animation = `gameCompleteConfettiFall ${
          Math.random() * 4 + 3
        }s linear forwards`;
        confetti.style.animationDelay = Math.random() * 0.5 + "s";
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 8000);
      }, i * 25);
    }
  };

  const handleFeedbackClick = () => {
    // Open Google Form in new tab
    window.open(
      "https://docs.google.com/forms/d/1Lg1VIMnDYFWdy4V6teHpHjUI1dHtn_u2TX9v6edDaSk/viewform?edit_requested=true",
      "_blank"
    );
  };

  const handlePlayAgain = () => {
    if (onPlayAgain) {
      onPlayAgain();
    }
    handleClose();
  };

  const handleClose = () => {
    const overlay = document.querySelector(".game-complete-overlay");
    const modal = document.querySelector(".game-complete-container");
    if (modal)
      modal.style.animation = "gameCompleteSlideOut 0.4s ease-out forwards";
    if (overlay)
      overlay.style.animation = "gameCompleteFadeOut 0.4s ease-out forwards";
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <>
      <style jsx>{`
        .game-complete-confetti {
          position: fixed;
          width: 12px;
          height: 12px;
          top: -20px;
          z-index: 1001;
          pointer-events: none;
          font-weight: bold;
        }

        @keyframes gameCompleteConfettiFall {
          0% {
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(1080deg);
            opacity: 0;
          }
        }

        @keyframes gameCompleteFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes gameCompleteFadeOut {
          to {
            opacity: 0;
          }
        }

        @keyframes gameCompleteSlideIn {
          0% {
            opacity: 0;
            transform: translateY(100px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes gameCompleteSlideOut {
          to {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
        }

        @keyframes gameCompleteBounce {
          0%,
          100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(-5px);
          }
          75% {
            transform: translateY(-8px);
          }
        }

        @keyframes gameCompleteGlow {
          0%,
          100% {
            text-shadow: 0 0 20px var(--color-primary);
          }
          50% {
            text-shadow: 0 0 30px var(--color-secondary),
              0 0 40px var(--color-accent);
          }
        }

        @keyframes gameCompletePulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>

      <div
        className="game-complete-overlay"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "gameCompleteFadeIn 0.3s ease-out",
          zIndex: 1000,
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          className="game-complete-container"
          style={{
            background:
              "linear-gradient(135deg, #fff5f0 0%, #ffffff 50%, #f0f9ff 100%)",
            borderRadius: "32px",
            padding: "3rem 2.5rem",
            maxWidth: "650px",
            width: "90%",
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.4)",
            position: "relative",
            animation:
              "gameCompleteSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            border: `4px solid var(--color-primary-light)`,
            textAlign: "center",
            fontFamily: "var(--font-body)",
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              background: "rgba(0, 0, 0, 0.05)",
              border: "none",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              fontSize: "1.5rem",
              color: "var(--color-text-secondary)",
              cursor: "pointer",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              fontFamily: "var(--font-body)",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(0, 0, 0, 0.1)";
              e.target.style.color = "var(--color-text-primary)";
              e.target.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(0, 0, 0, 0.05)";
              e.target.style.color = "var(--color-text-secondary)";
              e.target.style.transform = "rotate(0deg)";
            }}
          >
            <X size={20} />
          </button>

          {/* Main Title */}
          <h1
            style={{
              background: `linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-accent) 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "3.5rem",
              fontWeight: "800",
              textAlign: "center",
              marginBottom: "1rem",
              letterSpacing: "2px",
              animation:
                "gameCompleteGlow 3s ease-in-out infinite, gameCompleteBounce 0.8s ease-out",
              backgroundSize: "200% auto",
              fontFamily: "var(--font-heading)",
            }}
          >
            🎉 GAME COMPLETE! 🎉
          </h1>

          {/* Congratulations Message */}
          <div
            style={{
              fontSize: "2.2rem",
              fontWeight: "700",
              color: "var(--color-text-primary)",
              margin: "2rem 0",
              animation: "gameCompletePulse 2s ease-in-out infinite",
              fontFamily: "var(--font-body)",
            }}
          >
            🌟 Amazing! You've mastered all 5 levels! 🌟
          </div>

          {/* Thank You Message */}
          <div
            style={{
              fontSize: "1.5rem",
              color: "var(--color-text-secondary)",
              marginBottom: "2.5rem",
              lineHeight: "1.6",
              fontFamily: "var(--font-body)",
            }}
          >
            Hey there, Prompt Explorer! 🚀
            <br />
            Thank you for playing our Prompt Learning Game!
            <br />
            You've become a true master of AI prompting! ✨
          </div>

          {/* Feedback Request */}
          <div
            style={{
              background: "var(--color-primary-light)",
              borderRadius: "20px",
              padding: "2rem",
              marginBottom: "2.5rem",
              border: `2px solid var(--color-primary)`,
            }}
          >
            <p
              style={{
                fontSize: "1.3rem",
                color: "var(--color-text-primary)",
                marginBottom: "1.5rem",
                fontWeight: "600",
                fontFamily: "var(--font-body)",
              }}
            >
              💝 We'd love to hear about your experience!
            </p>
            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--color-text-secondary)",
                marginBottom: "1.5rem",
                fontFamily: "var(--font-body)",
              }}
            >
              Your feedback helps us make this game even better for future
              players like you! 🎮
            </p>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Feedback Button */}
            <button
              onClick={handleFeedbackClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem 2rem",
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "white",
                background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: `0 4px 15px rgba(115, 69, 228, 0.3)`,
                fontFamily: "var(--font-body)",
                minWidth: "180px",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = `0 6px 20px rgba(115, 69, 228, 0.4)`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = `0 4px 15px rgba(115, 69, 228, 0.3)`;
              }}
            >
              <ExternalLink size={18} />
              Share Feedback
            </button>

            {/* Play Again Button */}
            <button
              onClick={handlePlayAgain}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem 2rem",
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "var(--color-primary)",
                background: "var(--color-primary-light)",
                border: `2px solid var(--color-primary)`,
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s",
                fontFamily: "var(--font-body)",
                minWidth: "180px",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--color-primary)";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--color-primary-light)";
                e.target.style.color = "var(--color-primary)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              <RotateCcw size={18} />
              Play Again
            </button>

            {/* Maybe Later Button */}
            <button
              onClick={handleClose}
              style={{
                padding: "1rem 2rem",
                fontSize: "1rem",
                fontWeight: "500",
                color: "var(--color-text-secondary)",
                background: "transparent",
                border: `1px solid var(--color-text-disabled)`,
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s",
                fontFamily: "var(--font-body)",
                minWidth: "120px",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--color-text-disabled)";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "var(--color-text-secondary)";
              }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameCompleteModal;
