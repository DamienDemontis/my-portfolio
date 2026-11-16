import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Le site original est servi depuis S3/CloudFront avec une page prerendue par
// route. En dev, Vite sert index.html pour toutes les routes : le routeur
// react-router prend le relais.
export default defineConfig({
  plugins: [react()],
  server: { port: 5180 },
  build: { target: 'es2020' },
})
