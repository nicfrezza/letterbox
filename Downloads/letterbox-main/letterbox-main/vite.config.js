import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth']
  },
  publicDir: 'public',
  server: {
    watch: {
      usePolling: true
    },
    hmr: {
      overlay: true
    }
  },
  build: {
    // Add this section
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'favicon.ico') {
            return 'favicon.ico';
          }
          return '[name].[hash][extname]';
        }
      }
    }
  }
})