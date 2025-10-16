import React from 'react';
import audioManager from '../utils/audioManager';

function RulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={async () => {
          await audioManager.playButtonClick();
          onClose();
        }}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <div 
          className="card pointer-events-auto transform transition-all duration-300 w-full max-w-3xl"
          style={{ 
            backgroundColor: '#605E5E',
            border: '3px solid #000000',
            borderRadius: '0',
            boxShadow: 'none'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            className="card-header flex items-center justify-between relative py-5"
            style={{ 
              backgroundColor: '#605E5E',
              borderBottom: 'none',
              paddingLeft: '60px',
              paddingRight: '24px'
            }}
          >
            <h4 
              className="text-white m-0 font-normal"
              style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: '32px',
                lineHeight: '130%',
                letterSpacing: '-0.28px',
                fontWeight: '400'
              }}
            >
              How to play?
            </h4>
            <button
              onClick={async () => {
                await audioManager.playButtonClick();
                onClose();
              }}
              className="text-white hover:text-gray-300 transition-colors p-1"
              aria-label="Close modal"
            >
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div 
            className="card-body px-6 sm:px-8 md:px-10 py-8 space-y-6 max-h-[65vh] sm:max-h-[70vh] overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#888 #605E5E'
            }}
          >
            {/* Rule 1 */}
            <div className="flex gap-4 sm:gap-5 items-start">
              <div 
                className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white font-normal"
                style={{ 
                  backgroundColor: '#4D4D4D',
                  border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '22px',
                  fontWeight: '400'
                }}
              >
                1
              </div>
              <p 
                className="text-white flex-1 pt-2"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '20px',
                  lineHeight: '150%',
                  letterSpacing: '-0.28px',
                  fontWeight: '400',
                  margin: '0'
                }}
              >
                Each level introduces new challenges (different targets, time limits, or creative constraints)
              </p>
            </div>

            {/* Rule 2 */}
            <div className="flex gap-4 sm:gap-5 items-start">
              <div 
                className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white font-normal"
                style={{ 
                  backgroundColor: '#4D4D4D',
                  border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '22px',
                  fontWeight: '400'
                }}
              >
                2
              </div>
              <p 
                className="text-white flex-1 pt-2"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '20px',
                  lineHeight: '150%',
                  letterSpacing: '-0.28px',
                  fontWeight: '400',
                  margin: '0'
                }}
              >
                Scores above 70% unlock the next level
              </p>
            </div>

            {/* Rule 3 */}
            <div className="flex gap-4 sm:gap-5 items-start">
              <div 
                className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white font-normal"
                style={{ 
                  backgroundColor: '#4D4D4D',
                  border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '22px',
                  fontWeight: '400'
                }}
              >
                3
              </div>
              <p 
                className="text-white flex-1 pt-2"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '20px',
                  lineHeight: '150%',
                  letterSpacing: '-0.28px',
                  fontWeight: '400',
                  margin: '0'
                }}
              >
                Extra points for originality, neat composition, and color accuracy
              </p>
            </div>

            {/* Rule 4 */}
            <div className="flex gap-4 sm:gap-5 items-start">
              <div 
                className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white font-normal"
                style={{ 
                  backgroundColor: '#4D4D4D',
                  border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '22px',
                  fontWeight: '400'
                }}
              >
                4
              </div>
              <p 
                className="text-white flex-1 pt-2"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '20px',
                  lineHeight: '150%',
                  letterSpacing: '-0.28px',
                  fontWeight: '400',
                  margin: '0'
                }}
              >
                Top players of the week are featured in the global leaderboard
              </p>
            </div>

            {/* Rule 5 */}
            <div className="flex gap-4 sm:gap-5 items-start">
              <div 
                className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white font-normal"
                style={{ 
                  backgroundColor: '#4D4D4D',
                  border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '22px',
                  fontWeight: '400'
                }}
              >
                5
              </div>
              <p 
                className="text-white flex-1 pt-2"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '20px',
                  lineHeight: '150%',
                  letterSpacing: '-0.28px',
                  fontWeight: '400',
                  margin: '0'
                }}
              >
                Type a prompt describing the image you want to generate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RulesModal;