import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import audioManager from '../utils/audioManager';
import { isAuthenticated, setUserAuth } from '../utils/authManager';

const OTPVerification = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const ADMIN_OTP = '123456';

  useEffect(() => {
    setMounted(true);
    
    if (isAuthenticated()) {
      navigate('/landing');
    }
  }, [navigate]);

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (audioManager.audioEnabled) {
      audioManager.playSound('buttonClick');
    }
    
    setError('');
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 800);
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      if (otp === ADMIN_OTP) {
        setUserAuth(name);
        
        if (audioManager.audioEnabled) {
          audioManager.playSound('levelComplete');
        }
        
        setIsLoading(false);
        navigate('/landing');
      } else {
        setError('Invalid OTP. Please try again.');
        setIsLoading(false);
        
        if (audioManager.audioEnabled) {
          audioManager.playSound('reset');
        }
      }
    }, 1000);
  };

  const handleBack = () => {
    setStep(1);
    setOtp('');
    setError('');
    
    if (audioManager.audioEnabled) {
      audioManager.playSound('buttonClick');
    }
  };

  if (!mounted) return null;

  const containerStyle = {
    minHeight: '100vh',
    background: 'var(--color-background)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden'
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '480px',
    padding: '40px',
    background: '#ffffff',
    border: '3px solid #000000',
    borderRadius: '8px',
    position: 'relative',
    zIndex: 10
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 16px 16px 48px',
    border: '2px solid #000000',
    borderRadius: '6px',
    fontSize: '18px',
    fontFamily: 'var(--font-body)',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
    outline: 'none'
  };

  const buttonStyle = {
    width: '100%',
    padding: '16px',
    background: 'var(--color-primary)',
    color: '#ffffff',
    border: '2px solid #000000',
    borderRadius: '6px',
    fontSize: '20px',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '48px',
              fontWeight: '400',
              color: 'var(--color-primary)',
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            {step === 1 ? 'Welcome!' : 'Verify Access'}
          </h1>
          <p 
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '20px',
              color: 'var(--color-text-secondary)',
              margin: 0,
              lineHeight: '1.5'
            }}
          >
            {step === 1 
              ? 'Enter your name to get started with the Prompt Learning Tool'
              : `Hi ${name}! Please enter the OTP provided by admin`
            }
          </p>
        </div>

        {error && (
          <div 
            style={{
              background: '#f8d7da',
              color: '#721c24',
              border: '2px solid #f5c6cb',
              borderRadius: '6px',
              padding: '12px 16px',
              marginBottom: '24px',
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleNameSubmit}>
            <div style={{ marginBottom: '32px' }}>
              <label 
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: '18px',
                  fontWeight: '500',
                  color: 'var(--color-text-primary)',
                  marginBottom: '8px'
                }}
              >
                Your Name
              </label>
              <div style={{ position: 'relative' }}>
                <User 
                  size={20} 
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-icon)',
                    zIndex: 2
                  }}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              style={{
                ...buttonStyle,
                background: name.trim() ? 'var(--color-primary)' : 'var(--color-text-disabled)',
                cursor: name.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOTPSubmit}>
            <div style={{ marginBottom: '32px' }}>
              <label 
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: '18px',
                  fontWeight: '500',
                  color: 'var(--color-text-primary)',
                  marginBottom: '8px'
                }}
              >
                Access Code (OTP)
              </label>
              <div style={{ position: 'relative' }}>
                <Lock 
                  size={20} 
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-icon)',
                    zIndex: 2
                  }}
                />
                <input
                  type={showOtp ? "text" : "password"}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  style={{
                    ...inputStyle,
                    padding: '16px 56px 16px 48px',
                    letterSpacing: '2px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowOtp(!showOtp)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-icon)',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showOtp ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p 
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                  marginTop: '8px',
                  fontStyle: 'italic'
                }}
              >
                Contact admin if you don't have the access code
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={handleBack}
                style={{
                  flex: '1',
                  padding: '16px',
                  background: '#ffffff',
                  color: 'var(--color-text-primary)',
                  border: '2px solid #000000',
                  borderRadius: '6px',
                  fontSize: '18px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase'
                }}
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isLoading || !otp.trim()}
                style={{
                  flex: '2',
                  padding: '16px',
                  background: otp.trim() ? 'var(--color-primary)' : 'var(--color-text-disabled)',
                  color: '#ffffff',
                  border: '2px solid #000000',
                  borderRadius: '6px',
                  fontSize: '18px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: '500',
                  cursor: otp.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isLoading ? 'Verifying...' : 'Verify & Enter'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export { OTPVerification as default };