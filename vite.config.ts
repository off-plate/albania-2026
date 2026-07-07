import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Built to docs/ and served by GitHub Pages at /albania-2026/
export default defineConfig({
  plugins: [react()],
  base: '/albania-2026/',
  build: { outDir: 'docs', emptyOutDir: true },
})
