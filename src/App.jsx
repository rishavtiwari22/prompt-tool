


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Navbar';
import Home from './pages/Home';



function App() {
  return (
    <Router>
      <Header />
      {/* Full-bleed horizontal divider under header */}
      <div className="divider-horizontal" aria-hidden="true" style={{ margin: '0.5rem 0 1rem 0' }}></div>
      <Routes>
        <Route path="/" element={<Home />} />
       
      </Routes>
    </Router>
  );
}

export default App;
