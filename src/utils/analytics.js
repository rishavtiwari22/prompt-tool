// Analytics utility for Google Analytics
// Initialize analytics services
export const initializeAnalytics = () => {
  // Get measurement ID from environment variables
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

  console.log('🔍 Initializing Google Analytics...');
  console.log('GA ID:', GA_MEASUREMENT_ID);

  // Google Analytics is already initialized in index.html
  if (GA_MEASUREMENT_ID && typeof gtag !== 'undefined') {
    console.log('✅ Google Analytics initialized successfully');
  } else {
    console.warn('⚠️ Google Analytics not properly initialized');
  }
};

// Track page views
export const trackPageView = (pageName, additionalProps = {}) => {
  try {
    // Google Analytics page view
    if (typeof gtag !== 'undefined') {
      gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_title: pageName,
        page_location: window.location.href,
        ...additionalProps
      });
    }

    console.log(`📊 Page view tracked: ${pageName}`);
  } catch (error) {
    console.error('❌ Error tracking page view:', error);
  }
};

// Track custom events
export const trackEvent = (eventName, properties = {}) => {
  try {
    // Google Analytics event
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: properties.category || 'User Interaction',
        event_label: properties.label,
        value: properties.value,
        ...properties
      });
    }

    console.log(`📈 Event tracked: ${eventName}`, properties);
  } catch (error) {
    console.error('❌ Error tracking event:', error);
  }
};

// Challenge/Problem specific tracking functions
export const trackChallengeStarted = (challengeId, challengeName) => {
  trackEvent('Challenge Started', {
    category: 'Learning Progress',
    challenge_id: challengeId,
    challenge_name: challengeName,
    label: `Challenge ${challengeId}`
  });
};

export const trackChallengeCompleted = (challengeId, challengeName, accuracy, timeSpent) => {
  trackEvent('Challenge Completed', {
    category: 'Learning Progress',
    challenge_id: challengeId,
    challenge_name: challengeName,
    accuracy_score: accuracy,
    time_spent_seconds: timeSpent,
    label: `Challenge ${challengeId} - ${accuracy}% accuracy`
  });
};

export const trackImageGenerated = (challengeId, prompt, generationTime) => {
  trackEvent('Image Generated', {
    category: 'User Action',
    challenge_id: challengeId,
    prompt_length: prompt.length,
    generation_time_ms: generationTime,
    label: `Challenge ${challengeId}`
  });
};

export const trackAccuracyScored = (challengeId, accuracy, previousAccuracy = null) => {
  trackEvent('Accuracy Scored', {
    category: 'Learning Progress',
    challenge_id: challengeId,
    accuracy_score: accuracy,
    previous_accuracy: previousAccuracy,
    improvement: previousAccuracy ? accuracy - previousAccuracy : null,
    label: `Challenge ${challengeId} - ${accuracy}%`
  });
};

export const trackPromptEntered = (challengeId, prompt, wordCount) => {
  trackEvent('Prompt Entered', {
    category: 'User Action',
    challenge_id: challengeId,
    prompt_length: prompt.length,
    word_count: wordCount,
    label: `Challenge ${challengeId}`
  });
};

export const trackLevelChanged = (fromLevel, toLevel) => {
  trackEvent('Level Changed', {
    category: 'Navigation',
    from_level: fromLevel,
    to_level: toLevel,
    label: `Level ${fromLevel} → ${toLevel}`
  });
};

export const trackResetAction = (challengeId, currentAccuracy) => {
  trackEvent('Challenge Reset', {
    category: 'User Action',
    challenge_id: challengeId,
    accuracy_before_reset: currentAccuracy,
    label: `Challenge ${challengeId}`
  });
};

export const trackFeedbackFormSubmitted = (rating, feedback, challengesCompleted) => {
  trackEvent('Feedback Form Submitted', {
    category: 'User Feedback',
    rating: rating,
    feedback_length: feedback ? feedback.length : 0,
    challenges_completed: challengesCompleted,
    label: `Rating: ${rating}/5`
  });
};

export const trackAudioToggle = (isEnabled) => {
  trackEvent('Audio Toggled', {
    category: 'Settings',
    audio_enabled: isEnabled,
    label: isEnabled ? 'Audio On' : 'Audio Off'
  });
};

export const trackApplicationStart = () => {
  trackEvent('Application Started', {
    category: 'Session',
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    screen_resolution: `${screen.width}x${screen.height}`,
    label: 'App Launch'
  });
};

export const trackApplicationEnd = (timeSpent, challengesCompleted) => {
  trackEvent('Application Ended', {
    category: 'Session',
    total_time_spent_seconds: timeSpent,
    challenges_completed: challengesCompleted,
    label: `${challengesCompleted} challenges completed`
  });
};

// Export default object with all functions
const analytics = {
  initialize: initializeAnalytics,
  trackPageView,
  trackEvent,
  trackChallengeStarted,
  trackChallengeCompleted,
  trackImageGenerated,
  trackAccuracyScored,
  trackPromptEntered,
  trackLevelChanged,
  trackResetAction,
  trackFeedbackFormSubmitted,
  trackAudioToggle,
  trackApplicationStart,
  trackApplicationEnd
};

export default analytics;