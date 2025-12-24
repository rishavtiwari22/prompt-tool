/**
 * Image Comparison Logic using SiliconFlow API
 * Compares two images and provides feedback in Hinglish for children
 */

const SILICONFLOW_API_URL = 'https://api.siliconflow.com/v1/chat/completions';
const SILICONFLOW_MODEL = 'Qwen/Qwen3-VL-8B-Instruct';

/**
 * Resize and convert image to base64
 * Ensures max dimension of 1024px and uses JPEG compression
 */
async function resizeAndCompressImage(imagePath) {
  try {
    let source = imagePath;
    let cleanupUrl = null;

    // If it's a remote URL, fetch it first to create a local blob
    // This avoids CORS issues when drawing to canvas if the server doesn't send headers
    // but allows fetching (which standard fetch sometimes does better, or we catch the error early)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) {
      const response = await fetch(imagePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      source = URL.createObjectURL(blob);
      cleanupUrl = source;
    }

    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 1024; // Target max dimension

        // Calculate new dimensions
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Draw and resize
        ctx.fillStyle = '#FFFFFF'; // Fill background white for transparent PNGs
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with JPEG compression
        // 0.7 quality provides good balance of size vs quality for VLM
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        const base64Match = dataUrl.match(/base64,(.+)/);
        
        // Cleanup
        if (cleanupUrl) URL.revokeObjectURL(cleanupUrl);

        if (base64Match) {
          resolve(base64Match[1]);
        } else {
          reject(new Error('Failed to extract base64 data'));
        }
      };

      img.onerror = () => {
        if (cleanupUrl) URL.revokeObjectURL(cleanupUrl);
        reject(new Error(`Failed to load image for processing: ${imagePath}`));
      };

      img.src = source;
    });

  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
}

/**
 * Build prompt template for comparison
 */
function buildComparisonPrompt(originalPrompt) {
  const promptSection = originalPrompt ? `✏️ SECOND: Generated (prompt: "${originalPrompt}")` : '✏️ SECOND: Generated image';
  
  return `Compare these two images:
🎯 FIRST: Target image (jo banana hai)
${promptSection}

Note: Use simple, playful Hinglish (Hindi + English) suitable for a 5-8 year old child.
Note: Keep all suggestions simple and actionable, giving short English prompt examples where needed.

Format EXACTLY as:
SIMILARITY SCORE: [number]%
VISUAL DIFFERENCES: [max 70 simple words brief analysis in Hinglish for 5-8 year boy]
PROMPT IMPROVEMENTS: [max 70 simple words - target image jaisa image banane ke liye prompt me kya add/change karein, specific suggestions with English prompt examples in Hinglish for 5-8 year boy]`;
}

/**
 * Parse AI response to extract structured data
 */
function parseComparisonResponse(responseText) {
  const result = {
    similarityScore: null,
    keyDifferences: '',
    promptImprovements: '',
    fullResponse: responseText
  };

  try {
    // Extract similarity score
    const scoreMatch = responseText.match(/SIMILARITY\s+SCORE:\s*(\d+)%/i);
    if (scoreMatch) {
      result.similarityScore = parseInt(scoreMatch[1], 10);
    }

    // Extract visual differences
    const diffMatch = responseText.match(/VISUAL\s+DIFFERENCES:\s*(.+?)(?=PROMPT\s+IMPROVEMENTS:|$)/is);
    if (diffMatch) {
      result.keyDifferences = diffMatch[1].trim();
    }

    // Extract prompt improvements
    const improvMatch = responseText.match(/PROMPT\s+IMPROVEMENTS:\s*(.+?)$/is);
    if (improvMatch) {
      result.promptImprovements = improvMatch[1].trim();
    }

    return result;
  } catch (error) {
    console.error('Error parsing response:', error);
    return result;
  }
}

/**
 * Main function: Compare two images using SiliconFlow API
 * @param {string} targetImagePath - Target image (path, URL, or data URL)
 * @param {string} generatedImagePath - Generated image (path, URL, or data URL)
 * @param {string} originalPrompt - User's original prompt (optional)
 * @param {string} apiKey - SiliconFlow API key
 * @returns {Promise<Object>} Comparison result with score, differences, and improvements
 */
