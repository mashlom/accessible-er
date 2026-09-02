/// <reference types="vite/client" />

/**
 * lottie-web ships types only for its main entry. We import the light SVG-only
 * build directly (smaller, and code-split away from the main bundle), so give
 * that path the same types.
 */
declare module 'lottie-web/build/player/esm/lottie_light.min.js' {
  import type { LottiePlayer } from 'lottie-web'
  const lottie: LottiePlayer
  export default lottie
}
