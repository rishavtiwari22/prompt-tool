/**
 * Image Comparison Utility using Cloudflare Workers API
 * 
 * API Endpoint: https://prompt-learning-server.prompt-tool.workers.dev/api/compare-images
 * No API key required - serverless backend handles authentication
 */

const imageToDataURL = async (imagePath) => {
  try {
    // Check if already a data URL (data:image/...)
    if (imagePath.startsWith('data:')) {
      // Already in correct format
      return imagePath;
    }

    // Handle local Vite paths (/src/assets/...)
    // Convert to proper URL for Vite dev server
    let imageUrl = imagePath;
    if (imagePath.startsWith('/src/')) {
      // In Vite, /src/ paths need to be accessed via base URL
      imageUrl = new URL(imagePath, window.location.origin).href;
    } else if (imagePath.startsWith('src/')) {
      // Handle paths without leading slash
      imageUrl = new URL('/' + imagePath, window.location.origin).href;
    } else if (imagePath.startsWith('/')) {
      // Handle other absolute paths
      imageUrl = new URL(imagePath, window.location.origin).href;
    }

    // Handle http/https URLs or blob URLs or converted local URLs
    if (imageUrl.startsWith('http://') ||
      imageUrl.startsWith('https://') ||
      imageUrl.startsWith('blob:')) {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText} from ${imageUrl}`);
      }
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    throw new Error(`Unsupported image format: ${imagePath.substring(0, 50)}...`);
  } catch (error) {
    throw new Error(`Failed to process image: ${error.message}`);
  }
};

export const compareImagesWithSiliconFlow = async (targetImagePath, generatedImagePath, originalPrompt = "") => {
  try {
    console.log("🚀 Starting image comparison...");
    console.log("📸 Target image:", targetImagePath?.substring(0, 100));
    console.log("📸 Generated image:", generatedImagePath?.substring(0, 100));

    console.log("🔄 Converting images to data URLs...");
    const [targetImage, generatedImage] = await Promise.all([
      imageToDataURL(targetImagePath),
      imageToDataURL(generatedImagePath),
    ]);

    console.log("✅ Images converted successfully");

    const payload = {
      targetImage,
      generatedImage,
      originalPrompt: originalPrompt || ""
    };

    const response = await fetch('https://prompt-learning-server.prompt-tool.workers.dev/api/compare-images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    console.log("✅ Analysis complete!");

    // Parse the response from the API
    const text = data.analysis || data.fullResponse || "";
    
    const scoreMatch = text.match(/SIMILARITY SCORE:\s*(\d+)%?/i);
    const similarityScore = scoreMatch ? parseInt(scoreMatch[1]) : (data.similarityScore || null);

    const differencesMatch = text.match(/VISUAL DIFFERENCES:\s*(.+?)(?=PROMPT IMPROVEMENTS:|OBSERVATIONS:|$)/is);
    const differences = differencesMatch ? differencesMatch[1].trim() : (data.keyDifferences || "");

    const improvementsMatch = text.match(/PROMPT IMPROVEMENTS:\s*(.+?)$/is);
    const observations = text.match(/OBSERVATIONS:\s*(.+?)$/is);
    const improvements = improvementsMatch ? improvementsMatch[1].trim() : observations ? observations[1].trim() : (data.promptImprovements || "");

    return {
      success: true,
      similarityScore,
      fullResponse: text,
      keyDifferences: differences,
      promptImprovements: improvements,
      metadata: {
        provider: "Cloudflare Workers",
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("❌ Image comparison failed:", error.message);
    return {
      success: false,
      error: error.message,
      similarityScore: null,
      fullResponse: "",
      keyDifferences: "",
      promptImprovements: "",
    };
  }
};

export const compareImagesSimple = async (targetImagePath, generatedImagePath, originalPrompt) => {
  try {
    const result = await compareImagesWithSiliconFlow(targetImagePath, generatedImagePath, originalPrompt);
    return result.success && result.similarityScore !== null ? result.similarityScore : 0;
  } catch (error) {
    console.error("Image comparison failed:", error);
    return 0;
  }
};

// NEW: Full feedback version - returns complete object
export const compareImagesWithFeedback = async (targetImagePath, generatedImagePath, originalPrompt) => {
  try {
    const result = await compareImagesWithSiliconFlow(targetImagePath, generatedImagePath, originalPrompt);
    if (result.success) {
      return {
        score: result.similarityScore || 0,
        feedback: result.keyDifferences || "No feedback available",
        improvements: result.promptImprovements || "",
        fullResponse: result.fullResponse || "",
      };
    }
    return {
      score: 0,
      feedback: "Comparison failed",
      improvements: "",
      fullResponse: "",
      error: result.error
    };
  } catch (error) {
    console.error("Image comparison failed:", error);
    return {
      score: 0,
      feedback: "Error during comparison",
      improvements: "",
      fullResponse: "",
      error: error.message
    };
  }
};

// Backward compatibility - returns only score
export const compareImages = compareImagesSimple;

export const getQualityInfo = (percentage) => {
  if (percentage >= 85) return { text: "Excellent Match!", color: "#22c55e", emoji: "🎯" };
  if (percentage >= 70) return { text: "Very Good Match", color: "#65a30d", emoji: "👍" };
  if (percentage >= 55) return { text: "Good Match", color: "#84cc16", emoji: "👌" };
  if (percentage >= 40) return { text: "Fair Match", color: "#ca8a04", emoji: "🤔" };
  if (percentage >= 25) return { text: "Poor Match", color: "#ea580c", emoji: "😐" };
  return { text: "Very Poor Match", color: "#dc2626", emoji: "😟" };
};

// Export for convenience
export default {
  compareImagesWithSiliconFlow,
  compareImagesSimple,
  compareImagesWithFeedback,
  compareImages,
  getQualityInfo,
};
