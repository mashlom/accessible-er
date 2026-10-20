import { useLayoutEffect, type ReactNode } from 'react'
import { setI18nEnabled } from '../hooks/useI18n'

/**
 * Wraps the care-card pages when they're reached from the home screen,
 * before picking a concept (issue #8, item 4) — they normally rely on a
 * concept's own AppShell for a way back, which doesn't exist here.
 */
export function StandaloneCardShell({ children }: { children: ReactNode }) {
  // the card pages are translated like the rest of the app
  useLayoutEffect(() => {
    setI18nEnabled(true)
    return () => setI18nEnabled(false)
  }, [])
  return (
    <div style={{ position: 'relative' }}>
      <a
        href="#/"
        aria-label="חזרה לתפריט הראשי"
        className="no-print"
        style={{
          position: 'fixed',
          top: '0.75rem',
          insetInlineStart: '0.75rem',
          zIndex: 10,
          width: 40,
          height: 40,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.06)',
          color: 'var(--c-text-soft, #555)',
          fontSize: '1.15rem',
          textDecoration: 'none',
        }}
      >
        <span aria-hidden>←</span>
      </a>
      {children}
    </div>
  )
}
