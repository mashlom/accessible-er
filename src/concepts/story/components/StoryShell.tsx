import { useLayoutEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Link, useIsConceptHome } from '../../nav'
import { HelperChat } from '../../../components/helper/HelperChat'
import { LanguagePicker } from '../../../components/LanguagePicker'
import { setI18nEnabled } from '../../../hooks/useI18n'
import styles from '../story.module.css'

/**
 * Frame of the story concept: a painted sky, a rounded top bar, the
 * routed screen, and Roni at the bottom of every single screen.
 */
export function StoryShell() {
  const navigate = useNavigate()
  const isHome = useIsConceptHome()
  // the map icon leads to the trail; on the trail itself it has nowhere to go
  const onTrail = useLocation().pathname.endsWith('/trail')
  // translations are on across the parent side of the app (home, pages, helper)
  useLayoutEffect(() => {
    setI18nEnabled(true)
    return () => setI18nEnabled(false)
  }, [])

  return (
    <div className={styles.theme}>
      <div className={styles.shell}>
        <a href="#main" className="skip-link">
          דילוג לתוכן
        </a>

        <div className={`${styles.skyDeco} no-print`} aria-hidden>
          <span className={styles.sun} />
          <span className={`${styles.cloud} ${styles.cloudA}`} />
          <span className={`${styles.cloud} ${styles.cloudB}`} />
        </div>

        {!isHome && (
        <header className={`${styles.topbar} no-print`}>
          <div className={styles.topbarInner}>
            {!isHome ? (
              <button
                type="button"
                className={styles.topBtn}
                onClick={() => navigate(-1)}
                aria-label="חזרה"
              >
                <span aria-hidden>›</span>
              </button>
            ) : (
              <span className={`${styles.topBtn} ${styles.topBtnGhost}`} aria-hidden />
            )}

            {onTrail ? (
              <span className={styles.topTitle} aria-hidden />
            ) : (
              <Link to="/trail" className={styles.topTitle} aria-label="לשביל שלנו">
                <span aria-hidden>🗺️</span>
              </Link>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
              <LanguagePicker />
              <a href="#/" className={styles.topBtn} aria-label="לתפריט הקונספטים">
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
