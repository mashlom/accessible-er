import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuestTheme } from '../useQuestTheme'
import { distressTips, readySentences } from '../../../data/support'
import css from '../quest.module.css'

export function CalmPage() {
  const { theme } = useQuestTheme()
  const navigate = useNavigate()
  const [shown, setShown] = useState<string | null>(null)

  return (
    <div className={css.stagePage}>
      {/* ── Child zone ── */}
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
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
