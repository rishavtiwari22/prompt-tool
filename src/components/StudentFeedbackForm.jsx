import React, { useState } from 'react';
import { Star, Heart, Send, ThumbsUp, ThumbsDown, Meh } from 'lucide-react';
import analytics from '../utils/analytics';
import audioManager from '../utils/audioManager';

const StudentFeedbackForm = ({ 
  isOpen, 
  onClose, 
  challengesCompleted = 0,
  onSubmit 
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [experience, setExperience] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Simple emoji rating options
  const emojiRatings = [
    { emoji: '😢', label: 'बहुत कठिन था', value: 1, color: '#ff4757' },
    { emoji: '😕', label: 'थोड़ा कठिन था', value: 2, color: '#ff7675' },
    { emoji: '😐', label: 'ठीक था', value: 3, color: '#fdcb6e' },
    { emoji: '😊', label: 'अच्छा था', value: 4, color: '#6c5ce7' },
    { emoji: '😍', label: 'बहुत मज़ा आया!', value: 5, color: '#00b894' }
  ];

  const experienceOptions = [
    { id: 'easy', label: 'आसान लगा', icon: '😊' },
    { id: 'fun', label: 'मज़ेदार था', icon: '🎉' },
    { id: 'learning', label: 'कुछ नया सीखा', icon: '💡' },
    { id: 'creative', label: 'Creative बनाया', icon: '🎨' },
    { id: 'challenging', label: 'Challenge अच्छा था', icon: '💪' },
    { id: 'confusing', label: 'समझ नहीं आया', icon: '🤔' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('कृपया अपनी rating दें! 😊');
      return;
    }

    setIsSubmitting(true);

    try {
      // Play button click sound
      await audioManager.playButtonClick();

      // Track feedback submission
      analytics.trackFeedbackFormSubmitted(rating, feedback, challengesCompleted);

      // Submit to parent component if provided
      if (onSubmit) {
        await onSubmit({
          rating,
          feedback,
          experience,
          challengesCompleted,
          timestamp: new Date().toISOString()
        });
      }

      // Play success sound
      await audioManager.playLevelComplete();
      
      setIsSubmitted(true);
      
      // Auto close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('कुछ गलत हुआ है। कृपया फिर से कोशिश करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = async () => {
    await audioManager.playButtonClick();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '3px solid #000000',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '32px',
          position: 'relative'
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%'
          }}
        >
          ✕
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '32px',
                  color: 'var(--color-primary)',
                  margin: '0 0 8px 0',
                  textTransform: 'uppercase'
                }}
              >
                आपका Feedback! 🌟
              </h2>
              <p 
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '18px',
                  color: 'var(--color-text-secondary)',
                  margin: 0
                }}
              >
                आपने {challengesCompleted} challenges complete किए हैं!
              </p>
            </div>

            {/* Emoji Rating */}
            <div style={{ marginBottom: '32px' }}>
              <label 
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}
              >
                यह Tool कैसा लगा? 😊
              </label>
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                {emojiRatings.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRating(item.value)}
                    onMouseEnter={() => setHoverRating(item.value)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      background: rating === item.value ? item.color : '#f8f9fa',
                      border: rating === item.value ? `3px solid ${item.color}` : '2px solid #dee2e6',
                      borderRadius: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: rating === item.value || hoverRating === item.value ? 'scale(1.1)' : 'scale(1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: '80px'
                    }}
                  >
                    <span style={{ fontSize: '24px', marginBottom: '4px' }}>
                      {item.emoji}
                    </span>
                    <span 
                      style={{
                        fontSize: '12px',
                        fontFamily: 'var(--font-body)',
                        color: rating === item.value ? '#ffffff' : 'var(--color-text-secondary)',
                        textAlign: 'center',
                        lineHeight: '1.2'
                      }}
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Selection */}
            <div style={{ marginBottom: '32px' }}>
              <label 
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  marginBottom: '16px'
                }}
              >
                आपका experience कैसा था? (Optional)
              </label>
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '8px'
                }}
              >
                {experienceOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setExperience(experience === option.id ? '' : option.id)}
                    style={{
                      background: experience === option.id ? 'var(--color-primary)' : '#f8f9fa',
                      color: experience === option.id ? '#ffffff' : 'var(--color-text-primary)',
                      border: experience === option.id ? '2px solid var(--color-primary)' : '2px solid #dee2e6',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Feedback */}
            <div style={{ marginBottom: '32px' }}>
              <label 
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  marginBottom: '8px'
                }}
              >
                कुछ और बताना चाहते हैं? (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="यहाँ लिखें... जैसे: यह tool मुझे अच्छा लगा क्योंकि..."
                style={{
                  width: '100%',
                  height: '100px',
                  padding: '12px',
                  border: '2px solid #dee2e6',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              style={{
                width: '100%',
                padding: '16px',
                background: rating > 0 ? 'var(--color-primary)' : '#dee2e6',
                color: rating > 0 ? '#ffffff' : '#adb5bd',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontFamily: 'var(--font-body)',
                fontWeight: '600',
                cursor: rating > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textTransform: 'uppercase'
              }}
            >
              {isSubmitting ? (
                <>
                  <div 
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #ffffff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Feedback Submit करें
                </>
              )}
            </button>
          </form>
        ) : (
          // Success Message
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <h3 
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '28px',
                color: 'var(--color-primary)',
                margin: '0 0 16px 0'
              }}
            >
              धन्यवाद! 🙏
            </h3>
            <p 
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '18px',
                color: 'var(--color-text-secondary)',
                margin: 0,
                lineHeight: '1.5'
              }}
            >
              आपका feedback हमें बेहतर बनाने में मदद करेगा।<br />
              Keep learning और exploring! 🚀
            </p>
          </div>
        )}

        {/* CSS for spinner animation */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default StudentFeedbackForm;