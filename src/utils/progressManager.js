// progressManager.js - Utility for managing level progress in localStorage

const STORAGE_KEYS = {
  COMPLETED_LEVELS: "prompt-learning-tool-completedLevels",
  CURRENT_LEVEL: "prompt-learning-tool-currentLevel",
  UNLOCKED_LEVELS: "prompt-learning-tool-unlockedLevels",
};

/**
 * Load progress from localStorage
 * @returns {Object} Progress object with currentLevel, completedLevels, unlockedLevels
 */
export const loadProgressFromLocalStorage = () => {
  try {
    const completedLevels =
      JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_LEVELS)) || [];
    const currentLevel =
      parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_LEVEL)) || 1;
    const unlockedLevels = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVELS)
    ) || [1];

    return {
      currentLevel,
      completedLevels,
      unlockedLevels,
    };
  } catch (error) {
    console.error("Error loading progress from localStorage:", error);
    // Return default values if there's an error
    return {
      currentLevel: 1,
      completedLevels: [],
      unlockedLevels: [1],
    };
  }
};

/**
 * Save current level to localStorage
 * @param {number} level - Current level number
 */
export const saveCurrentLevel = (level) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_LEVEL, level.toString());
  } catch (error) {
    console.error("Error saving current level to localStorage:", error);
  }
};

/**
 * Save completed levels to localStorage
 * @param {Array} completedLevels - Array of completed level numbers
 */
export const saveCompletedLevels = (completedLevels) => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.COMPLETED_LEVELS,
      JSON.stringify(completedLevels)
    );
  } catch (error) {
    console.error("Error saving completed levels to localStorage:", error);
  }
};

/**
 * Save unlocked levels to localStorage
 * @param {Array} unlockedLevels - Array of unlocked level numbers
 */
export const saveUnlockedLevels = (unlockedLevels) => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.UNLOCKED_LEVELS,
      JSON.stringify(unlockedLevels)
    );
  } catch (error) {
    console.error("Error saving unlocked levels to localStorage:", error);
  }
};

/**
 * Mark a level as completed and save to localStorage
 * @param {number} level - Level number to mark as completed
 * @param {Array} currentCompletedLevels - Current array of completed levels
 * @returns {Array} Updated completed levels array
 */
export const markLevelAsCompleted = (level, currentCompletedLevels) => {
  const updatedCompletedLevels = [...currentCompletedLevels];
  if (!updatedCompletedLevels.includes(level)) {
    updatedCompletedLevels.push(level);
    saveCompletedLevels(updatedCompletedLevels);
  }
  return updatedCompletedLevels;
};

/**
 * Unlock a new level and save to localStorage
 * @param {number} level - Level number to unlock
 * @param {Array} currentUnlockedLevels - Current array of unlocked levels
 * @returns {Array} Updated unlocked levels array
 */
export const unlockLevel = (level, currentUnlockedLevels) => {
  const updatedUnlockedLevels = [...currentUnlockedLevels];
  if (!updatedUnlockedLevels.includes(level)) {
    updatedUnlockedLevels.push(level);
    updatedUnlockedLevels.sort((a, b) => a - b); // Keep levels sorted
    saveUnlockedLevels(updatedUnlockedLevels);
  }
  return updatedUnlockedLevels;
};

/**
 * Clear all progress from localStorage (for debugging/reset purposes)
 */
export const clearProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_LEVELS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_LEVEL);
    localStorage.removeItem(STORAGE_KEYS.UNLOCKED_LEVELS);
    console.log("Progress cleared from localStorage");
  } catch (error) {
    console.error("Error clearing progress from localStorage:", error);
  }
};
