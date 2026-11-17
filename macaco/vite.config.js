import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build statique deploye sur Vercel (vercel.json : rewrites, en-tetes), suivi
// de scripts/prerender-cli.mjs qui ecrit une page HTML par langue. En dev,
// Vite sert index.html pour toutes les routes : react-router prend le relais.
export default defineConfig({
  plugins: [react()],
  server: { port: 5180 },
  build: { target: 'es2020' },
})
