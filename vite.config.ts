// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use './' if you plan to serve the site from a subfolder/Netlify drag-n-drop.
  // Use '/' if deploying to root domain (usually fine too).
  base: './'
})
