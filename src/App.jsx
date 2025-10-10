import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Navbar';
import Home from './pages/Home';

function App() {
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleLevelChange = (level) => {
    setCurrentLevel(level);
  };

  return (
    <Router>
      <Header currentLevel={currentLevel} onLevelChange={handleLevelChange} />
      {/* PaperCSS-style thick horizontal divider matching Figma */}
      <hr 
        className="border-primary" 
        style={{ 
          margin: 0,
          border: 'none',
          borderTop: '2px solid #000000',
          opacity: 0.25,
          height: 0
        }} 
      />
      <Routes>
        <Route path="/" element={<Home currentLevel={currentLevel} onLevelChange={handleLevelChange} />} />
      </Routes>
    </Router>
  );
}

export default App;