

import { useState, useEffect } from 'react';
import '../styles/levelCompleteModal.css';

const LevelCompleteModal = ({ onPlay, level = 1 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    
    const autoCloseTimer = setTimeout(() => {
      if (onPlay) {
        onPlay(); 
      }
    }, 5000); 

    const timer1 = setTimeout(() => createConfetti(), 800);
    const timer2 = setTimeout(() => createConfetti(), 2000);

    return () => {
      clearTimeout(autoCloseTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onPlay]);

  const createConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa502', '#ff6348', '#a855f7', '#667eea', '#f093fb', '#4facfe'];
    const shapes = ['●', '■', '▲', '★'];
    const confettiCount = 60;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.fontSize = (Math.random() * 10 + 15) + 'px';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 3}s linear forwards`;
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 6000);
      }, i * 30);
    }
  };

  const createBurst = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      
      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = 120 + Math.random() * 40;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');
      particle.style.animation = `particleBurst ${0.8 + Math.random() * 0.4}s ease-out forwards`;
      
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1500);
    }
    
    e.currentTarget.style.animation = 'none';
    setTimeout(() => {
      e.currentTarget.style.animation = 'pulseGlow 0.5s ease-out';
    }, 10);
  };

  const closeModal = () => {
    const overlay = document.querySelector('.modal-overlay');
    const modal = document.querySelector('.modal-container');
    if (modal) modal.style.animation = 'modalSlideOut 0.4s ease-out forwards';
    if (overlay) overlay.style.animation = 'fadeOut 0.4s ease-out forwards';
    setTimeout(() => {
      setIsVisible(false);
    }, 2500);
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={closeModal}>×</button>
        
        <h1 className="level-complete-text">LEVEL COMPLETE!</h1>
        
        <div className="crown-container">
          {/* Stars above crown - increase with level */}
          <div style={{
            position: 'absolute',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 10
          }}>
            {[...Array(level)].map((_, index) => (
              <span 
                key={index}
                style={{
                  fontSize: '24px',
                  animation: `starPop 0.5s ease-out ${0.3 + index * 0.1}s backwards`,
                  filter: 'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.6))'
                }}
              >
                ⭐
              </span>
            ))}
          </div>
          
          <div className="crown-icon">
            <svg className="crown-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              <path d="M 15 75 L 22 50 L 38 62 L 60 35 L 82 62 L 98 50 L 105 75 Z" 
                    fill="#FFD700" stroke="#FFA500" strokeWidth="2.5"/>
              <rect x="15" y="75" width="90" height="18" fill="#FFD700" stroke="#FFA500" 
                    strokeWidth="2.5" rx="3"/>
              <rect x="15" y="80" width="90" height="4" fill="#FFA500" opacity="0.6"/>
              <circle cx="35" cy="65" r="5" fill="#FF6B6B" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="60" cy="55" r="5" fill="#4ECDC4" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="85" cy="65" r="5" fill="#A855F7" stroke="#fff" strokeWidth="1.5"/>
              <path d="M 100 25 L 104 35 L 114 35 L 106 41 L 109 51 L 100 45 L 91 51 L 94 41 L 86 35 L 96 35 Z" 
                    fill="#FFD700" stroke="#FFA500" strokeWidth="1.5"/>
              <circle cx="20" cy="55" r="3" fill="#FFF" opacity="0.8"/>
              <circle cx="30" cy="45" r="2.5" fill="#FFF" opacity="0.7"/>
              <circle cx="90" cy="55" r="3" fill="#FFF" opacity="0.8"/>
              <circle cx="100" cy="58" r="2" fill="#FFF" opacity="0.6"/>
            </svg>
            
            <div className="sparkle sparkle-1">✨</div>
            <div className="sparkle sparkle-2">✨</div>
            <div className="sparkle sparkle-3">✨</div>
            <div className="sparkle sparkle-4">✨</div>
          </div>
        </div>
        
        <h2 className="prompt-explorer-text">
          <span className="celebration-emoji">🎉</span>
          You are a Prompt Explorer!
          <span className="celebration-emoji">🎉</span>
        </h2>
        

      </div>
    </div>
  );
};

export default LevelCompleteModal;