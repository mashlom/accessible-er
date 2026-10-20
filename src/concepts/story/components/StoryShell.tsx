import { useLayoutEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useIsConceptHome } from '../../nav'
import { HelperChat } from '../../../components/helper/HelperChat'
import { LanguagePicker } from '../../../components/LanguagePicker'
import { setI18nEnabled } from '../../../hooks/useI18n'
import styles from '../story.module.css'

/**
 * Frame of the story concept: a painted sky, a rounded top bar, the
 * routed screen, and Roni at the bottom of every single screen.
 */
export function StoryShell() {
  const isHome = useIsConceptHome()
  // translations are on across the parent side of the app (home, pages, helper)
  useLayoutEffect(() => {
    setI18nEnabled(true)
    return () => setI18nEnabled(false)
  }, [])

  return (
    <div className={styles.theme}>
      <div className={styles.shell}>
        <div className={`${styles.skyDeco} no-print`} aria-hidden>
          <span className={styles.sun} />
          <span className={`${styles.cloud} ${styles.cloudA}`} />
          <span className={`${styles.cloud} ${styles.cloudB}`} />
        </div>

        {!isHome && (
        <header className={`${styles.topbar} no-print`}>
          <div className={styles.topbarInner}>
            <span className={`${styles.topBtn} ${styles.topBtnGhost}`} aria-hidden />

            <span className={styles.topTitle} aria-hidden />

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
              <LanguagePicker />
              <a href="#/" className={styles.topFlag} aria-label="לתפריט הקונספטים">
                <span aria-hidden>🏁</span>
              </a>
            </div>
          </div>
        </header>
        )}

        <main id="main">
          <Outlet />
        </main>

        <HelperChat />
      </div>
    </div>
  )
}
