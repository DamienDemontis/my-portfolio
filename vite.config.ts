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
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    minify: 'esbuild', // Use esbuild for faster minification
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          i18n: ['react-i18next', 'i18next'],
          icons: ['lucide-react'],
          utils: ['react-intersection-observer']
        },
        // Add file name hashing for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000,
    // Enable better compression
    target: 'esnext',
    cssCodeSplit: true
  }
});