import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In production the app is deployed to GitHub Pages under /accessible-er/,
// but local dev serves at plain http://localhost:PORT/.
// HashRouter is used so client-side routing works without server rewrites.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/accessible-er/' : '/',
  plugins: [react()],
}))
