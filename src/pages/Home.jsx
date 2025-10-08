// import React, { useState } from 'react';
// import { RefreshCw, Send } from 'lucide-react';
// import illustrationImage from '../assets/Frame 473.svg';

// const Home = () => {
//   const [prompt, setPrompt] = useState('');
//   const [accuracy, setAccuracy] = useState(70);

//   const handleReset = () => {
//     setPrompt('');
//     setAccuracy(0);
//   };

//   const handleCreateImage = () => {
//     console.log('Creating image with prompt:', prompt);
//     // Add your image generation logic here
//   };

//   return (
//     <div className="min-h-screen p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Two Column Layout with Divider */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 relative">
          
//           {/* Vertical Divider Line - Thin Grey */}
//           <div 
//             className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px]"
//             style={{
//               backgroundColor: '#D1D5DB',
//               transform: 'translateX(-50%)'
//             }}
//           ></div>

//           {/* LEFT COLUMN */}
//           <div className="flex flex-col lg:pr-8">
//             {/* Image Box */}
//             <div className="paper border-3 mb-6" style={{ 
//               borderColor: 'var(--color-text-primary)',
//               backgroundColor: 'white',
//               padding: '2rem',
//               height: '500px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center'
//             }}>
//               <img 
//                 src="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop" 
//                 alt="Cardboard box"
//                 style={{
//                   maxWidth: '100%',
//                   maxHeight: '100%',
//                   objectFit: 'contain'
//                 }}
//               />
//             </div>

//             {/* Accuracy Score Section - Centered */}
//             <div className="flex flex-col items-center">
//               <h4 className="h4" style={{ 
//                 color: 'var(--color-text-primary)', 
//                 marginBottom: '1rem',
//                 fontSize: '28px'
//               }}>
//                 Accuracy Score
//               </h4>
              
//               {/* Slimmer Progress Bar */}
//               <div className="relative w-full max-w-md">
//                 <div style={{
//                   width: '100%',
//                   height: '24px',
//                   border: '3px solid var(--color-text-primary)',
//                   borderRadius: '20px',
//                   backgroundColor: 'white',
//                   position: 'relative',
//                   overflow: 'hidden'
//                 }}>
//                   <div style={{
//                     width: `${accuracy}%`,
//                     height: '100%',
//                     backgroundColor: 'var(--color-primary)',
//                     transition: 'width 0.3s ease'
//                   }}></div>
//                 </div>
                
//                 {/* Labels */}
//                 <div className="flex justify-between mt-2" style={{
//                   fontFamily: 'var(--font-body)',
//                   fontSize: '18px',
//                   color: 'var(--color-text-primary)'
//                 }}>
//                   <span>0%</span>
//                   <span>70%</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="flex flex-col lg:pl-8">
//             {/* Top Illustration Box */}
//             <div className="paper border-3 mb-6" style={{ 
//               borderColor: 'var(--color-text-primary)',
//               backgroundColor: 'white',
//               padding: '2.5rem',
//               height: '500px',
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               justifyContent: 'center',
//               textAlign: 'center'
//             }}>
//               <img 
//                 src={illustrationImage}
//                 alt="Prompt learning illustration"
//                 style={{
//                   maxWidth: '280px',
//                   height: 'auto',
//                   marginBottom: '2rem'
//                 }}
//               />
//               <p className="subtitle-1" style={{ 
//                 color: 'var(--color-text-primary)',
//                 maxWidth: '350px',
//                 fontSize: '20px',
//                 lineHeight: '1.5'
//               }}>
//                 Let's see what you've got! Your prompting journey starts now.
//               </p>
//             </div>

//             {/* Reset Button - Centered */}
//             <div className="flex justify-center mb-6">
//               <button 
//                 onClick={handleReset}
//                 className="paper-btn"
//                 style={{
//                   backgroundColor: 'var(--color-accent-light)',
//                   color: 'var(--color-accent-dark)',
//                   border: '2px solid var(--color-accent)',
//                   padding: '0.6rem 1.25rem',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '0.5rem',
//                   fontFamily: 'var(--font-body)',
//                   fontSize: '18px',
//                   cursor: 'pointer',
//                   transition: 'all 0.2s ease'
//                 }}
//               >
//                 Reset
//                 <RefreshCw size={18} />
//               </button>
//             </div>

