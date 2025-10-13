import React, { useState, useEffect } from 'react';
import { X, ThumbsUp, Info } from 'lucide-react';

// Zone Toast Component (Pink)
const ZoneToast = ({ show = false, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        handleClose();
      }, 6000);
      
      return () => clearTimeout(timer);
    } else {
      handleClose();
    }
  }, [show]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '800px',
        zIndex: 9999,
        opacity: isAnimating ? 1 : 0,
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <div
        style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '2px solid #f5c6cb',
          borderRadius: '8px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          width: '100%',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          fontFamily: 'var(--font-body, Arial, sans-serif)',
          fontSize: '18px',
          fontWeight: '500',
        }}
      >
        <div style={{ flexShrink: 0, color: '#721c24' }}>
          <ThumbsUp size={24} />
        </div>
        <div style={{ flex: 1 }}>
          You're in the Zone! Keep refining your prompt for a perfect match
        </div>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#721c24',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            opacity: 0.7,
            transition: 'opacity 0.2s ease',
          }}
          onMouseOver={(e) => e.target.style.opacity = '1'}
          onMouseOut={(e) => e.target.style.opacity = '0.7'}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

// Info Toast Component (Light Blue)
const InfoToast = ({ show = false, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        handleClose();
      }, 6000);
      
      return () => clearTimeout(timer);
    } else {
      handleClose();
    }
  }, [show]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '800px',
        zIndex: 9999,
        opacity: isAnimating ? 1 : 0,
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <div
        style={{
          backgroundColor: '#cce7f0',
          color: '#0c5460',
          border: '2px solid #b6d4d9',
          borderRadius: '8px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          width: '100%',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          fontFamily: 'var(--font-body, Arial, sans-serif)',
          fontSize: '18px',
          fontWeight: '500',
        }}
      >
        <div style={{ flexShrink: 0, color: '#0c5460' }}>
          <Info size={24} />
        </div>
        <div style={{ flex: 1 }}>
          Great progress! Your image generation skills are improving
        </div>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#0c5460',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            opacity: 0.7,
            transition: 'opacity 0.2s ease',
          }}
          onMouseOver={(e) => e.target.style.opacity = '1'}
          onMouseOut={(e) => e.target.style.opacity = '0.7'}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export { ZoneToast, InfoToast };
