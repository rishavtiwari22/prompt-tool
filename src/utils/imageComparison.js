/**
 * SiliconFlow Image Comparison Utility using Qwen3-VL-8B-Instruct
 * 
 * SETUP: Set VITE_SILICONFLOW_API_KEY in .env file
 * Get key from: https://account.siliconflow.com/
 * Cost: Only $0.05 per million tokens
 */

const initSiliconFlow = () => {
  const apiKey = import.meta.env.VITE_SILICONFLOW_API_KEY;
  if (!apiKey) {
    throw new Error("SiliconFlow API key not found. Please set VITE_SILICONFLOW_API_KEY in .env file.");
  }
  return apiKey;
};

const imageToBase64 = async (imagePath) => {
  try {
    // Check if already a data URL (data:image/...)
    if (imagePath.startsWith('data:')) {
      // Extract base64 part from data URL
      const base64Match = imagePath.match(/^data:image\/[^;]+;base64,(.+)$/);
      if (base64Match) {
        return base64Match[1];
      }
      throw new Error('Invalid data URL format');
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
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
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
    console.log("🚀 Starting SiliconFlow image comparison...");
    console.log("📸 Target image:", targetImagePath?.substring(0, 100));
    console.log("📸 Generated image:", generatedImagePath?.substring(0, 100));

    const apiKey = initSiliconFlow();

    console.log("🔄 Converting images to base64...");
    const [targetBase64, generatedBase64] = await Promise.all([
      imageToBase64(targetImagePath),
      imageToBase64(generatedImagePath),
    ]);

    console.log("✅ Images converted successfully");

    const promptText = originalPrompt
      ? `Compare these two images:
🎯 FIRST: Target image
✏️ SECOND: Generated (prompt: "${originalPrompt}")

Note: Use simple, playful **Hinglish** (Hindi + English) suitable for a 5-8 year old child.
Note: Keep all suggestions simple and actionable, giving short English prompt examples where needed.

📝 Example (for understanding only, don’t copy):
VISUAL DIFFERENCES: Dekho! Target image mein ek bada lal apple hai. Lekin generated image mein do apple hain — ek orange aur ek lal! Background bhi safed nahi, hara hai.
PROMPT IMPROVEMENTS: Agar sirf ek lal apple chahiye, toh likho "one red apple on white background". Agar leaves nahi chahiye, toh likho "no leaves".

Format EXACTLY as:
SIMILARITY SCORE: [number]%
VISUAL DIFFERENCES: [max 70 simple words brief analysis in Hinglish for 5-8 year boy]
PROMPT IMPROVEMENTS: [max 70 simple words concise suggestions in Hinglish for 5-8 year boy]`
      : `Compare these images:
Note: Use simple, playful **Hinglish** (Hindi + English) suitable for a 5-8 year old child.
Note: Keep all suggestions simple and actionable, giving short English prompt examples where needed.


📝 Example (for understanding only, don’t copy):
VISUAL DIFFERENCES: Dekho! Target image mein ek bada lal apple hai. Lekin generated image mein do apple hain — ek orange aur ek lal! Background bhi safed nahi, hara hai.
PROMPT IMPROVEMENTS: Agar sirf ek lal apple chahiye, toh likho "one red apple on white background". Agar leaves nahi chahiye, toh likho "no leaves".

SIMILARITY SCORE: [number]%
VISUAL DIFFERENCES: [max 70 simple words brief analysis in Hinglish for 5-8 year boy]
OBSERVATIONS: [max 70 simple words concise insights in Hinglish for 5-8 year boy]`;

    const payload = {
      model: "Qwen/Qwen3-VL-8B-Instruct",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: promptText },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${targetBase64}` } },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${generatedBase64}` } }
        ]
      }],
      max_tokens: 800,
      temperature: 0.2,
      stream: false
    };

    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SiliconFlow API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    console.log("✅ Analysis complete!");

    const scoreMatch = text.match(/SIMILARITY SCORE:\s*(\d+)%?/i);
    const similarityScore = scoreMatch ? parseInt(scoreMatch[1]) : null;

    const differencesMatch = text.match(/VISUAL DIFFERENCES:\s*(.+?)(?=PROMPT IMPROVEMENTS:|OBSERVATIONS:|$)/is);
    const differences = differencesMatch ? differencesMatch[1].trim() : "";

    const improvementsMatch = text.match(/PROMPT IMPROVEMENTS:\s*(.+?)$/is);
    const observations = text.match(/OBSERVATIONS:\s*(.+?)$/is);
    const improvements = improvementsMatch ? improvementsMatch[1].trim() : observations ? observations[1].trim() : "";

    return {
      success: true,
      similarityScore,
      fullResponse: text,
      keyDifferences: differences,
      promptImprovements: improvements,
      metadata: {
        model: "Qwen/Qwen3-VL-8B-Instruct",
        provider: "SiliconFlow",
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("❌ SiliconFlow comparison failed:", error.message);
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
    console.error("SiliconFlow simple comparison failed:", error);
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
    console.error("SiliconFlow feedback comparison failed:", error);
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
  return { text: "Very Poor Match", color: "#dc2626", emoji: "��" };
};

// Export for convenience
export default {
  compareImagesWithSiliconFlow,
  compareImagesSimple,
  compareImagesWithFeedback,
  compareImages,
  getQualityInfo,
};