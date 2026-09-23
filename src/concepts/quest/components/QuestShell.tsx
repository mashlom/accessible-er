import { Outlet, useNavigate } from 'react-router-dom'
import { Link, useIsConceptHome } from '../../nav'
import { REQUIRED_STAGES, useQuestProgress } from '../useQuestProgress'
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

  const dayActive = active && (REQUIRED_STAGES as readonly string[]).includes(active.id)
  const mapTarget = dayActive || visibleOptionals.length === 0 ? '/map' : '/night-map'

  return (
    <div className={css.questShell}>
      <a href="#main" className="skip-link">
        דילוג לתוכן
      </a>

      <header className={`${css.questTopbar} no-print`}>
        {!isHome ? (
          <button
            type="button"
            className={css.questTopBtn}
            onClick={() => navigate(-1)}
            aria-label="חזרה"
          >
            <span aria-hidden>›</span>
          </button>
        ) : (
          <span className={css.questTopBtn} aria-hidden />
        )}

        <Link to={mapTarget} className={css.questTopBrand} aria-label="למפת המסע">
          <span aria-hidden>🗺️</span>
        </Link>

        <a href="#/" className={css.questTopBtn} aria-label="לתפריט הקונספטים">
          <span aria-hidden>☰</span>
        </a>
      </header>

      <main id="main">
        <Outlet />
      </main>
    </div>
  )
}
