import React, { useState, useEffect, useRef } from "react";
import illustrationImage from "../assets/Frame 473.svg";
import { compareImagesWithFeedback } from "../utils/imageComparison";
import { generateImageWithProgress } from "../utils/imageGeneration";
import audioManager from "../utils/audioManager";
import ImageDisplaySection from "../components/Home/ImageDisplaySection";
import ImageGenerationSection from "../components/Home/ImageGenerationSection";
import LevelModalManager from "../components/Home/LevelModalManager";

// Import challenge images
import challenge2Image from "../assets/challanges/challenge-1.png";
import challenge1Image from "../assets/challanges/challenge-2.png";
import challenge3Image from "../assets/challanges/challenge-3.png";
import challenge4Image from "../assets/challanges/challenge-4.png";
import challenge5Image from "../assets/challanges/challenge-5.png";
import challenge6Image from "../assets/challanges/challenge-6.png";

const Home = ({
  currentLevel,
  onLevelChange,
  unlockedLevels = [1],
  setLevelUnlocked,
  completedLevels = [],
  setLevelCompleted,
}) => {
  // Handler for Play button in modal
  const handlePlayNextLevel = async () => {
    console.log("Play button clicked, current level:", currentLevel);
    const nextLevel = currentLevel + 1;
    const maxLevel = 5; // Maximum available levels

    // Mark current level as completed
    if (typeof setLevelCompleted === "function") {
      setLevelCompleted(currentLevel);
    }

    // Check if this is the last level - restart from level 1
    if (currentLevel >= maxLevel) {
      console.log("Last level completed - restarting from level 1");

      // Play button click sound
      await audioManager.playButtonClick();

      // Clear states
      setPrompt("");
      setGeneratedImage(null);
      setAccuracy(0);
      setAiFeedback(null);

      // Navigate back to level 1
      if (typeof onLevelChange === "function") {
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
    setAiFeedback(null);

    // Unlock and navigate to next level
    if (typeof setLevelUnlocked === "function") {
      setLevelUnlocked(nextLevel);
    }
    if (typeof onLevelChange === "function") {
      onLevelChange(nextLevel);
    }
  };
  
  const [prompt, setPrompt] = useState("");
  const [accuracy, setAccuracy] = useState(0);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false);

  const [previousAccuracy, setPreviousAccuracy] = useState(0);

  // AI Feedback states
  const [aiFeedback, setAiFeedback] = useState(null);

  // Reset confirmation modal state
  const [showResetModal, setShowResetModal] = useState(false);

  // Image loading states
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  // Ref for AI feedback section - but we won't use auto-scroll anymore
  const aiFeedbackRef = useRef(null);

  // REMOVED: Auto-scroll functionality as requested
  // useEffect(() => {
  //   if (aiFeedback && aiFeedback.feedback && aiFeedbackRef.current) {
  //     setTimeout(() => {
  //       aiFeedbackRef.current.scrollIntoView({
  //         behavior: "smooth",
  //         block: "start",
  //       });
  //     }, 300);
  //   }
  // }, [aiFeedback]);

  // Target images for each level
  const targetImages = {
    1: challenge1Image,
    2: challenge2Image,
    3: challenge3Image,
    4: challenge4Image,
    5: challenge5Image,
  };

  // Level descriptions
  const levelDescriptions = {
    1: "Challenge 1",
    2: "Challenge 2",
    3: "Challenge 3",
    4: "Challenge 4",
    5: "Challenge 5",
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

      // Automatically compare with target image when generation is complete
      const targetImage = targetImages[currentLevel];
      setIsComparing(true);

      const result = await compareImagesWithFeedback(
        targetImage,
        generatedImageUrl,
        prompt.trim()
      );
      const similarity = result.score || 0;

      setAccuracy(similarity);
      setAiFeedback(result);

      // Play score-based audio feedback
      await audioManager.playScoreBasedFeedback(similarity);

      // Additional feedback for high scores
      if (similarity >= 70) {
        // High accuracy - also play level completion sound
        setTimeout(async () => {
          await audioManager.playLevelComplete();
        }, 500);
      } else if (similarity < previousAccuracy) {
        // Accuracy decreased - play additional negative feedback
        setTimeout(async () => {
          await audioManager.playAccuracyDecrease();
        }, 800);
      }
    } catch (error) {
      console.error("Image generation or comparison failed:", error);
      setAccuracy(0);
    } finally {
      setIsGenerating(false);
      setIsComparing(false);
    }
  };

  return (
    <div className="px-6 md:px-10 pb-16px">
      <div className="max-w-7xl mx-auto">
        {/* New Layout: Fixed left section, scrollable right section */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 relative"
          style={{ 
            overflow: "hidden", 
            paddingTop: "2rem",
            height: "calc(100vh - 120px)", // Adjust based on your header height
          }}
        >
          {/* Vertical Divider */}
          <div
            className="hidden lg:block absolute left-1/2"
            aria-hidden="true"
            style={{
              top: "-2rem",
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

          {/* LEFT COLUMN - Target Image & Input Section (STICKY) */}
          <div 
            className="lg:pr-12"
            style={{
              position: "relative",
              height: "100%",
              overflow: "hidden", // Left section should not scroll
            }}
          >
            <ImageDisplaySection
              currentLevel={currentLevel}
              targetImages={targetImages}
              levelDescriptions={levelDescriptions}
              imageLoadErrors={imageLoadErrors}
              setImageLoadErrors={setImageLoadErrors}
              prompt={prompt}
              setPrompt={setPrompt}
              generatedImage={generatedImage}
              isGenerating={isGenerating}
              isComparing={isComparing}
              handleCreateImage={handleCreateImage}
              handleReset={handleReset}
            />
          </div>

          {/* RIGHT COLUMN - Generated Image & Results Section (SCROLLABLE) */}
          <div 
            className="lg:pl-12"
            style={{
              position: "relative",
              height: "100%",
              overflowY: "auto", // Right section scrolls when content overflows
              overflowX: "hidden",
              scrollbarWidth: "thin", // For Firefox
              scrollbarColor: "rgba(0,0,0,0.2) transparent", // For Firefox
            }}
          >
            <ImageGenerationSection
              generatedImage={generatedImage}
              isGenerating={isGenerating}
              isComparing={isComparing}
              illustrationImage={illustrationImage}
              imageLoadErrors={imageLoadErrors}
              setImageLoadErrors={setImageLoadErrors}
              accuracy={accuracy}
              aiFeedback={aiFeedback}
              aiFeedbackRef={aiFeedbackRef}
            />
          </div>
        </div>
      </div>

      {/* Level Modal Manager */}
      <LevelModalManager
        accuracy={accuracy}
        currentLevel={currentLevel}
        showResetModal={showResetModal}
        isModalPreviewOpen={isModalPreviewOpen}
        setIsModalPreviewOpen={setIsModalPreviewOpen}
        handlePlayNextLevel={handlePlayNextLevel}
        handleCloseResetModal={handleCloseResetModal}
        handleConfirmReset={handleConfirmReset}
        setLevelUnlocked={setLevelUnlocked}
        onLevelChange={onLevelChange}
        setPrompt={setPrompt}
        setGeneratedImage={setGeneratedImage}
        setAccuracy={setAccuracy}
      />

      {/* CSS for spinner animation and custom scrollbar */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        /* Custom scrollbar for webkit browsers */
        .lg\\:pl-12::-webkit-scrollbar {
          width: 6px;
        }
        
        .lg\\:pl-12::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .lg\\:pl-12::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.2);
          border-radius: 3px;
        }
        
        .lg\\:pl-12::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default Home;