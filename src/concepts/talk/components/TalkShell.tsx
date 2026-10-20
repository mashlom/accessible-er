import { Outlet, useNavigate } from 'react-router-dom'
import { LanguagePicker } from '../../../components/LanguagePicker'
import { useI18n } from '../../../hooks/useI18n'
import styles from '../talk.module.css'

/**
 * Frame of concept 3. Unlike the other two this is a fixed-height app, not a
 * scrolling document: the stage stays put, the thread scrolls inside it.
 */
export function TalkShell() {
  const navigate = useNavigate()
  const { dir, lang, t } = useI18n()

  return (
    <div className={styles.theme}>
      <div className={styles.app} dir={dir} lang={lang}>
        <header className={`${styles.topbar} no-print`}>
          <span aria-hidden />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LanguagePicker />
          </div>
          {/* the cross leaves the helper: the start of the bar in Hebrew, the end in ru and en */}
          <button
            type="button"
            className={styles.topBtn}
            style={{ marginInlineStart: 'auto' }}
            onClick={() => (window.history.length > 1 ? navigate(-1) : (window.location.hash = '#/story'))}
            aria-label={t('ui.buttons.close')}
          >
            <span aria-hidden>✕</span>
          </button>
        </header>

        <Outlet />
      </div>
    </div>
  )
}
