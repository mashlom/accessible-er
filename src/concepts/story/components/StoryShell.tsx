import { HomePill } from '../../../components/HomePill'
import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
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
  const { pathname } = useLocation()
  // the pages already in the design's look have its white background
  const light = isHome || /\/(trail|wait-times|show)$/.test(pathname)
  // translations are on across the parent side of the app (home, pages, helper)
  useLayoutEffect(() => {
    setI18nEnabled(true)
    return () => setI18nEnabled(false)
  }, [])

  return (
    <div className={styles.theme}>
      {/* the home has the design's own warm background with soft glows (Figma "Mashlom.me", מסך בית) */}
      <div className={light ? `${styles.shell} ${styles.shellHome}` : styles.shell}>

        {!isHome && (
        <header className={`${styles.topbar} app-no-print`}>
          <div className={styles.topbarInner}>
            {/* the home page on the other side from the language */}
            <HomePill />

            <span className={styles.topTitle} aria-hidden />

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
              <LanguagePicker />
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
