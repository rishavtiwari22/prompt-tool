import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Navbar";
import Home from "./pages/Home";
import LandingPage from "./components/LandingPage";

function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [completedLevels, setCompletedLevels] = useState([]);

  const handleLevelChange = (level) => {
    if (!unlockedLevels.includes(level)) return;
    setCurrentLevel(level);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const setLevelUnlocked = (level) => {
    setUnlockedLevels((prev) => {
      if (prev.includes(level)) return prev;
      const updated = [...prev, level].sort((a, b) => a - b);
      setCurrentLevel(level);
      return updated;
    });
  };

  const setLevelCompleted = (level) => {
    setCompletedLevels((prev) => {
      if (prev.includes(level)) return prev;
      return [...prev, level].sort((a, b) => a - b);
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