export async function compareImagesWithSiliconFlow(targetImagePath, generatedImagePath, originalPrompt = '', apiKey) {
  try {
    // Validate API key
    if (!apiKey) {
      throw new Error('SiliconFlow API key not found. Please set VITE_SILICONFLOW_API_KEY in your .env file.');
    }

    console.log('🔍 Starting image comparison...');
    const startTime = Date.now();

    // Resize and process images to ensure payload isn't too large
    // This helps avoid 524 timeouts
    const [targetBase64, generatedBase64] = await Promise.all([
      resizeAndCompressImage(targetImagePath),
      resizeAndCompressImage(generatedImagePath)
    ]);

    console.log(`✅ Images processed in ${Date.now() - startTime}ms`);

    // Build request payload
    const requestPayload = {
      model: SILICONFLOW_MODEL,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: buildComparisonPrompt(originalPrompt)
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${targetBase64}`
            }
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${generatedBase64}`
            }
          }
        ]
      }],
      max_tokens: 800,
      temperature: 0,
      stream: false
    };

    console.log('📤 Sending request to SiliconFlow API...');

    // Call SiliconFlow API
    const response = await fetch(SILICONFLOW_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      // Handle cloudflare timeout specifically
      if (response.status === 524) {
        throw new Error('Image comparison timed out (524). Server was too slow. Please try again.');
      }
      
      const errorData = await response.text();
      // Try to parse JSON error if possible
      try {
        const jsonError = JSON.parse(errorData);
        if (jsonError.message) {
          throw new Error(`SiliconFlow API Error: ${jsonError.message}`);
        }
      } catch (e) {
        // Use raw text if not json
      }
      
      throw new Error(`SiliconFlow API error: ${response.status} - ${errorData.substring(0, 100)}`);
    }

    const data = await response.json();
    console.log('✅ Received response from SiliconFlow');

    // Extract and parse response
    const aiResponse = data?.choices?.[0]?.message?.content || '';
    
    if (!aiResponse) {
      throw new Error('No content in API response');
    }

    const parsed = parseComparisonResponse(aiResponse);

    // Return complete result
    return {
      success: true,
      similarityScore: parsed.similarityScore,
      fullResponse: parsed.fullResponse,
      keyDifferences: parsed.keyDifferences,
      promptImprovements: parsed.promptImprovements,
      metadata: {
        model: SILICONFLOW_MODEL,
        provider: 'SiliconFlow',
        timestamp: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('❌ Image comparison error:', error);
    return {
      success: false,
      error: error.message,
      similarityScore: null,
      fullResponse: '',
      keyDifferences: '',
      promptImprovements: ''
    };
  }
}

/**
 * Simplified function: Returns only similarity score
 */
export async function compareImagesSimple(targetImagePath, generatedImagePath, originalPrompt = '', apiKey) {
  const result = await compareImagesWithSiliconFlow(targetImagePath, generatedImagePath, originalPrompt, apiKey);
  return result.similarityScore || 0;
}

/**
 * Function with structured feedback for UI
 */
export async function compareImagesWithFeedback(targetImagePath, generatedImagePath, originalPrompt = '', apiKey) {
  const result = await compareImagesWithSiliconFlow(targetImagePath, generatedImagePath, originalPrompt, apiKey);
  
  if (!result.success) {
    return {
      score: 0,
      feedback: result.error ? `Error: ${result.error}` : 'Comparison failed',
      improvements: '',
      fullResponse: '',
      error: result.error
    };
  }

  return {
    score: result.similarityScore || 0,
    feedback: result.keyDifferences,
    improvements: result.promptImprovements,
    fullResponse: result.fullResponse
  };
}

/**
 * Get quality information based on similarity percentage
 */
export function getQualityInfo(percentage) {
  if (percentage >= 85) {
    return { text: 'Excellent Match!', color: '#22c55e', emoji: '🎯' };
  } else if (percentage >= 70) {
    return { text: 'Very Good Match', color: '#65a30d', emoji: '👍' };
  } else if (percentage >= 55) {
    return { text: 'Good Match', color: '#84cc16', emoji: '👌' };
  } else if (percentage >= 40) {
    return { text: 'Fair Match', color: '#ca8a04', emoji: '🤔' };
  } else if (percentage >= 25) {
    return { text: 'Poor Match', color: '#ea580c', emoji: '😐' };
  } else {
    return { text: 'Very Poor Match', color: '#dc2626', emoji: '😟' };
  }
}
