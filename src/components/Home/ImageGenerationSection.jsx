import React from "react";
import { Send, Loader2, Lightbulb, Eye } from "lucide-react";

const ImageGenerationSection = ({
  generatedImage,
  isGenerating,
  isComparing,
  illustrationImage,
  imageLoadErrors,
  setImageLoadErrors,
  accuracy,
  aiFeedback,
  aiFeedbackRef,
}) => {
  // Get progress bar color based on accuracy range
  const getProgressBarColor = (accuracy) => {
    if (accuracy >= 70) {
      return "var(--color-success)"; // Green for high scores (70%+)
    } else if (accuracy >= 50) {
      return "var(--color-secondary)"; // Blue for medium scores (50-69%)
    } else if (accuracy >= 25) {
      return "var(--color-accent)"; // Pink for low scores (25-49%)
    } else {
      return "var(--color-primary)"; // Purple for very low scores (0-24%)
    }
  };
  return (
    <div
      className="lg:pl-12"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Generated Image Box - Centered in right section */
      <div
        className="paper border-3"
        style={{
          borderColor: "var(--color-text-primary)",
          backgroundColor: "white",
          padding: "0.02rem",
          height: "450px",
          maxWidth: "550px",
          width: "100%",
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {isGenerating || isComparing ? (
          // Loading State with Animation
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
            }}
          >
            {/* Animated Spinner */}
            <div
              style={{
                animation: "spin 1s linear infinite",
              }}
            >
              <Loader2
                size={64}
                style={{
                  color: "var(--color-primary)",
                  strokeWidth: 2.5,
                }}
              />
            </div>

            {/* Loading Text with Dots Animation */}
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.25rem",
                color: "var(--color-text-primary)",
                fontWeight: "500",
              }}
            >
              {isComparing ? (
                <>Analyzing your image</>
              ) : (
                <>Creating your masterpiece</>
              )}
            </div>

            {/* Subtle message */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                color: "var(--color-text-secondary)",
                maxWidth: "280px",
                lineHeight: "1.5",
              }}
            >
              {isComparing
                ? "Comparing with target image..."
                : "This may take a few moments"}
            </p>
          </div>
        ) : generatedImage ? (
          <>
            <img
              src={generatedImage}
              alt="Generated image"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
              }}
            />
          </>
        ) : (
          <div>
            {!imageLoadErrors.illustration ? (
              <img
                src={illustrationImage}
                alt="Prompt learning illustration"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "280px",
                  marginBottom: "1.5rem",
                }}
                onError={(e) => {
                  console.error("Failed to load illustration image:", e);
                  setImageLoadErrors((prev) => ({
                    ...prev,
                    illustration: true,
                  }));
                }}
                onLoad={() => {
                  console.log("Illustration image loaded successfully");
                  setImageLoadErrors((prev) => ({
                    ...prev,
                    illustration: false,
                  }));
                }}
              />
            ) : (
              <div
                style={{
                  width: "280px",
                  height: "200px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--color-secondary-light)",
                  border: "2px dashed var(--color-secondary)",
                  borderRadius: "12px",
                  color: "var(--color-secondary-dark)",
                  marginBottom: "1.5rem",
                }}
              >
                <Send
                  size={48}
                  style={{ marginBottom: "1rem", opacity: 0.6 }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                    textAlign: "center",
                  }}
                >
                  Ready to Create
                  <br />
                  <small>Enter your prompt below</small>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accuracy Score Section - Centered in right section */}
      <div
        style={{
          marginBottom: "1.5rem",
          marginTop: "-0.5rem",
          maxWidth: "550px",
          width: "100%",
        }}
      >
        <h4
          className="h4 text-center"
          style={{
            color: "var(--color-text-primary)",
            marginBottom: "0.75rem",
            fontSize: "1.1rem",
            fontWeight: "400",
          }}
        >
          ACCURACY
        </h4>

        {/* Progress Bar - Centered */}
        <div className="relative" style={{ padding: "0 0.35rem" }}>
          <div
            style={{
              width: "100%",
              height: "22px",
              border: "3px solid var(--color-text-primary)",
              borderRadius: "20px",
              backgroundColor: "white",
              position: "relative",
              overflow: "visible",
            }}
          >
            {/* Progress Fill */}
            <div
              style={{
                width: `${accuracy}%`,
                height: "100%",
                backgroundColor: getProgressBarColor(accuracy),
                borderRadius: "17px",
                transition: "width 0.5s ease, background-color 0.3s ease",
                position: "relative",
              }}
            ></div>

            {/* 70% Standing Line Marker */}
            <div
              style={{
                position: "absolute",
                left: "70%",
                top: "-12px",
                bottom: "-12px",
                width: "3px",
                backgroundColor: "var(--color-text-primary)",
                zIndex: 2,
                transform: "translateX(-50%)",
              }}
            ></div>
          </div>

          {/* Reduced spacing after progress bar */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "10px", // Reduced from 20px to 10px
              marginTop: "0.15rem", // Reduced from 0.25rem
            }}
          ></div>
        </div>
      </div>

      {/* AI Feedback Section - Centered in right section */}
      {aiFeedback && aiFeedback.feedback && (
        <div
          ref={aiFeedbackRef}
          className="paper border-2"
          style={{
            borderColor: "var(--color-text-primary)",
            backgroundColor: "white",
            padding: "1rem 1.5rem",
            marginTop: "0.5rem",
            marginBottom: "3rem",
            maxWidth: "550px",
            width: "100%",
            animation: "fadeIn 0.5s ease-in-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            <Lightbulb size={24} style={{ color: "var(--color-primary)" }} />
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "20px",
                fontWeight: "400",
                color: "var(--color-text-primary)",
              }}
            >
              AI Feedback
            </span>
          </div>

          {/* Content - Always Visible */}
          <div
            style={{
              paddingTop: "1rem",
              borderTop: "2px solid var(--color-divider)",
            }}
          >
            {/* Visual Differences */}
            {aiFeedback.feedback && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <Eye size={20} style={{ color: "var(--color-accent)" }} />
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "var(--color-accent-dark)",
                    }}
                  >
                    Visual Differences
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    color: "var(--color-text-primary)",
                    lineHeight: "1.7",
                    marginLeft: "2rem",
                  }}
                >
                  {aiFeedback.feedback}
                </p>
              </div>
            )}

            {/* Suggestions */}
            {aiFeedback.improvements && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <Lightbulb
                    size={20}
                    style={{ color: "var(--color-success)" }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "var(--color-success)",
                    }}
                  >
                    Suggestions
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    color: "var(--color-text-primary)",
                    lineHeight: "1.7",
                    marginLeft: "2rem",
                  }}
                >
                  {aiFeedback.improvements}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerationSection;
