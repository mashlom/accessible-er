import { Outlet, useNavigate } from 'react-router-dom'
import { useLayoutEffect } from 'react'
import { Link, useIsConceptHome } from '../../nav'
import { REQUIRED_STAGES, useQuestProgress } from '../useQuestProgress'
import { useQuestTheme } from '../useQuestTheme'
import { LanguagePicker } from '../../../components/LanguagePicker'
import { setI18nEnabled, useI18n } from '../../../hooks/useI18n'
import css from '../quest.module.css'

/**
 * Frame of the quest concept: a slim sticky header (back + quick link to
 * the current map + concept menu) plus the routed page content.
 *
 * Per Rotem's feedback (issue #8) — every deep screen (calm, card, reason,
 * distract, procedure detail…) needs a fast way back to the map, not just
 * a "back one step" button. The target map depends on progress: while a
 * required stage is still active, that's the day map; once the day is
 * done and optional stages are revealed, it's the night map.
 */
export function QuestShell() {
  const navigate = useNavigate()
  const isHome = useIsConceptHome()
  const { active, visibleOptionals } = useQuestProgress()
  const { theme } = useQuestTheme()
  const { lang, dir, t } = useI18n()
  const isOcean = theme.id === 'ocean' && !isHome

  useLayoutEffect(() => {
    setI18nEnabled(isOcean)
    return () => setI18nEnabled(false)
  }, [isOcean])

  const dayActive = active && (REQUIRED_STAGES as readonly string[]).includes(active.id)
  const mapTarget = dayActive || visibleOptionals.length === 0 ? '/map' : '/night-map'

  return (
    <div className={css.questShell} dir={dir} lang={lang}>
      <a href="#main" className="skip-link">
        {t('ui.shell.skip', 'דילוג לתוכן')}
      </a>
      {/* Pinned RTL so the top bar doesn't flip when the language changes */}
      <header className={`${css.questTopbar} no-print`} dir="rtl">
        {!isHome ? (
          <button
            type="button"
            className={css.questTopBtn}
            onClick={() => navigate(-1)}
            aria-label={t('ui.shell.back', 'חזרה')}
          >
            <span aria-hidden>›</span>
          </button>
        ) : (
          <span className={css.questTopBtn} aria-hidden />
        )}

        <Link to={mapTarget} className={css.questTopBrand} aria-label={t('ui.shell.map', 'למפת המסע')}>
          <span aria-hidden>🗺️</span>
        </Link>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1, justifyContent: 'flex-end', paddingInlineEnd: '0.5rem' }}>
          {isOcean && <LanguagePicker />}
          <a href="#/" className={css.questTopBtn} aria-label={t('ui.shell.menu', 'לתפריט הקונספטים')}>
            <span aria-hidden>☰</span>
          </a>
        </div>
      </header>
      <main id="main">
        <Outlet />
      </main>
    </div>
  )
}
