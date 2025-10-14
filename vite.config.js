import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: 'public',
  assetsInclude: ['**/*.mp3', '**/*.wav', '**/*.ogg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg'],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep audio files in their own directory
          if (assetInfo.name && assetInfo.name.endsWith('.mp3')) {
            return 'audio/[name].[ext]';
          }
          // Keep images organized
          if (assetInfo.name && (assetInfo.name.endsWith('.png') || assetInfo.name.endsWith('.jpg') || assetInfo.name.endsWith('.jpeg'))) {
            return 'images/[name].[hash].[ext]';
          }
          // Keep SVGs as-is for better caching
          if (assetInfo.name && assetInfo.name.endsWith('.svg')) {
            return 'icons/[name].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        }
      }
    }
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
});
