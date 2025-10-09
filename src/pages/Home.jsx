


import React, { useState } from 'react';
import { RefreshCw, Send } from 'lucide-react';
import illustrationImage from '../assets/Frame 473.svg';


const Home = () => {
  const [prompt, setPrompt] = useState('');
  const [accuracy, setAccuracy] = useState(70);

  const handleReset = () => {
    setPrompt('');
    setAccuracy(0);
  };

  const handleCreateImage = () => {
    console.log('Creating image with prompt:', prompt);
    // Add your image generation logic here
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Center guide to align levels between the two boxes */}
        <div className="hidden lg:block" aria-hidden="true" style={{ height: '0' }}></div>
        {/* Two Column Layout with Divider */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 relative" style={{ overflow: 'hidden' }}>
          {/* Vertical Divider - shared style; spans between cards */}
          <div
            className="hidden lg:block divider-vertical absolute left-1/2"
            aria-hidden="true"
            style={{
              top: '0',
              bottom: '0',
              transform: 'translateX(-50%)',
              zIndex: 0
            }}
          ></div>

          {/* LEFT COLUMN */}
          <div className="lg:pr-12">
            {/* Image Box */}
            <div
              className="paper border-3"
              style={{
                borderColor: 'var(--color-text-primary)',
                backgroundColor: 'white',
                padding: '2rem',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop"
                alt="Cardboard box"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* Accuracy Score Section */}
            <div>
              <h4
                className="h4 text-center"
                style={{ color: 'var(--color-text-primary)', marginBottom: '1.25rem' }}
              >
                Accuracy Score
              </h4>

              {/* Progress Bar - Constrained to card width */}
              <div className="relative" style={{ padding: '0 0.25rem' }}>
                <div
                  style={{
                    width: '100%',
                    height: '22px',
                    border: '3px solid var(--color-text-primary)',
                    borderRadius: '20px',
                    backgroundColor: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: `${accuracy}%`,
                      height: '100%',
                      backgroundColor: 'var(--color-primary)',
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </div>

                {/* Labels */}
                <div
                  className="flex justify-between"
                  style={{
                    marginTop: '0.5rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '16px',
                    color: 'var(--color-text-secondary)'
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
            {/* Top Illustration Box */}
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
                textAlign: 'center',
                marginBottom: '2rem'
              }}
            >
              <img
                src={illustrationImage}
                alt="Prompt learning illustration"
                style={{ maxWidth: '280px', height: 'auto', marginBottom: '1.5rem' }}
              />
            </div>

            {/* Reset Button - Centered */}
            <div className="flex justify-center" style={{ marginBottom: '1rem' }}>
              <button
                onClick={handleReset}
                className="paper-btn"
                style={{
                  backgroundColor: 'var(--color-accent-light)',
                  color: 'var(--color-accent-dark)',
                  border: '2px solid var(--color-accent)',
                  padding: '0.5rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
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
                borderColor: 'var(--color-text-primary)',
                backgroundColor: 'white',
                padding: '1rem 1.25rem'
              }}
            >
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="prompt to generate image"
                  className="flex-1 input--prompt"
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '16px',
                    color: 'var(--color-text-primary)',
                    backgroundColor: 'transparent',
                    height: '46px',
                    padding: '0 0.5rem'
                  }}
                />
                <button
                  onClick={handleCreateImage}
                  className="paper-btn"
                  style={{
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary-dark)',
                    border: '2px solid var(--color-primary)',
                    height: '46px',
                    padding: '0 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    minWidth: '150px'
                  }}
                >
                  Create Image
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


