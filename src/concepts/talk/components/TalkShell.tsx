import { Outlet, useNavigate } from 'react-router-dom'
import { useIsConceptHome } from '../../nav'
import { LanguagePicker } from '../../../components/LanguagePicker'
import { useI18n } from '../../../hooks/useI18n'
import talkJson from '../../../data/parent/talk.json'
import styles from '../talk.module.css'

/**
 * Frame of concept 3. Unlike the other two this is a fixed-height app, not a
 * scrolling document: the stage stays put, the thread scrolls inside it.
 */
export function TalkShell() {
  const navigate = useNavigate()
  const isHome = useIsConceptHome()
  const { dir, lang } = useI18n()

  return (
    <div className={styles.theme}>
      <div className={styles.app} dir={dir} lang={lang}>
        <header className={`${styles.topbar} no-print`}>
          {!isHome ? (
            <button
              type="button"
              className={styles.topBtn}
              onClick={() => navigate(-1)}
              aria-label={(talkJson as unknown as Record<'he' | 'en' | 'ru', { cardView: { back: string } }>)[lang].cardView.back}
            >
              <span aria-hidden>›</span>
            </button>
          ) : (
            <span aria-hidden />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LanguagePicker />
            <a href="#/" className={styles.topBtn} aria-label="לתפריט הקונספטים">
              <span aria-hidden>🏁</span>
            </a>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  )
}
