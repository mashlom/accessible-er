import { useEffect, useRef, useState } from 'react'
import { animationUrl } from '../data/animations'

/** OS-level "reduce motion" — respected as a hard opt-out, not a preference. */
function prefersReducedMotion(): boolean {
  return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

interface AnimatedIconProps {
  /** the emoji the icon stands for — also the static fallback */
  emoji: string
  size?: number
  /** 'loop' keeps playing; 'once' plays a single time when it appears */
  play?: 'loop' | 'once'
  className?: string
}

/**
 * An emoji that moves.
 *
 * Falls back to the plain glyph — silently and immediately — when the emoji
 * has no upstream animation, when the file fails to load, or when the OS asks
 * for reduced motion. Nothing here is load-bearing: the app reads exactly the
 * same with every animation missing.
 *
 * The Lottie player itself is dynamically imported, so it only reaches the
 * browser on screens that actually show an animated icon.
 *
 * Animations: Google's Noto Animated Emoji, CC BY 4.0 (see public/anim/NOTICE).
 */
export function AnimatedIcon({
  emoji,
  size = 96,
  play = 'loop',
  className,
}: AnimatedIconProps) {
  const host = useRef<HTMLSpanElement>(null)
  const [failed, setFailed] = useState(false)
  const url = animationUrl(emoji)
  const animate = !!url && !failed && !prefersReducedMotion()

  useEffect(() => {
    if (!animate || !host.current) return
    let anim: { destroy: () => void } | null = null
    let cancelled = false

    ;(async () => {
      try {
        const lottie = (await import('lottie-web/build/player/esm/lottie_light.min.js'))
          .default
        if (cancelled || !host.current) return
        anim = lottie.loadAnimation({
          container: host.current,
          renderer: 'svg',
          loop: play === 'loop',
          autoplay: true,
          path: url!,
        })
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()

    return () => {
      cancelled = true
      anim?.destroy()
    }
  }, [url, animate, play])

  if (!animate) {
    return (
      <span
        className={className}
        style={{ fontSize: size * 0.82, lineHeight: 1 }}
        aria-hidden
      >
        {emoji}
      </span>
    )
  }

  return (
    <span
      ref={host}
      className={className}
      style={{ width: size, height: size, display: 'block' }}
      aria-hidden
    />
  )
}
