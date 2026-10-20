import { useLayoutEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { setI18nEnabled } from '../hooks/useI18n'
import { LanguagePicker } from './LanguagePicker'
import styles from '../concepts/story/story.module.css'

/**
 * Wraps the care-card pages when they're reached from the home screen,
 * before picking a concept (issue #8, item 4). They get the same top bar as
 * the rest of the app: a way back, the language choice and a way home.
 */
export function StandaloneCardShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  // the card pages are translated like the rest of the app
  useLayoutEffect(() => {
    setI18nEnabled(true)
    return () => setI18nEnabled(false)
  }, [])
  return (
    <div className={styles.theme}>
      <header className={`${styles.topbar} no-print`}>
        <div className={styles.topbarInner}>
          <button type="button" className={styles.topBtn} onClick={() => navigate(-1)} aria-label="back">
            <span aria-hidden>›</span>
          </button>
          <span className={styles.topTitle} aria-hidden />
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
            <LanguagePicker />
            <a href="#/" className={styles.topFlag} aria-label="home">
              <span aria-hidden>🏁</span>
            </a>
          </div>
        </div>
      </header>
      <main id="main">{children}</main>
    </div>
  )
}
