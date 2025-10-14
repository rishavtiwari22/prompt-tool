import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  publicDir: 'public',
  assetsInclude: ['**/*.mp3', '**/*.wav', '**/*.ogg'],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep audio files in their own directory
          if (assetInfo.name && assetInfo.name.endsWith('.mp3')) {
            return 'audio/[name].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        }
      }
    }
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})