import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import styles from './AppShell.module.css'

/**
 * App frame: a calm sticky header (home link + back) plus the routed
 * page content. Kept intentionally minimal.
 */
export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

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

          {/* spacer to keep the brand centred */}
          <span className={styles.iconBtn} aria-hidden />
        </div>
      </header>

      <main id="main" className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
