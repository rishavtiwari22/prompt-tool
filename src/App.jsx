import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Navbar";
import Home from "./pages/Home";
import LandingPage from "./components/LandingPage";
import { 
  loadProgressFromLocalStorage, 
  saveCurrentLevel, 
  saveUnlockedLevels, 
  saveCompletedLevels 
} from "./utils/progressManager";

function App() {
  // Load initial state from localStorage or use defaults
  const initialProgress = loadProgressFromLocalStorage();
  
  const [currentLevel, setCurrentLevel] = useState(initialProgress.currentLevel);
  const [gameStarted, setGameStarted] = useState(false);
  const [unlockedLevels, setUnlockedLevels] = useState(initialProgress.unlockedLevels);
  const [completedLevels, setCompletedLevels] = useState(initialProgress.completedLevels);

  const handleLevelChange = (level) => {
    if (!unlockedLevels.includes(level)) return;
    setCurrentLevel(level);
    // Save current level to localStorage
    saveCurrentLevel(level);
  };

  const handleStartGame = () => {
    setGameStarted(true);
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
      {!gameStarted ? (
        <LandingPage onStartGame={handleStartGame} />
      ) : (
        <>
          <Header
            currentLevel={currentLevel}
            onLevelChange={handleLevelChange}
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
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  currentLevel={currentLevel}
                  onLevelChange={handleLevelChange}
                  unlockedLevels={unlockedLevels}
                  setLevelUnlocked={setLevelUnlocked}
                  completedLevels={completedLevels}
                  setLevelCompleted={setLevelCompleted}
                />
              }
            />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
