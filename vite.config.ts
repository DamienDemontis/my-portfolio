import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(), 
    visualizer({ 
      filename: 'stats.html', 
      template: 'treemap', 
      gzipSize: true, 
      brotliSize: true,
      open: false // Don't auto-open in browser
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          i18n: ['react-i18next', 'i18next'],
          icons: ['lucide-react'],
          utils: ['react-intersection-observer']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});