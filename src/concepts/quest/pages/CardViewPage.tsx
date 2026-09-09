import { useLocation, useNavigate } from 'react-router-dom'
import { Link, useConceptPath } from '../../nav'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { DAY_MS } from '../../../lib/storage'
import {
  emptyCard,
  emptyCustom,
  isCardEmpty,
  suggestedAdaptations,
  type CareCard,
} from '../../../data/careCard'
import { useQuestTheme } from '../useQuestTheme'
import css from '../quest.module.css'

export function CardViewPage() {
  const { theme } = useQuestTheme()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()
  const location = useLocation()
  const backTo = (location.state as { from?: string } | null)?.from ?? '/card'
  const goBack = () => navigate(conceptPath(backTo))
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)

  if (isCardEmpty(card)) {
    return (
      <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
        <div className={css.stageHero} style={{ background: theme.accentSoft }}>
          <span className={css.stageHeroIcon}>🪪</span>
          <h1 style={{ color: theme.accent }}>הכרטיס עדיין ריק</h1>
          <p className={css.stageHeroHint}>כמה סימונים קצרים — ויהיה לכם כרטיס להציג לצוות</p>
          <div className={css.stageBack}>
            <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }} onClick={goBack}>
              חזרה →
            </button>
          </div>
        </div>
        <div className={css.stageBody}>
          <div className={css.stageBack}>
            <Link to="/card">
              <button className={css.doneBtn} style={{ background: theme.accent, color: theme.accentText }}>
                למילוי הכרטיס ←
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const c = card.custom ?? emptyCustom
  const join = (...parts: string[]) => parts.map((p) => p.trim()).filter(Boolean).join(' · ')

  const rows = [
    { emoji: '💬', label: 'תקשורת', value: join(...card.communication, c.communication) },
    { emoji: '⚠️', label: 'רגישויות', value: join(...card.sensitivities, c.sensitivities) },
    { emoji: '💛', label: 'עוזר', value: join(...card.calming, c.calming) },
    { emoji: '🚫', label: 'להימנע', value: join(...card.escalators, ...card.avoid, c.escalators, c.avoid) },
    { emoji: '🩺', label: 'קשה במיוחד', value: join(...card.hardMoments, c.hardMoments) },
    { emoji: '🤕', label: 'ביטוי כאב', value: join(...card.pain, c.pain) },
    { emoji: '✏️', label: 'עוד', value: card.freeNote.trim() },
  ].filter((r) => r.value)

  const suggestions = suggestedAdaptations(card)
  const name = card.nickname.trim()

  return (
    <div className={css.stagePage} style={{ '--accent': theme.accent } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <span className={css.stageHeroIcon}>🪪</span>
        <h1 style={{ color: theme.accent }}>חשוב לדעת על {name || 'הילד/ה'} שלי</h1>
        {card.age.trim() && <p className={css.stageHeroHint}>גיל {card.age.trim()}</p>}
        <div className={`${css.stageBack} no-print`}>
          <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }} onClick={goBack}>
            חזרה →
          </button>
        </div>
      </div>

      <div className={css.stageBody}>
        <div className={`${css.cardViewRows} print-area`}>
          {rows.map((row) => (
            <div key={row.label} className={css.cardViewRow}>
              <span className={css.cardViewLabel}>
                <span aria-hidden>{row.emoji}</span> {row.label}
              </span>
              <span className={css.cardViewValue}>{row.value}</span>
            </div>
          ))}
        </div>

        {suggestions.length > 0 && (
          <section className="no-print">
            <h2>💡 התאמות שכדאי לבקש</h2>
            <ul style={{ paddingInlineStart: '1.2em', lineHeight: 1.7 }}>
              {suggestions.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </section>
        )}

        <div className={`${css.stageBack} no-print`}>
          <button type="button" className={css.doneBtn} style={{ background: theme.accent, color: theme.accentText }} onClick={() => window.print()}>
            📄 שמירה / הדפסה
          </button>
          <Link to="/card">
            <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }}>
              ✏️ עריכה →
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
