// Simple Image Comparison Utility

// Load SSIM library with fallback
let ssimLib = null;
const loadSSIM = async () => {
  if (ssimLib) return ssimLib;
  try {
    const ssimModule = await import("ssim.js");
    ssimLib = ssimModule.ssim || ssimModule.default;
    return ssimLib;
  } catch (error) {
    console.warn("SSIM library not available, using fallback method");
    return null;
  }
};

// Convert image to canvas ImageData
const toImageData = (img, size = 256) => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, 0, 0, size, size);
  
  return ctx.getImageData(0, 0, size, size);
};

// Load image from URL or file
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
};

// Simple pixel comparison fallback
const pixelComparison = (imageData1, imageData2) => {
  const data1 = imageData1.data;
  const data2 = imageData2.data;
  let totalDiff = 0;
  
  for (let i = 0; i < data1.length; i += 4) {
    const r1 = data1[i], g1 = data1[i + 1], b1 = data1[i + 2];
    const r2 = data2[i], g2 = data2[i + 1], b2 = data2[i + 2];
    
    const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
    totalDiff += diff;
  }
  
  const maxDiff = data1.length * 3 * 255 / 4; // Max possible difference
  return Math.max(0, Math.min(100, ((1 - totalDiff / maxDiff) * 100)));
};

/**
 * Compare two images and return similarity percentage
 * @param {string} imageA - First image URL
 * @param {string} imageB - Second image URL
 * @returns {Promise<number>} Similarity percentage (0-100)
 */
export const compareImages = async (imageA, imageB) => {
  try {
    // Load both images
    const [imgA, imgB] = await Promise.all([
      loadImage(imageA),
      loadImage(imageB)
    ]);
    
    // Convert to ImageData with standard size
    const imageDataA = toImageData(imgA);
    const imageDataB = toImageData(imgB);
    
    // Try SSIM first, fallback to pixel comparison
    const ssim = await loadSSIM();
    if (ssim) {
      try {
        const result = ssim(imageDataA, imageDataB);
        const score = typeof result === 'number' ? result : (result.mssim || result.ssim || 0);
        return Math.round(Math.max(0, Math.min(1, score)) * 100);
      } catch (ssimError) {
        console.warn('SSIM failed, using pixel comparison');
      }
    }
    
    // Fallback to simple pixel comparison
    return Math.round(pixelComparison(imageDataA, imageDataB));
    
  } catch (error) {
    console.error('Image comparison failed:', error);
    return 0;
  }
};

/**
 * Get quality description for similarity percentage
 * @param {number} percentage - Similarity percentage (0-100)
 * @returns {Object} Quality info with text, color, and emoji
 */
export const getQualityInfo = (percentage) => {
  if (percentage >= 85) return { text: "Excellent Match!", color: "#22c55e", emoji: "🎯" };
  if (percentage >= 70) return { text: "Very Good Match", color: "#65a30d", emoji: "👍" };
  if (percentage >= 55) return { text: "Good Match", color: "#84cc16", emoji: "👌" };
  if (percentage >= 40) return { text: "Fair Match", color: "#ca8a04", emoji: "🤔" };
  if (percentage >= 25) return { text: "Poor Match", color: "#ea580c", emoji: "😐" };
  return { text: "Very Poor Match", color: "#dc2626", emoji: "😞" };
};
