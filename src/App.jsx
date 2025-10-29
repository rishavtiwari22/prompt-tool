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
import {
  loadProgressFromLocalStorage,
  saveCurrentLevel,
  saveUnlockedLevels,
  saveCompletedLevels,
} from "./utils/progressManager";
import audioManager from "./utils/audioManager";

// Smart Landing Page component that redirects if user has progress
function SmartLandingPage({ onStartGame, hasProgress }) {
  // If user has progress (completed levels), redirect to game
  if (hasProgress) {
    return <Navigate to="/game" replace />;
  }

  return <LandingPage onStartGame={onStartGame} />;
}

// Game Layout component
function GameLayout({
  children,
  currentLevel,
  onLevelChange,
  unlockedLevels,
  completedLevels,
}) {
  return (
    <>
      <Header
        currentLevel={currentLevel}
        onLevelChange={onLevelChange}
        unlockedLevels={unlockedLevels}
        completedLevels={completedLevels}
      />
      {/* PaperCSS-style thick horizontal divider matching Figma */}
      <hr
        className="border-primary"
        style={{
          margin: 0,
          border: "none",
          borderTop: "1px solid #000000",
          opacity: 0.25,
          height: 0,
        }}
      />
      {children}
    </>
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

  // Initialize audio manager when app loads
  useEffect(() => {
    console.log("🎵 App loaded - ensuring background music starts");
    
    // Try to start background music immediately on app load
    const tryStartMusic = async () => {
      try {
        await audioManager.startBackgroundMusic();
      } catch (error) {
        console.log("🎵 Initial music start failed, will retry on interaction:", error);
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
      document.removeEventListener('click', startMusicOnFirstInteraction);
      document.removeEventListener('keydown', startMusicOnFirstInteraction);
      document.removeEventListener('touchstart', startMusicOnFirstInteraction);
    };
    
    // Add event listeners for user interaction
    document.addEventListener('click', startMusicOnFirstInteraction, { once: true });
    document.addEventListener('keydown', startMusicOnFirstInteraction, { once: true });
    document.addEventListener('touchstart', startMusicOnFirstInteraction, { once: true });
    
    // Cleanup function
    return () => {
      document.removeEventListener('click', startMusicOnFirstInteraction);
      document.removeEventListener('keydown', startMusicOnFirstInteraction);
      document.removeEventListener('touchstart', startMusicOnFirstInteraction);
    };
  }, []);

  // Check if user has progress (has completed at least one level or is beyond level 1)
  const hasProgress =
    completedLevels.length > 0 || currentLevel > 1 || unlockedLevels.length > 1;

  const handleLevelChange = (level) => {
    if (!unlockedLevels.includes(level)) return;
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
      return updated;
    });
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

        {/* Game Route - Always accessible */}
        <Route
          path="/game"
          element={
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
              />
            </GameLayout>
          }
        />

        {/* Fallback route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
