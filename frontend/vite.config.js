import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Electron detection at build time
// When building for Electron, pass VITE_ELECTRON=true
const isElectron = process.env.VITE_ELECTRON === 'true'

export default defineConfig({
  plugins: [vue()],

  // Use './' (relative) for Electron builds so assets load on file://
  // Use '/' (absolute) for web/Vercel builds so assets load on /admin/login correctly
  base: isElectron ? './' : '/',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target:       'https://fourk-production.onrender.com',
        changeOrigin: true,
        secure:       false
      },
      '/uploads': {
        target:       'https://fourk-production.onrender.com',
        changeOrigin: true,
        secure:       false
      },
      '/health': {
        target:       'https://fourk-production.onrender.com',
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
