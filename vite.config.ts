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
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    minify: 'esbuild', // Use esbuild for faster minification
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Order matters: check specific packages BEFORE broad 'react' match
            // three ecosystem must stay together to avoid circular dependency issues
            if (id.includes('@react-three/') || id.includes('/three/') || id.includes('three-stdlib') || id.includes('@monogrid')) {
              return 'three'
            }
            if (id.includes('framer-motion')) {
              return 'animations'
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n'
            }
            if (id.includes('react-intersection-observer')) {
              return 'utils'
            }
            if (id.includes('lucide-react')) {
              return 'icons'
            }
            if (id.includes('gsap')) {
              return 'gsap'
            }
            if (id.includes('ogl')) {
              return 'ogl'
            }
            if (id.includes('@use-gesture')) {
              return 'gestures'
            }
            if (id.includes('lottie-web')) {
              return 'lottie'
            }
            // React core — now safe since specific react-* packages are already matched
            if (id.includes('react-dom') || id.includes('react/') || id.includes('/react/') || id.includes('scheduler') || id.includes('its-fine')) {
              return 'vendor'
            }
            // Remaining node_modules get their own chunk
            const pkg = id.split('node_modules/')[1]?.split('/')[0]
            if (pkg) return `vendor-${pkg}`
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