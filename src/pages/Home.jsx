import React from "react";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-6" style={{ backgroundColor: 'var(--color-primary-light)' }}>
        <h4>Welcome to Image Prompt Trainer</h4>
        <div className="subtitle-1">Start learning!</div>
      </div>
    </div>
  );
}

export default Home;

