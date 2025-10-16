import React from "react";
import { X, RotateCcw } from "lucide-react";

const ResetConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-md"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-4 sm:max-w-lg border-2 border-black"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#605E5E",
          color: "#FFFFFF",
        }}
      >
        {/* Header with centered title and close button */}
        <div className="relative p-3 sm:p-4">
          <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wide">
            RESET THIS LEVEL
          </h2>
          <button
            className="paper-btn absolute top-3 right-3 sm:top-4 sm:right-4 p-2 flex items-center justify-center"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              backgroundColor: "transparent",
              borderColor: "#FFFFFF",
              color: "#FFFFFF",
              minWidth: "36px",
              height: "36px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-3 sm:px-4 pb-2">
          <p className="text-sm sm:text-base leading-relaxed">
            Are you sure? This will clear your current prompt and you'll have to
            start this level from scratch.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 p-3 sm:p-4 sm:justify-end">
          <button
            className="paper-btn flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-2 order-2 sm:order-1"
            onClick={onClose}
            style={{
              backgroundColor: "#8B8B8B",
              //   borderColor: '#000000',
              color: "#FFFFFF",
            }}
          >
            <X size={18} />
            <span>Cancel</span>
          </button>

          <button
            className="paper-btn flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-2 order-1 sm:order-2"
            onClick={handleConfirm}
            style={{
              backgroundColor: "var(--color-primary, #7345E4)",
              //   borderColor: '#000000',
              color: "#FFFFFF",
            }}
          >
            <RotateCcw size={18} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmModal;
