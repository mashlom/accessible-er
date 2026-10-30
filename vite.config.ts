import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The site is served from the ROOT of a custom domain
// (https://accessible-er.mashlom.me — see public/CNAME), both locally and
// on GitHub Pages, so the base stays '/'.
// HashRouter is used so client-side routing works without server rewrites.
export default defineConfig({
  base: '/',
  plugins: [react()],
  css: {
    modules: {
      // Every class in a *.module.css is namespaced by its file:
      // `.card` in story.module.css becomes `story-module__card__x7Kq2`, so two
      // files can use the same class name without touching each other.
      generateScopedName: '[name]__[local]__[hash:base64:5]',
    },
  },
})
