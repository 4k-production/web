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
        target:       'https://4k-production.onrender.com',
        changeOrigin: true,
        secure:       false
      },
      '/uploads': {
        target:       'https://4k-production.onrender.com',
        changeOrigin: true,
        secure:       false
      },
      '/health': {
        target:       'https://4k-production.onrender.com',
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