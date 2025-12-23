import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalLevel from "../ModalLevel";
import ResetConfirmModal from "../ResetConfirmModal";
import {
  hasFeedbackBeenShown,
  markFeedbackAsShown,
} from "../../utils/progressManager";

const LevelModalManager = ({
  accuracy,
  currentLevel,
  showResetModal,
  isModalPreviewOpen,
  setIsModalPreviewOpen,
  handlePlayNextLevel,
  handleCloseResetModal,
  handleConfirmReset,
  onMarkFeedbackShown,
  hasShownFeedback,
}) => {
  const navigate = useNavigate();
  const [showLevelCompleteFirst, setShowLevelCompleteFirst] = useState(false);

  // Handle Level 5 completion flow
  useEffect(() => {
    if (accuracy >= 70 && currentLevel === 5) {
      // Always show level complete modal for Level 5
      setShowLevelCompleteFirst(true);
    }
  }, [accuracy, currentLevel]);

  const handleLevel5Complete = () => {
    // Close level complete modal
    setShowLevelCompleteFirst(false);
    if (onMarkFeedbackShown) {
      onMarkFeedbackShown();
    }

    // Mark level as completed first
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

    // Always navigate to game complete page after Level 5
    navigate("/game-complete");
  };
  return (
    <>
      {/* ModalLevel - Show when accuracy >= 70 for levels 1-4 */}
      {accuracy >= 70 && currentLevel < 5 && !hasShownFeedback && (
        <ModalLevel
          onClose={() => {
            if (onMarkFeedbackShown) {
              onMarkFeedbackShown();
            }
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
          onPlay={() => {
            if (onMarkFeedbackShown) {
              onMarkFeedbackShown();
            }
            handlePlayNextLevel();
          }}
          score={accuracy}
          level={currentLevel}
        />
      )}

      {/* ModalLevel for Level 5 - Special handling */}
      {showLevelCompleteFirst && (
        <ModalLevel
          onClose={handleLevel5Complete}
          onPlay={handleLevel5Complete}
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

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={showResetModal}
        onClose={handleCloseResetModal}
        onConfirm={handleConfirmReset}
      />
    </>
  );
};

export default LevelModalManager;