//             {/* Compact Prompt Input Box */}
//             <div className="paper border-3" style={{ 
//               borderColor: 'var(--color-text-primary)',
//               backgroundColor: 'white',
//               padding: '1.25rem 1.5rem'
//             }}>
//               <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
//                 <input
//                   type="text"
//                   value={prompt}
//                   onChange={(e) => setPrompt(e.target.value)}
//                   placeholder="prompt to generate image"
//                   className="flex-1"
//                   style={{
//                     border: 'none',
//                     outline: 'none',
//                     fontFamily: 'var(--font-body)',
//                     fontSize: '16px',
//                     color: 'var(--color-text-primary)',
//                     backgroundColor: 'transparent',
//                     padding: '0.4rem 0.5rem'
//                   }}
//                 />
//                 <button 
//                   onClick={handleCreateImage}
//                   className="paper-btn"
//                   style={{
//                     backgroundColor: 'var(--color-primary-light)',
//                     color: 'var(--color-primary-dark)',
//                     border: '2px solid var(--color-primary)',
//                     padding: '0.5rem 1.25rem',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     gap: '0.5rem',
//                     fontFamily: 'var(--font-body)',
//                     fontSize: '16px',
//                     cursor: 'pointer',
//                     transition: 'all 0.2s ease',
//                     whiteSpace: 'nowrap'
//                   }}
//                 >
//                   Create Image
//                   <Send size={18} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;


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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Two Column Layout with Divider */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 relative">
          
          {/* Vertical Divider Line - Thin Grey */}
          <div 
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px]"
            style={{
              backgroundColor: '#D1D5DB',
              transform: 'translateX(-50%)'
            }}
          ></div>

          {/* LEFT COLUMN */}
          <div className="lg:pr-12">
            {/* Image Box */}
            <div className="paper border-3" style={{ 
              borderColor: 'var(--color-text-primary)',
              backgroundColor: 'white',
              padding: '2rem',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '2.5rem'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop" 
                alt="Cardboard box"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Accuracy Score Section */}
            <div>
              <h4 className="h4 text-center" style={{ 
                color: 'var(--color-text-primary)', 
                marginBottom: '2.4rem',
                fontSize: '28px'
              }}>
                Accuracy Score
              </h4>
              
              {/* Progress Bar - Full Width */}
              <div className="relative">
                <div style={{
                  width: '100%',
                  height: '24px',
                  border: '3px solid var(--color-text-primary)',
                  borderRadius: '20px',
                  backgroundColor: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${accuracy}%`,
                    height: '100%',
                    backgroundColor: 'var(--color-primary)',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                
                {/* Labels */}
                <div className="flex justify-between mt-2" style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '18px',
                  color: 'var(--color-text-primary)'
                }}>
                  <span>0%</span>
                  <span>70%</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:pl-12">
            {/* Top Illustration Box */}
            <div className="paper border-3" style={{ 
              borderColor: 'var(--color-text-primary)',
              backgroundColor: 'white',
              padding: '2.5rem',
              height: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              marginBottom: '2.5rem'
            }}>
              <img 
                src={illustrationImage}
                alt="Prompt learning illustration"
                style={{
                  maxWidth: '280px',
                  height: 'auto',
                  marginBottom: '2rem'
                }}
              />
            
            </div>

            {/* Reset Button - Centered */}
            <div className="flex justify-center" style={{ marginBottom: '1.5rem' }}>
              <button 
                onClick={handleReset}
                className="paper-btn"
                style={{
                  backgroundColor: 'var(--color-accent-light)',
                  color: 'var(--color-accent-dark)',
                  border: '2px solid var(--color-accent)',
                  padding: '0.6rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Reset
                <RefreshCw size={18} />
              </button>
            </div>

            {/* Prompt Input Box - Full Width Aligned */}
            <div className="paper border-3" style={{ 
              borderColor: 'var(--color-text-primary)',
              backgroundColor: 'white',
              padding: '1.25rem 1.5rem'
            }}>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="prompt to generate image"
                  className="flex-1"
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '16px',
                    color: 'var(--color-text-primary)',
                    backgroundColor: 'transparent',
                    padding: '0.4rem 0.5rem'
                  }}
                />
                <button 
                  onClick={handleCreateImage}
                  className="paper-btn"
                  style={{
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary-dark)',
                    border: '2px solid var(--color-primary)',
                    padding: '0.5rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Create Image
                  <Send size={18} />
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


