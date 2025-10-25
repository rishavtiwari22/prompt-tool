import React from "react";
import ModalLevel from "../ModalLevel";
import ResetConfirmModal from "../ResetConfirmModal";

const LevelModalManager = ({
  accuracy,
  currentLevel,
  showResetModal,
  isModalPreviewOpen,
  setIsModalPreviewOpen,
  handlePlayNextLevel,
  handleCloseResetModal,
  handleConfirmReset,
  setLevelUnlocked,
  onLevelChange,
  setPrompt,
  setGeneratedImage,
  setAccuracy,
}) => {
  return (
    <>
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
