import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The site is served from the ROOT of a custom domain
// (https://accessible-er.mashlom.me — see public/CNAME), both locally and
// on GitHub Pages, so the base stays '/'.
// HashRouter is used so client-side routing works without server rewrites.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
