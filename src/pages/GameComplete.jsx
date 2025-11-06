import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, RotateCcw, Home } from "lucide-react";
import { markFeedbackAsShown } from "../utils/progressManager";

const GameComplete = ({ onPlayAgain, resetToLevel1 }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Mark feedback as shown when user visits this page
    markFeedbackAsShown();
  }, []);

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
    } else if (resetToLevel1) {
      resetToLevel1();
    }
    navigate("/game");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-background)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily: "var(--font-body)",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            width: "100%",
            textAlign: "center",
            animation: "fadeInUp 0.6s ease-out",
          }}
        >
          {/* Main Title */}
          <h1
            style={{
              color: "var(--color-primary)",
              fontSize: "2.5rem",
              fontWeight: "700",
              textAlign: "center",
              marginBottom: "1.5rem",
              fontFamily: "var(--font-heading)",
            }}
          >
            🎉 Congratulations on Completing All 5 Levels!
          </h1>

          {/* Completion Message */}
          <div
            style={{
              fontSize: "1.4rem",
              color: "var(--color-text-primary)",
              margin: "2rem 0",
              lineHeight: "1.6",
              fontFamily: "var(--font-body)",
            }}
          >
            You've successfully completed the Prompt Learning Game—great job!
            <br />
            Your creativity and dedication have made you a true AI Prompt
            Explorer. 🚀
          </div>

          {/* Feedback Request */}
          <div
            className="paper border-3"
            style={{
              background: "var(--color-primary-light)",
              borderRadius: "20px",
              padding: "3rem",
              marginBottom: "3rem",
              border: `3px solid var(--color-primary)`,
              maxWidth: "600px",
              margin: "0 auto 3rem auto",
            }}
          >
            <h3
              style={{
                fontSize: "1.6rem",
                color: "var(--color-primary)",
                marginBottom: "1.5rem",
                fontWeight: "700",
                fontFamily: "var(--font-heading)",
              }}
            >
              � We'd Love to Hear from You!
            </h3>
            <p
              style={{
                fontSize: "1.2rem",
                color: "var(--color-text-primary)",
                marginBottom: "1.5rem",
                lineHeight: "1.6",
                fontFamily: "var(--font-body)",
              }}
            >
              Your feedback helps us make this experience even better for future
              explorers.
              <br />
              Please take a moment to share your thoughts and suggestions.
            </p>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "2rem",
            }}
          >
            {/* Feedback Button */}
            <button
              onClick={handleFeedbackClick}
              className="paper-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "1.25rem 2.5rem",
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "white",
                background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
                border: `3px solid var(--color-primary)`,
                borderRadius: "15px",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: `0 6px 20px rgba(115, 69, 228, 0.3)`,
                fontFamily: "var(--font-body)",
                minWidth: "200px",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = `0 8px 25px rgba(115, 69, 228, 0.4)`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = `0 6px 20px rgba(115, 69, 228, 0.3)`;
              }}
            >
              <ExternalLink size={20} />
               Fill Out the Feedback Form
            </button>

            {/* Play Again Button */}
            <button
              onClick={handlePlayAgain}
              className="paper-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "1.25rem 2.5rem",
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "var(--color-primary)",
                background: "var(--color-primary-light)",
                border: `3px solid var(--color-primary)`,
                borderRadius: "15px",
                cursor: "pointer",
                transition: "all 0.3s",
                fontFamily: "var(--font-body)",
                minWidth: "200px",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--color-primary)";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--color-primary-light)";
                e.target.style.color = "var(--color-primary)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              <RotateCcw size={20} />
              Play Again
            </button>

            {/* Home Button */}
            <button
              onClick={handleGoHome}
              className="paper-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "1.25rem 2.5rem",
                fontSize: "1.1rem",
                fontWeight: "500",
                color: "var(--color-text-secondary)",
                background: "white",
                border: `2px solid var(--color-text-disabled)`,
                borderRadius: "15px",
                cursor: "pointer",
                transition: "all 0.3s",
                fontFamily: "var(--font-body)",
                minWidth: "150px",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--color-text-disabled)";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "white";
                e.target.style.color = "var(--color-text-secondary)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              <Home size={18} />
              Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameComplete;
