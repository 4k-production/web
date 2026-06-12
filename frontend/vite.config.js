import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],

  // ─── CRITICAL for Electron ───────────────────
  // Changes /assets/... → ./assets/... (relative paths)
  // Absolute paths break on file:// protocol (blank screen)
  base: './',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target:       'http://localhost:5000',
        changeOrigin: true,
        secure:       false
      },
      '/uploads': {
        target:       'http://localhost:5000',
        changeOrigin: true,
        secure:       false
      },
      '/health': {
        target:       'http://localhost:5000',
        changeOrigin: true
      }
    }
  },

  build: {
    outDir:    'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          axios:  ['axios']
        }
      }
    }
  }
})