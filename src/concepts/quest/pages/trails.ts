import type { Pt } from './WorldMapPage'

/** Dots about every 7 units along a cubic Bezier */
export function dotsAlong(p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt[] {
  const n = Math.max(6, Math.round(Math.hypot(p3[0] - p0[0], p3[1] - p0[1]) / 7))
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n
    const u = 1 - t
    const f = (k: number) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]
    return [f(0), f(1)] as Pt
  })
}
