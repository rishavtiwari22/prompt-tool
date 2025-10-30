import React, { useRef, useEffect } from "react";
import { Target, Send, Loader2 } from "lucide-react";

const ImageDisplaySection = ({
  currentLevel,
  targetImages,
  levelDescriptions,
  imageLoadErrors,
  setImageLoadErrors,
  prompt,
  setPrompt,
  generatedImage,
  isGenerating,
  isComparing,
  handleCreateImage,
  handleReset,
}) => {
  return (
    <div
      className="lg:pr-12"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Target Image Box - Centered in left section */
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
        }}
      >
        {!imageLoadErrors[currentLevel] ? (
          <img
            src={targetImages[currentLevel]}
            alt={`Level ${currentLevel} target: ${levelDescriptions[currentLevel]}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
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
            <Target size={48} style={{ marginBottom: "1rem", opacity: 0.6 }} />
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

      {/* Prompt Input Box - Centered in left section */}
      <div
        className="paper border-3"
        style={{
          borderColor: "var(--color-text-primary)",
          backgroundColor: "white",
          padding: "1rem 1.25rem",
          maxWidth: "550px",
          width: "100%",
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
                <Loader2
                  size={16}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                <span style={{ marginLeft: "6px" }}>Generating</span>
              </>
            ) : isComparing ? (
              <>
                <Loader2
                  size={16}
                  style={{ animation: "spin 1s linear infinite" }}
                />
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
  );
};

export default ImageDisplaySection;
