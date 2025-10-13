
import React, { useState } from 'react';
import { RefreshCw, Send } from 'lucide-react';
import illustrationImage from '../assets/Frame 473.svg';
import { compareImages } from '../utils/imageComparison';
import { generateImageWithProgress } from '../utils/imageGeneration';

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

  const handleReset = () => {
    setPrompt("");
    setAccuracy(0);
    setGeneratedImage(null);
  };

  const handleLevelChange = (level) => {
    onLevelChange(level);
    setAccuracy(0);
    setGeneratedImage(null);
  };

  const handleCreateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedImage(null);
    setAccuracy(0);
    
    try {
      console.log('Creating image with prompt:', prompt);
      
      // Generate image using the utility
      const generatedImageUrl = await generateImageWithProgress(
        prompt.trim()
      );
      
      setGeneratedImage(generatedImageUrl);
      
      // Automatically compare with target image when generation is complete
      const targetImage = targetImages[currentLevel];
      setIsComparing(true);
      
      const similarity = await compareImages(generatedImageUrl, targetImage);
      setAccuracy(similarity);
      
    } catch (error) {
      console.error('Image generation or comparison failed:', error);
      setAccuracy(0);
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
              
              <img
                src={targetImages[currentLevel]}
                alt={`Level ${currentLevel} target: ${levelDescriptions[currentLevel]}`}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
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
                  <div
                    style={{
                      width: `${accuracy}%`,
                      height: "100%",
                      backgroundColor: "var(--color-primary)",
                      transition: "width 0.3s ease",
                    }}
                  ></div>
                </div>

                {/* Labels */}
                <div
                  className="flex justify-between"
                  style={{
                    marginTop: "0.5rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <span>0%</span>
                  <span>{`${accuracy}%`}</span>
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
                  <img
                    src={illustrationImage}
                    alt="Prompt learning illustration"
                    style={{ maxWidth: '280px', height: 'auto', marginBottom: '1.5rem' }}
                  />
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
                    fontSize: "16px",
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
    </div>
  );
};

export default Home;
