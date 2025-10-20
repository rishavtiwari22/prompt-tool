import React, { useState, useEffect } from "react";
import { RefreshCw, Send, Target, Loader2, Lightbulb, Eye, ChevronDown, ChevronUp } from "lucide-react";
import illustrationImage from "../assets/Frame 473.svg";
import { compareImagesWithFeedback } from "../utils/imageComparison";
import { generateImageWithProgress } from "../utils/imageGeneration";
import { ZoneToast, InfoToast } from "../components/Toast";
import audioManager from "../utils/audioManager";
import ModalLevel from "../components/ModalLevel";
import ResetConfirmModal from "../components/ResetConfirmModal";

// Import challenge images
import challenge2Image from "../assets/challanges/challenge-1.png";
import challenge1Image from "../assets/challanges/challenge-2.png";
import challenge3Image from "../assets/challanges/challenge-3.png";
import challenge4Image from "../assets/challanges/challenge-4.png";
import challenge5Image from "../assets/challanges/challenge-5.png";
import challenge6Image from "../assets/challanges/challenge-6.png";

const Home = ({ currentLevel, onLevelChange, unlockedLevels = [1], setLevelUnlocked, completedLevels = [], setLevelCompleted }) => {
  // Use unlockedLevels and setLevelUnlocked from props, not local state

  // Handler for Play button in modal
  const handlePlayNextLevel = async () => {
    console.log('Play button clicked, current level:', currentLevel);
    const nextLevel = currentLevel + 1;
    const maxLevel = 5; // Maximum available levels
    
    // Mark current level as completed
    if (typeof setLevelCompleted === 'function') {
      setLevelCompleted(currentLevel);
    }
    
    // Check if this is the last level - restart from level 1
    if (currentLevel >= maxLevel) {
      console.log('Last level completed - restarting from level 1');
      
      // Play button click sound
      await audioManager.playButtonClick();
      
      // Clear states
      setPrompt("");
      setGeneratedImage(null);
      setAccuracy(0);
      
      // Navigate back to level 1
      if (typeof onLevelChange === 'function') {
        onLevelChange(1);
      }
      return;
    }
    
    // Play button click sound
    await audioManager.playButtonClick();
    
    // Clear states first
    setPrompt("");
    setGeneratedImage(null);
    setAccuracy(0);
    
    // Unlock and navigate to next level
    if (typeof setLevelUnlocked === 'function') {
      setLevelUnlocked(nextLevel);
    }
    if (typeof onLevelChange === 'function') {
      onLevelChange(nextLevel);
    }
  };
  const [prompt, setPrompt] = useState("");
  const [accuracy, setAccuracy] = useState(0);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false);

  // Simple toast states
  const [showZoneToast, setShowZoneToast] = useState(false);
  const [showInfoToast, setShowInfoToast] = useState(false);
  const [previousAccuracy, setPreviousAccuracy] = useState(0);

  // AI Feedback states
  const [aiFeedback, setAiFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Reset confirmation modal state
  const [showResetModal, setShowResetModal] = useState(false);

  // Image loading states
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  // Target images for each level
  const targetImages = {
    1: challenge1Image,
    2: challenge2Image,
    3: challenge3Image,
    4: challenge4Image,
    5: challenge5Image,
    // 6: challenge6Image // removed, not used
  };

  // Level descriptions
  const levelDescriptions = {
    1: "Challenge 1",
    2: "Challenge 2",
    3: "Challenge 3",
    4: "Challenge 4",
    5: "Challenge 5",
    // 6: "Challenge 6" // removed, not used
  };

  // Show reset confirmation modal
  const handleReset = () => {
    setShowResetModal(true);
  };

  // Actual reset functionality
  const handleConfirmReset = async () => {
    await audioManager.playReset();
    setPrompt("");
    setPreviousAccuracy(accuracy);
    setAccuracy(0);
    setGeneratedImage(null);
    setAiFeedback(null);
    setShowFeedback(false);
  };

  // Close reset modal
  const handleCloseResetModal = () => {
    setShowResetModal(false);
  };

  const handleLevelChange = (level) => {
    onLevelChange(level);
    setPreviousAccuracy(accuracy);
    setAccuracy(0);
    setGeneratedImage(null);
    setPrompt("");
    setAiFeedback(null);
    setShowFeedback(false);
  };

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

  const handleCreateImage = async () => {
    if (!prompt.trim()) return;

    // Play button click sound
    await audioManager.playButtonClick();

    setIsGenerating(true);
    setGeneratedImage(null);
    setPreviousAccuracy(accuracy);
    setAccuracy(0);

    try {
      console.log("Creating image with prompt:", prompt);

      // Generate image using the utility
      const generatedImageUrl = await generateImageWithProgress(prompt.trim());

      setGeneratedImage(generatedImageUrl);

      // Play image generation success sound
      await audioManager.playImageGenerated();

      // Show success toast
      setShowInfoToast(true);

      // Automatically compare with target image when generation is complete
      const targetImage = targetImages[currentLevel];
      setIsComparing(true);

      const result = await compareImagesWithFeedback(targetImage, generatedImageUrl, prompt.trim());
      const similarity = result.score || 0;
      
      setAccuracy(similarity);
      setAiFeedback(result);
      setShowFeedback(false); // Reset to collapsed state

      // Play score-based audio feedback
      await audioManager.playScoreBasedFeedback(similarity);

      // Additional feedback for high scores
      if (similarity >= 70) {
        // High accuracy - also play level completion sound
        setTimeout(async () => {
          await audioManager.playLevelComplete();
        }, 500);
        setTimeout(() => {
          setShowZoneToast(true);
        }, 1000);
      } else if (similarity < previousAccuracy) {
        // Accuracy decreased - play additional negative feedback
        setTimeout(async () => {
          await audioManager.playAccuracyDecrease();
        }, 800);
      }
    } catch (error) {
      console.error("Image generation or comparison failed:", error);
      setAccuracy(0);

      // Show error toast (using InfoToast for simplicity)
      setShowInfoToast(true);
    } finally {
      setIsGenerating(false);
      setIsComparing(false);
    }
  };

  return (
    <div className="px-6 md:px-10 pb-16px">
      <div className="max-w-7xl mx-auto">
        {/* Quick button to preview ModalLevel */}
        {/* <div className="flex justify-end mb-4">
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
            onClick={async () => {
              await audioManager.playButtonClick();
              setIsModalPreviewOpen(true);
            }}
          >
            Preview Level Modal
          </button>
        </div> */}

        <div
          className="hidden lg:block"
          aria-hidden="true"
          style={{ height: "0" }}
        ></div>
        {/* Two Column Layout with Divider */}

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 relative"
          style={{ overflow: "hidden", paddingTop: "4rem" }}
        >
          {/* Vertical Divider - extended upward to meet horizontal divider */}
          <div
            className="hidden lg:block absolute left-1/2"
            aria-hidden="true"
            style={{
              top: "-4rem", // Match the paddingTop value
              bottom: "0",
              transform: "translateX(-50%)",
              zIndex: 0,
              margin: 0,
              border: "none",
              borderLeft: "2px solid #000000",
              opacity: 0.25,
              width: 0,
            }}
          ></div>

          {/* LEFT COLUMN */}
          <div className="lg:pr-12">
            {/* Target Image Box */}
            <div
              className="paper border-3"
              style={{
                borderColor: "var(--color-text-primary)",
                backgroundColor: "white",
                padding: "2rem",
                height: "400px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2rem",
              }}
            >
              {/* ModalLevel - Show when accuracy >= 70 */}
              {accuracy >= 70 && (
                <ModalLevel
                  onClose={() => {
                    const nextLevel = currentLevel + 1;
                    if (typeof setLevelUnlocked === "function") {
                      setLevelUnlocked(nextLevel);
                    }
                    if (typeof onLevelChange === "function") {
                      onLevelChange(nextLevel);
                    }
                    setPrompt("");
                    setGeneratedImage(null);
                    setAccuracy(0);
                  }}
                  onPlay={handlePlayNextLevel}
                  score={accuracy}
                  level={currentLevel}
                />
              )}

              {/* ModalLevel preview toggle */}
              {isModalPreviewOpen && (
                <ModalLevel
                  onClose={() => setIsModalPreviewOpen(false)}
                  onPlay={() => setIsModalPreviewOpen(false)}
                  score={accuracy || 80}
                  level={currentLevel}
                />
              )}

            {/* ModalLevel preview toggle */}
            {isModalPreviewOpen && (
              <ModalLevel
                onClose={() => setIsModalPreviewOpen(false)}
                onPlay={() => setIsModalPreviewOpen(false)}
                score={accuracy }
                level={currentLevel}
              />
            )}
              
              {!imageLoadErrors[currentLevel] ? (
                <img
                  src={targetImages[currentLevel]}
                  alt={`Level ${currentLevel} target: ${levelDescriptions[currentLevel]}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    console.error(
                      `Failed to load challenge image for level ${currentLevel}:`,
                      e
                    );
                    setImageLoadErrors((prev) => ({
                      ...prev,
                      [currentLevel]: true,
                    }));
                  }}
                  onLoad={() => {
                    console.log(
                      `Challenge image loaded successfully for level ${currentLevel}`
                    );
                    setImageLoadErrors((prev) => ({
                      ...prev,
                      [currentLevel]: false,
                    }));
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--color-primary-light)",
                    border: "2px dashed var(--color-primary)",
                    borderRadius: "8px",
                    color: "var(--color-primary-dark)",
                  }}
                >
                  <Target
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
                    Challenge Image
                    <br />
                    <small>Level {currentLevel}</small>
                  </p>
                </div>
              )}
            </div>

            {/* Accuracy Score Section */}
            <div>
              <h4
                className="h4 text-center"
                style={{
                  color: "var(--color-text-primary)",
                  marginBottom: "1.25rem",
                }}
              >
                Accuracy
              </h4>

              {/* Progress Bar - Redesigned to match reference images */}
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
                  >
                    {/* Current Percentage Badge on Progress Bar - Show when accuracy > 0 */}
                    {accuracy > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          right: "-20px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "white",
                          border: "3px solid var(--color-text-primary)",
                          borderRadius: "20px",
                          padding: "2px 12px",
                          fontFamily: "var(--font-body)",
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "var(--color-text-primary)",
                          whiteSpace: "nowrap",
                          zIndex: 3,
                        }}
                      >
                        {accuracy}%
                      </div>
                    )}
                  </div>

                  {/* 70% Standing Line Marker */}
                  <div
                    style={{
                      position: "absolute",
                      left: "70%",
                      top: "-6px",
                      bottom: "-6px",
                      width: "3px",
                      backgroundColor: "var(--color-text-primary)",
                      zIndex: 2,
                      transform: "translateX(-50%)",
                    }}
                  ></div>

                  {/* 0% Label at Start - Only show when accuracy is 0 */}
                  {accuracy === 0 && (
                    <div
                      style={{
                        position: "absolute",
                        left: "0",
                        top: "50%",
                        transform: "translate(-8px, -50%)",
                        backgroundColor: "white",
                        border: "3px solid var(--color-text-primary)",
                        borderRadius: "20px",
                        padding: "2px 10px",
                        fontFamily: "var(--font-body)",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "var(--color-text-primary)",
                        zIndex: 3,
                      }}
                    >
                      0%
                    </div>
                  )}
                </div>

                {/* 70% Target Label - Below the standing line */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "30px",
                    marginTop: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "70%",
                      transform: "translateX(-50%)",
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      color: "var(--color-text-primary)",
                      fontWeight: "600",
                    }}
                  >
                    70%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:pl-12">
            {/* Generated Image Box */}
            <div
              className="paper border-3"
              style={{
                borderColor: "var(--color-text-primary)",
                backgroundColor: "white",
                padding: "2rem",
                height: "400px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                marginBottom: "2rem",
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
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
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
                        maxWidth: "280px",
                        height: "auto",
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

            {/* Reset Button - Centered - Space always reserved, button visible only when image is generated */}
            <div
              className="flex justify-center"
              style={{ marginBottom: "1rem" }}
            >
              <button
                onClick={handleReset}
                className="paper-btn"
                style={{
                  backgroundColor: "var(--color-accent-light)",
                  color: "var(--color-accent-dark)",
                  border: "2px solid var(--color-accent)",
                  padding: "0.5rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  cursor: generatedImage ? "pointer" : "default",
                  transition: "all 0.2s ease",
                  opacity: generatedImage ? 1 : 0,
                  visibility: generatedImage ? "visible" : "hidden",
                  pointerEvents: generatedImage ? "auto" : "none",
                }}
              >
                Reset
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Prompt Input Box - Full Width Aligned */}
            <div
              className="paper border-3"
              style={{
                borderColor: "var(--color-text-primary)",
                backgroundColor: "white",
                padding: "1rem 1.25rem",
               
                
              }}
            >
              <div className="flex items-end gap-3">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleCreateImage();
                    }
                  }}
                  placeholder="Describe what you see"
                  className="flex-1 input--prompt"
                  rows={1}
                  style={{
                    border: "none",
                    outline: "none",
                    fontFamily: "var(--font-body)",
                    fontSize: "18px",
                    color: "var(--color-text-primary)",
                    backgroundColor: "transparent",
                    resize: "none",
                    overflowY: "auto",
                    maxHeight: "64px",
                    minHeight: "46px",
                    padding: "0.75rem 0.5rem",
                    lineHeight: "1.4",
                    transition: "all 0.2s ease",
                  }}
                  onInput={(e) => {
                    // Auto-expand as you type
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                />

                <button
                  onClick={handleCreateImage}
                  disabled={!prompt.trim() || isComparing || isGenerating}
                  className="paper-btn flex items-center justify-center"
                  style={{
                    backgroundColor:
                      !prompt.trim() || isComparing || isGenerating
                        ? "#f3f4f6"
                        : "var(--color-primary-light)",
                    color:
                      !prompt.trim() || isComparing || isGenerating
                        ? "#9ca3af"
                        : "var(--color-primary-dark)",
                    border: `2px solid ${
                      !prompt.trim() || isComparing || isGenerating
                        ? "#d1d5db"
                        : "var(--color-primary)"
                    }`,
                    height: "46px",
                    padding: prompt.trim() ? "0 16px" : "0 18px",
                    minWidth: prompt.trim() ? "46px" : "150px",
                    cursor:
                      !prompt.trim() || isComparing || isGenerating
                        ? "not-allowed"
                        : "pointer",
                    transition: "all 0.3s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                      <span style={{ marginLeft: "6px" }}>Generating</span>
                    </>
                  ) : isComparing ? (
                    <>
                      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                      <span style={{ marginLeft: "6px" }}>Analyzing</span>
                    </>
                  ) : prompt.trim() ? (
                    <Send size={18} />
                  ) : (
                    <>
                      Create Image <Send size={16} style={{ marginLeft: "6px" }} />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* AI Feedback Section - At Bottom of Page */}
        {aiFeedback && aiFeedback.feedback && (
          <div
            className="paper border-2"
            style={{
              borderColor: showFeedback ? "var(--color-primary)" : "var(--color-secondary)",
              backgroundColor: showFeedback ? "var(--color-primary-light)" : "white",
              padding: "1rem 1.5rem",
              marginTop: "2rem",
              maxWidth: "900px",
              marginLeft: "auto",
              marginRight: "auto",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onClick={() => setShowFeedback(!showFeedback)}
          >
            {/* Header - Always Visible */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Lightbulb
                  size={24}
                  style={{ color: "var(--color-primary)" }}
                />
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
              {showFeedback ? (
                <ChevronUp size={24} style={{ color: "var(--color-primary)" }} />
              ) : (
                <ChevronDown size={24} style={{ color: "var(--color-text-secondary)" }} />
              )}
            </div>

            {/* Expandable Content */}
            {showFeedback && (
              <div
                style={{
                  marginTop: "1rem",
                  paddingTop: "1rem",
                  borderTop: "2px solid var(--color-divider)",
                  animation: "fadeIn 0.3s ease",
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

                {/* Prompt Improvements */}
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
                      <Lightbulb size={20} style={{ color: "var(--color-success)" }} />
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
            )}
          </div>
        )}
      </div>

      {/* Toast Components */}
      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={showResetModal}
        onClose={handleCloseResetModal}
        onConfirm={handleConfirmReset}
      />

      <ZoneToast show={showZoneToast} onClose={() => setShowZoneToast(false)} />
      <InfoToast show={showInfoToast} onClose={() => setShowInfoToast(false)} />

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
