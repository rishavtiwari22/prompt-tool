import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Header from "./components/Navbar";
import Home from "./pages/Home";
import LandingPage from "./components/LandingPage";
import StudentFeedbackForm from "./components/StudentFeedbackForm";
import GameComplete from "./pages/GameComplete";
import {
  loadProgressFromLocalStorage,
  saveCurrentLevel,
  saveUnlockedLevels,
  saveCompletedLevels,
} from "./utils/progressManager";
import audioManager from "./utils/audioManager";
import analytics from "./utils/analytics";

// Protected Route component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("prompt_tool_auth");
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Smart Landing Page component that redirects if user is authenticated
function SmartLandingPage({ onStartGame }) {
  const isAuthenticated = localStorage.getItem("prompt_tool_auth");

  // If user is authenticated, redirect to game
  if (isAuthenticated) {
    return <Navigate to="/game" replace />;
  }

  return <LandingPage onStartGame={onStartGame} />;
}

// Game Layout component with sticky header
function GameLayout({
  children,
  currentLevel,
  onLevelChange,
  unlockedLevels,
  completedLevels,
}) {
  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Sticky Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "rgba(255, 255, 255, 1)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
        }}
      >
        <Header
          currentLevel={currentLevel}
          onLevelChange={onLevelChange}
          unlockedLevels={unlockedLevels}
          completedLevels={completedLevels}
        />
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function App() {
  // Load initial state from localStorage or use defaults
  const initialProgress = loadProgressFromLocalStorage();

  const [currentLevel, setCurrentLevel] = useState(
    initialProgress.currentLevel
  );
  const [unlockedLevels, setUnlockedLevels] = useState(
    initialProgress.unlockedLevels
  );
  const [completedLevels, setCompletedLevels] = useState(
    initialProgress.completedLevels
  );

  // Feedback form state
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  // Initialize audio manager when app loads
  useEffect(() => {
    console.log("🎵 App loaded - ensuring background music starts");
    
    // Initialize analytics
    analytics.initialize();
    analytics.trackApplicationStart();
    
    // Try to start background music immediately on app load
    const tryStartMusic = async () => {
      try {
        await audioManager.startBackgroundMusic();
      } catch (error) {
        console.log(
          "🎵 Initial music start failed, will retry on interaction:",
          error
        );
      }
    };

    tryStartMusic();

    // Also add a one-time listener for any user interaction to start music
    const startMusicOnFirstInteraction = async () => {
      try {
        await audioManager.startBackgroundMusic();
        console.log("🎵 Background music started after page interaction");
      } catch (error) {
        console.log("🎵 Music start after interaction failed:", error);
      }
      // Remove listeners after first attempt
      document.removeEventListener("click", startMusicOnFirstInteraction);
      document.removeEventListener("keydown", startMusicOnFirstInteraction);
      document.removeEventListener("touchstart", startMusicOnFirstInteraction);
    };

    // Add event listeners for user interaction
    document.addEventListener("click", startMusicOnFirstInteraction, {
      once: true,
    });
    document.addEventListener("keydown", startMusicOnFirstInteraction, {
      once: true,
    });
    document.addEventListener("touchstart", startMusicOnFirstInteraction, {
      once: true,
    });

    // Cleanup function
    return () => {
      document.removeEventListener("click", startMusicOnFirstInteraction);
      document.removeEventListener("keydown", startMusicOnFirstInteraction);
      document.removeEventListener("touchstart", startMusicOnFirstInteraction);
    };
  }, []);

  // Check if user has progress (has completed at least one level or is beyond level 1)
  const hasProgress =
    completedLevels.length > 0 || currentLevel > 1 || unlockedLevels.length > 1;

  const handleLevelChange = (level) => {
    if (!unlockedLevels.includes(level)) return;
    
    // Track level change
    analytics.trackLevelChanged(currentLevel, level);
    
    setCurrentLevel(level);
    // Save current level to localStorage
    saveCurrentLevel(level);
  };

  const handleStartGame = () => {
    // Navigation will be handled by React Router
    // This function can be removed or used for additional logic if needed
  };

  const setLevelUnlocked = (level) => {
    setUnlockedLevels((prev) => {
      if (prev.includes(level)) return prev;
      const updated = [...prev, level].sort((a, b) => a - b);
      setCurrentLevel(level);
      // Save to localStorage
      saveUnlockedLevels(updated);
      saveCurrentLevel(level);
      return updated;
    });
  };

  const setLevelCompleted = (level) => {
    setCompletedLevels((prev) => {
      if (prev.includes(level)) return prev;
      const updated = [...prev, level].sort((a, b) => a - b);
      
      // Save to localStorage
      saveCompletedLevels(updated);
      
      // Show feedback form after completing 3rd challenge or 5th challenge
      if (updated.length === 3 || updated.length === 5) {
        setTimeout(() => {
          setShowFeedbackForm(true);
        }, 2000); // Show after 2 seconds
      }
      
      return updated;
    });
  };

  // Reset game to Level 1 (for Play Again functionality)
  const resetToLevel1 = async () => {
    // Reset all game state
    setCurrentLevel(1);
    setUnlockedLevels([1]);
    setCompletedLevels([]);
    
    // Save to localStorage
    saveCurrentLevel(1);
    saveUnlockedLevels([1]);
    saveCompletedLevels([]);
    
    // Track analytics
    analytics.trackGameReset();
  };

  return (
    <Router>
      <Routes>
        {/* Landing Page Route - Smart redirect if user has progress */}
        <Route
          path="/"
          element={
            <SmartLandingPage
              onStartGame={handleStartGame}
              hasProgress={hasProgress}
            />
          }
        />

        {/* Game Route - Protected by Authentication */}
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <GameLayout
                currentLevel={currentLevel}
                onLevelChange={handleLevelChange}
                unlockedLevels={unlockedLevels}
                completedLevels={completedLevels}
              >
                <Home
                  currentLevel={currentLevel}
                  onLevelChange={handleLevelChange}
                  unlockedLevels={unlockedLevels}
                  setLevelUnlocked={setLevelUnlocked}
                  completedLevels={completedLevels}
                  setLevelCompleted={setLevelCompleted}
                  resetToLevel1={resetToLevel1}
                />
              </GameLayout>
            </ProtectedRoute>
          }
        />

        {/* Game Complete Route - Shows after finishing all levels */}
        <Route
          path="/game-complete"
          element={
            <GameComplete
              onPlayAgain={resetToLevel1}
              resetToLevel1={resetToLevel1}
            />
          }
        />

        {/* Fallback route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Feedback Form - Global */}
      <StudentFeedbackForm
        isOpen={showFeedbackForm}
        onClose={() => setShowFeedbackForm(false)}
        challengesCompleted={completedLevels.length}
        onSubmit={async (feedbackData) => {
          console.log('Feedback submitted:', feedbackData);
          
          // Track feedback submission
          analytics.trackFeedbackSubmitted(
            completedLevels.length,
            feedbackData.experience || 'Not provided',
            feedbackData.feedback || 'Not provided'
          );
          
          // Here you can send feedback to your backend
          // For now, just log it
        }}
      />
    </Router>
  );
}

export default App;
