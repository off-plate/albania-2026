import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Built to docs/ and served by GitHub Pages at /italy-trip-2026/
export default defineConfig({
  plugins: [react()],
  base: '/italy-trip-2026/',
  build: { outDir: 'docs', emptyOutDir: true },
})
