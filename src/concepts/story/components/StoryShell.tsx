import { Outlet, useNavigate } from 'react-router-dom'
import { Link, useIsConceptHome } from '../../nav'
import { RoniCompanion } from './RoniCompanion'
import styles from '../story.module.css'

/**
 * Frame of the story concept: a painted sky, a rounded top bar, the
 * routed screen, and Roni at the bottom of every single screen.
 */
export function StoryShell() {
  const navigate = useNavigate()
  const isHome = useIsConceptHome()

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

            <Link to="/" className={styles.topTitle}>
              <span aria-hidden>🌈</span>
              <span>המסע של רוני</span>
            </Link>

            <a href="#/" className={styles.topBtn} aria-label="לתפריט הקונספטים">
              <span aria-hidden>☰</span>
            </a>
          </div>
        </header>

        <main id="main">
          <Outlet />
        </main>

        <RoniCompanion />
      </div>
    </div>
  )
}
