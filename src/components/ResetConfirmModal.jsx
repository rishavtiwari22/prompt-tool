


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
        className="w-full max-w-xl mx-4 sm:max-w-2xl border-2 border-black"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#605E5E",
          color: "#FFFFFF",
        }}
      >
        {/* Header with left-aligned title */}
        <div className="p-4 sm:p-6">
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "36px",
              fontWeight: "400",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              textAlign: "left",
            }}
          >
            RESET THIS LEVEL
          </h2>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 pb-3">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "22px",
              lineHeight: "1.5",
            }}
          >
            Are you sure? This will clear your current prompt and you'll have to
            start this level from scratch.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 sm:justify-end">
          <button
            className="paper-btn flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-3 order-2 sm:order-1"
            onClick={onClose}
            style={{
              backgroundColor: "#FFFFFF",
              border: "2px solid #000000",
              color: "#000000",
              fontFamily: "var(--font-body)",
              fontSize: "20px",
            }}
          >
            <X size={20} />
            <span>Cancel</span>
          </button>

          <button
            className="paper-btn flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-3 order-1 sm:order-2"
            onClick={handleConfirm}
            style={{
              backgroundColor: "var(--color-primary-light)",
              border: "2px solid #000000",
              color: "#000000",
              fontFamily: "var(--font-body)",
              fontSize: "20px",
            }}
          >
            <RotateCcw size={20} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmModal;
