


import React, { useState, useEffect } from 'react';
import { RefreshCw, Send, Target } from 'lucide-react';
import illustrationImage from '../assets/Frame 473.svg';
import { compareImages } from '../utils/imageComparison';
import { generateImageWithProgress } from '../utils/imageGeneration';
import { ZoneToast, InfoToast } from '../components/Toast';
import audioManager from '../utils/audioManager';

// Import challenge images
import challenge1Image from '../assets/challanges/challenge-1.png';
import challenge2Image from '../assets/challanges/challenge-2.png';
import challenge3Image from '../assets/challanges/challenge-3.png';
import challenge4Image from '../assets/challanges/challenge-4.png';
import challenge5Image from '../assets/challanges/challenge-5.png';
import challenge6Image from '../assets/challanges/challenge-6.png';

const Home = ({ currentLevel, onLevelChange }) => {
  const [prompt, setPrompt] = useState('');
  const [accuracy, setAccuracy] = useState(0);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Simple toast states
  const [showZoneToast, setShowZoneToast] = useState(false);
  const [showInfoToast, setShowInfoToast] = useState(false);
  const [previousAccuracy, setPreviousAccuracy] = useState(0);
  
  // Image loading states
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  // Target images for each level
  const targetImages = {
    1: challenge1Image,
    2: challenge2Image,
    3: challenge3Image,
    4: challenge4Image,
    5: challenge5Image
  };

  // Level descriptions
  const levelDescriptions = {
    1: "Challenge 1",
    2: "Challenge 2", 
    3: "Challenge 3",
    4: "Challenge 4",
    5: "Challenge 5"
  };

  const handleReset = async () => {
    await audioManager.playReset();
    setPrompt("");
    setPreviousAccuracy(accuracy);
    setAccuracy(0);
    setGeneratedImage(null);
  };

  const handleLevelChange = (level) => {
    onLevelChange(level);
    setPreviousAccuracy(accuracy);
    setAccuracy(0);
    setGeneratedImage(null);
  };

  // Get progress bar color based on accuracy range
  const getProgressBarColor = (accuracy) => {
    if (accuracy >= 70) {
      return 'var(--color-success)'; // Green for high scores (70%+)
    } else if (accuracy >= 50) {
      return 'var(--color-secondary)'; // Blue for medium scores (50-69%)
    } else if (accuracy >= 25) {
      return 'var(--color-accent)'; // Pink for low scores (25-49%)
    } else {
      return 'var(--color-primary)'; // Purple for very low scores (0-24%)
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
      console.log('Creating image with prompt:', prompt);
      
      // Generate image using the utility
      const generatedImageUrl = await generateImageWithProgress(
        prompt.trim()
      );
      
      setGeneratedImage(generatedImageUrl);
      
      // Play image generation success sound
      await audioManager.playImageGenerated();
      
      // Show success toast
      setShowInfoToast(true);
      
      // Automatically compare with target image when generation is complete
      const targetImage = targetImages[currentLevel];
      setIsComparing(true);
      
      const similarity = await compareImages(generatedImageUrl, targetImage);
      setAccuracy(similarity);
      
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
      console.error('Image generation or comparison failed:', error);
      setAccuracy(0);
      
      // Show error toast (using InfoToast for simplicity)
      setShowInfoToast(true);
    } finally {
      setIsGenerating(false);
      setIsComparing(false);
    }
  };

  return (
    <div className="px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Center guide to align levels between the two boxes */}
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
                borderColor: 'var(--color-text-primary)',
                backgroundColor: 'white',
                padding: '2rem',
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem'
              }}
            >
              
              {!imageLoadErrors[currentLevel] ? (
                <img
                  src={targetImages[currentLevel]}
                  alt={`Level ${currentLevel} target: ${levelDescriptions[currentLevel]}`}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    console.error(`Failed to load challenge image for level ${currentLevel}:`, e);
                    setImageLoadErrors(prev => ({ ...prev, [currentLevel]: true }));
                  }}
                  onLoad={() => {
                    console.log(`Challenge image loaded successfully for level ${currentLevel}`);
                    setImageLoadErrors(prev => ({ ...prev, [currentLevel]: false }));
                  }}
                />
              ) : (
                <div 
                  style={{
                    width: '100%',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--color-primary-light)',
                    border: '2px dashed var(--color-primary)',
                    borderRadius: '8px',
                    color: 'var(--color-primary-dark)'
                  }}
                >
                  <Target size={48} style={{ marginBottom: '1rem', opacity: 0.6 }} />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', textAlign: 'center' }}>
                    Challenge Image<br />
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
                Accuracy Score
              </h4>


              {/* Progress Bar - Constrained to card width */}
              <div className="relative" style={{ padding: "0 0.25rem" }}>
                <div
                  style={{
                    width: "100%",
                    height: "22px",
                    border: "3px solid var(--color-text-primary)",
                    borderRadius: "20px",
                    backgroundColor: "white",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Progress Fill */}
                  <div
                    style={{
                      width: `${accuracy}%`,
                      height: "100%",
                      backgroundColor: getProgressBarColor(accuracy),
                      transition: "width 0.3s ease, background-color 0.3s ease",
                    }}
                  ></div>

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
                </div>

                {/* Labels - Positioned at their respective percentages */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "30px",
                    marginTop: "0.5rem",
                  }}
                >
                  {/* Accuracy Percentage Label - Shows below the progress fill */}
                  {accuracy > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        left: `${accuracy}%`,
                        transform: "translateX(-50%)",
                        fontFamily: "var(--font-body)",
                        fontSize: "16px",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {`${accuracy}%`}
                    </span>
                  )}

                  {/* 70% Target Label - Always shows at standing line position */}
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
              {generatedImage ? (
                <>
                  <img
                    src={generatedImage}
                    alt="Generated image"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </>
              ) : (
                <div>
                  {!imageLoadErrors.illustration ? (
                    <img
                      src={illustrationImage}
                      alt="Prompt learning illustration"
                      style={{ maxWidth: '280px', height: 'auto', marginBottom: '1.5rem' }}
                      onError={(e) => {
                        console.error('Failed to load illustration image:', e);
                        setImageLoadErrors(prev => ({ ...prev, illustration: true }));
                      }}
                      onLoad={() => {
                        console.log('Illustration image loaded successfully');
                        setImageLoadErrors(prev => ({ ...prev, illustration: false }));
                      }}
                    />
                  ) : (
                    <div 
                      style={{
                        width: '280px',
                        height: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--color-secondary-light)',
                        border: '2px dashed var(--color-secondary)',
                        borderRadius: '12px',
                        color: 'var(--color-secondary-dark)',
                        marginBottom: '1.5rem'
                      }}
                    >
                      <Send size={48} style={{ marginBottom: '1rem', opacity: 0.6 }} />
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', textAlign: 'center' }}>
                        Ready to Create<br />
                        <small>Enter your prompt below</small>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Reset Button - Centered */}
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
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Reset
                <RefreshCw size={16} />
              </button>
            </div>

            

            {/* Demo Toast Buttons */}
            {/* <div className="flex justify-center gap-2" style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => setShowZoneToast(true)}
                style={{
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  border: '2px solid #f5c6cb',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Zone Toast
              </button>
              <button
                onClick={() => setShowInfoToast(true)}
                style={{
                  backgroundColor: '#cce7f0',
                  color: '#0c5460',
                  border: '2px solid #b6d4d9',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Info Toast
              </button>
            </div> */}

            

            {/* Prompt Input Box - Full Width Aligned */}
            <div
              className="paper border-3"
              style={{
                borderColor: "var(--color-text-primary)",
                backgroundColor: "white",
                padding: "1rem 1.25rem",
              }}
            >
              
              
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCreateImage();
                    }
                  }}
                  placeholder="prompt to generate image"
                  className="flex-1 input--prompt"
                  style={{
                    border: "none",
                    outline: "none",
                    fontFamily: "var(--font-body)",
                    fontSize: "18px",
                    color: "var(--color-text-primary)",
                    backgroundColor: "transparent",
                    height: "46px",
                    padding: "0 0.5rem",
                  }}
                />
                <button
                  onClick={handleCreateImage}
                  disabled={!prompt.trim() || isComparing || isGenerating}
                  className="paper-btn"
                  style={{
                    backgroundColor: (!prompt.trim() || isComparing || isGenerating) ? '#f3f4f6' : 'var(--color-primary-light)',
                    color: (!prompt.trim() || isComparing || isGenerating) ? '#9ca3af' : 'var(--color-primary-dark)',
                    border: `2px solid ${(!prompt.trim() || isComparing || isGenerating) ? '#d1d5db' : 'var(--color-primary)'}`,
                    height: '46px',
                    padding: '0 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '16px',
                    cursor: (!prompt.trim() || isComparing || isGenerating) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    minWidth: '150px'
                  }}
                >
                  {isGenerating ? 'Generating...' : isComparing ? 'Analyzing...' : 'Create Image'}
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Components */}
      <ZoneToast 
        show={showZoneToast} 
        onClose={() => setShowZoneToast(false)} 
      />
      <InfoToast 
        show={showInfoToast} 
        onClose={() => setShowInfoToast(false)} 
      />
    </div>
  );
};

export default Home;