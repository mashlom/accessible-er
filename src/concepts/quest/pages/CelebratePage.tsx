import { Link } from '../../nav'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import css from '../quest.module.css'

export function CelebratePage() {
  const { theme } = useQuestTheme()
  const { reset } = useQuestProgress()
  const celebrateSkin = theme.stages['decision']

  return (
    <div className={css.celebratePage} style={{ background: theme.accentSoft }}>
      {celebrateSkin?.image && (
        <img src={celebrateSkin.image} alt="" className={css.celebrateImg} />
      )}
      <div className={css.celebrateContent}>
        <p className={css.celebrateTitle} style={{ color: theme.accent }}>
          {celebrateSkin?.label ?? 'עשינו את זה! 🎉'}
        </p>
        <p className={css.celebrateHint}>{celebrateSkin?.hint ?? ''}</p>
      </div>
      <div className={css.celebrateActions}>
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
