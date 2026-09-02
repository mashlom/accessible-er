import { Outlet, useNavigate } from 'react-router-dom'
import { Link, useIsConceptHome } from '../../nav'
import styles from '../talk.module.css'

/**
 * Frame of concept 3. Unlike the other two this is a fixed-height app, not a
 * scrolling document: the stage stays put, the thread scrolls inside it.
 */
export function TalkShell() {
  const navigate = useNavigate()
  const isHome = useIsConceptHome()

  return (
    <div className={styles.theme}>
      <div className={styles.app}>
        <a href="#main" className="skip-link">
          דילוג לתוכן
        </a>

        <header className={`${styles.topbar} no-print`}>
          {!isHome ? (
            <button
              type="button"
              className={styles.topBtn}
              onClick={() => navigate(-1)}
              aria-label="חזרה לשיחה"
            >
              <span aria-hidden>›</span>
            </button>
          ) : (
            <span aria-hidden />
          )}

          <Link to="/" className={styles.topTitle}>
            לדבר עם רוני
            <small>שיחה אחת, בלי תפריטים</small>
          </Link>

          <a href="#/" className={styles.topBtn} aria-label="לתפריט הקונספטים">
            <span aria-hidden>☰</span>
          </a>
        </header>

        <Outlet />
      </div>
    </div>
  )
}
