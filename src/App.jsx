import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Header />
      {/* PaperCSS-style thick horizontal divider matching Figma */}
      <hr 
        className="border-primary" 
        style={{ 
          margin: 0,
          border: 'none',
          borderTop: '1px solid #000000',
          opacity: 0.25,
          height: 0
        }} 
      />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;