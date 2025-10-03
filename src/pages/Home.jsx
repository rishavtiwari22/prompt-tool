import React from 'react';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to Prompt Learning Tool
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Master the art of AI image prompts
        </p>
        <div className="space-x-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;