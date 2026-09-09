import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from '../../nav'
import { useQuestTheme } from '../useQuestTheme'
import { distressTips, readySentences } from '../../../data/support'
import { AnimatedIcon } from '../../../components/AnimatedIcon'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { DAY_MS } from '../../../lib/storage'
import { emptyCard, isCardEmpty, type CareCard } from '../../../data/careCard'
import css from '../quest.module.css'

export function CalmPage() {
  const { theme } = useQuestTheme()
  const navigate = useNavigate()
  const [shown, setShown] = useState<string | null>(null)
  const [freeText, setFreeText] = useState('')
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  const cardEmpty = isCardEmpty(card)

  return (
    <div className={css.stagePage}>
      {/* ── Child zone ── */}
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <AnimatedIcon emoji="😌" size={200} className={`${css.stageHeroImg} ${css.calmBreath}`} />
        {(theme.calmLines ?? ['רגע, נושמים יחד 💙']).map((line, i) => (
          <p key={i} className={i === 0 ? css.calmChildMain : css.calmChildLine} style={{ color: theme.accent }}>
            {line}
          </p>
        ))}
        <div className={css.stageBack}>
          <button
            className={css.backBtn}
            style={{ borderColor: theme.accent, color: theme.accent }}
            onClick={() => navigate(-1)}
          >
            חזרה →
          </button>
        </div>
      </div>

      {/* ── Parent zone ── */}
      <div className={css.stageBody}>
        <p className={css.parentZoneLabel}>כשקשה — מה עוזר</p>

        {distressTips.map((tip, i) => (
          <section key={i}>
            <h2>{tip.emoji} {tip.title}</h2>
            <p>{tip.body}</p>
            {tip.title === 'להוריד גירויים' && (
              <Link to="/distract" className={css.calmLink} style={{ marginTop: '0.5rem' }}>
                🎬 אנימציות להסחת דעת →
              </Link>
            )}
          </section>
        ))}

        <p className={css.parentZoneLabel}>משפטים מוכנים לצוות</p>
        <section>
          <p style={{ marginBottom: '0.75rem', color: '#555', fontSize: '0.9rem' }}>
            קשה לדבר ברגע כזה? לחצו על משפט כדי להציג אותו לצוות בגדול על המסך.
          </p>
          <div className={css.calmSentences}>
            {readySentences.map((s) => (
              <button
                key={s}
                type="button"
                className={css.calmSentenceBtn}
                style={{ borderColor: theme.accent, color: theme.accent }}
                onClick={() => setShown(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <p className={css.parentZoneLabel}>הודעה חופשית לצוות</p>
        <section>
          <p style={{ marginBottom: '0.75rem', color: '#555', fontSize: '0.9rem' }}>
            רוצים לומר משהו שלא מופיע למעלה? כתבו כאן והציגו לצוות.
          </p>
          <textarea
            className={css.calmFreeText}
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="כתבו כאן..."
            rows={3}
            dir="rtl"
          />
          {freeText.trim() && (
            <button
              type="button"
              className={css.calmSentenceBtn}
              style={{ borderColor: theme.accent, color: theme.accent, marginTop: '0.5rem' }}
              onClick={() => setShown(freeText.trim())}
            >
              להציג לצוות ←
            </button>
          )}
        </section>

        <p className={css.parentZoneLabel}>כרטיס התאמות</p>
        <section>
          <p style={{ marginBottom: '0.75rem', color: '#555', fontSize: '0.9rem' }}>
            הכרטיס מרכז את מה שחשוב לדעת על הילד/ה — להציג לצוות במקום להסביר במילים.
          </p>
          {cardEmpty ? (
            <Link to="/card" className={css.calmLink}>🪪 להכנת כרטיס התאמות</Link>
          ) : (
            <>
              <Link to="/card/view" className={css.calmLink}>🪪 להצגת הכרטיס לצוות</Link>
              <Link to="/card" className={css.calmLink} style={{ marginTop: '0.5rem', color: '#888', borderColor: '#d0d0d0', fontSize: '0.95rem' }}>✏️ לעריכת הכרטיס</Link>
            </>
          )}
        </section>

        <button
          type="button"
          className={css.calmHelpBtn}
          style={{ background: theme.accent, color: theme.accentText }}
          onClick={() => setShown('אנחנו צריכים עזרה עכשיו — בבקשה שלחו מישהו מהצוות')}
        >
          🆘 נזדקקנו לעזרה
        </button>
      </div>

      {shown && (
        <div
          className={css.calmOverlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setShown(null)}
        >
          <p className={css.calmOverlayText}>{shown}</p>
          <button type="button" className={css.calmOverlayClose} onClick={() => setShown(null)}>
            סגירה
          </button>
        </div>
      )}
    </div>
  )
}
