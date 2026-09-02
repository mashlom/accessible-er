import { Outlet, useNavigate } from 'react-router-dom'
import { Link, useIsConceptHome } from '../../nav'
import styles from './AppShell.module.css'

/**
 * App frame: a calm sticky header (home link + back) plus the routed
 * page content. Kept intentionally minimal.
 */
export function AppShell() {
  const navigate = useNavigate()
  const isHome = useIsConceptHome()

  return (
    <div className={styles.shell}>
      <a href="#main" className="skip-link">
        דילוג לתוכן
      </a>
      <header className={`${styles.header} no-print`}>
        <div className={styles.headerInner}>
          {!isHome ? (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => navigate(-1)}
              aria-label="חזרה"
            >
              {/* chevron pointing "back" in RTL = to the right */}
              <span aria-hidden>›</span>
            </button>
          ) : (
            <span className={styles.iconBtn} aria-hidden />
          )}

          <Link to="/" className={styles.brand}>
            <span className={styles.brandMark} aria-hidden>
              🧸
            </span>
            <span>מה שלומי?</span>
          </Link>

          {/* demo affordance: back to the concept menu */}
          <a href="#/" className={styles.iconBtn} aria-label="לתפריט הקונספטים">
            <span aria-hidden>☰</span>
          </a>
        </div>
      </header>

      <main id="main" className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
