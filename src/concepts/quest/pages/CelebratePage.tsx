import { Link } from '../../nav'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import css from '../quest.module.css'

export function CelebratePage() {
  const { theme } = useQuestTheme()
  const { reset, stages } = useQuestProgress()
  const celebrateSkin = theme.stages['decision']
  const doneCount = stages.filter((s) => s.status === 'done').length

  return (
    <div className={css.celebratePage} style={{ background: theme.accentSoft }}>
      {theme.shopImage && (
        <img src={theme.shopImage} alt="" className={css.celebrateImg} />
      )}
      <div className={css.celebrateContent}>
        <p className={css.celebrateTitle} style={{ color: theme.accent }}>
          {celebrateSkin?.label ?? 'עשינו את זה! 🎉'}
        </p>
        {doneCount > 0 && (
          <p className={css.celebrateCoins}>
            {Array.from({ length: doneCount }, (_, i) => (
              <span key={i} className={css.coinCounterItem}>{theme.doneEmoji ?? '✓'}</span>
            ))}
          </p>
        )}
        <p className={css.celebrateHint}>
          {doneCount > 0
            ? `צברת ${doneCount} ${doneCount === 1 ? 'מטבע' : 'מטבעות'} — ברוכים הבאים לחנות!`
            : (celebrateSkin?.hint ?? '')}
        </p>
      </div>
      <div className={css.celebrateActions} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Link to="/shop">
          <button className={css.doneBtn} style={{ background: theme.accent, color: theme.accentText }}>
            לחנות 🛍️
          </button>
        </Link>
        <Link to="/">
          <button
            className={css.backBtn}
            style={{ borderColor: theme.accent, color: theme.accent }}
            onClick={reset}
          >
            לבחירת עולם →
          </button>
        </Link>
      </div>
    </div>
  )
}
