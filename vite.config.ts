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
        manualChunks: (id) => {
          // Vendor chunk for React and related core libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor'
            }
            if (id.includes('framer-motion')) {
              return 'animations'
            }
            if (id.includes('three') || id.includes('@react-three/')) {
              return 'three'
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n'
            }
            if (id.includes('lucide-react')) {
              return 'icons'
            }
            if (id.includes('gsap')) {
              return 'gsap'
            }
            if (id.includes('react-intersection-observer')) {
              return 'utils'
            }
            // Split other node_modules into smaller chunks
            const chunks = id.split('node_modules/')[1].split('/')[0]
            return `vendor-${chunks}`
          }
        },
        // Add file name hashing for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 600, // Reduced for better splitting
    // Enable better compression and tree shaking
    target: 'esnext',
    cssCodeSplit: true,
    // Enable CSS minification
    cssMinify: true,
    // Optimize dependencies
    assetsInlineLimit: 2048 // Inline smaller assets
  }
});