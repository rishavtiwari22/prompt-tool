import React, { useState } from "react";
import { X, Eye, EyeOff, Sparkles } from "lucide-react";

const VerificationModal = ({ isOpen, onClose, onVerify }) => {
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name.trim()) {
      setError("Please enter your name");
      setLoading(false);
      return;
    }

    if (passcode.length !== 6 || !/^\d+$/.test(passcode)) {
      setError("Please enter a valid 6-digit passcode");
      setLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual verification logic
      const isValid = passcode === "123456"; // Temporary validation
      
      if (isValid) {
        await onVerify({ name, passcode });
      } else {
        setError("Invalid passcode. Please try again.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="relative w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-md animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 hover:rotate-90 transition-transform duration-300"
        >
          <X size={24} />
        </button>

        <div className="mb-6 text-center">
          <div className="mb-2 inline-block rounded-full bg-purple-100 p-3 animate-bounce">
            <Sparkles className="h-6 w-6 text-purple-600 animate-pulse" />
          </div>
          <h2 className="mb-2 text-2xl font-bold animate-fadeIn">Unlock Your Magic Pass</h2>
          <p className="text-gray-600 animate-fadeIn animation-delay-200">
            Enter your name and the magic passcode to begin your journey
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 hover:border-purple-400"
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label htmlFor="passcode" className="mb-2 block text-sm font-medium text-gray-700">
              Magic Passcode
            </label>
            <div className="relative">
              <input
                type={showPasscode ? "text" : "password"}
                id="passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-300 hover:border-purple-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transform focus:scale-[1.02]"
              placeholder="Enter 6-digit passcode"
              maxLength={6}
              pattern="[0-9]*"
              inputMode="numeric"
              required
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasscode ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 animate-wiggle">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 px-4 py-2 text-white transition-all duration-300 transform hover:scale-[1.02] hover:bg-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:bg-purple-300 disabled:transform-none disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span className="ml-2">Verifying...</span>
              </div>
            ) : (
              "Unlock Access"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerificationModal;
