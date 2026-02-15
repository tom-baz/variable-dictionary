import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Change 'variable-dictionary' to your GitHub repo name
  base: '/variable-dictionary/',
})
