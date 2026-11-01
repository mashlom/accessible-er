import { Link, useGoBackTo } from '../../nav'
import { useParentTheme, useQuestTheme } from '../useQuestTheme'
import { useLocation } from 'react-router-dom'
import { useReturnTo } from '../useReturnTo'
import { distressTips, readySentences } from '../../../data/support'
import { AnimatedIcon } from '../../../components/AnimatedIcon'
import { useI18n } from '../../../hooks/useI18n'
import css from '../quest.module.css'

// the tip that links to the distraction page: found by its place in the data, so it works in every language
const REDUCE_STIMULATION_TIP = distressTips.findIndex((tip) => tip.id === 'less-stimuli')

export function CalmPage() {
  // opened from a world: that world's colours; otherwise the parent's turquoise
  const location = useLocation()
  const goBackTo = useGoBackTo()
  const from = location.state as { fromWorld?: boolean; back?: string } | null
  const fromWorld = from?.fromWorld === true
  // from a world: back to that world, where the parent was
  const world = useQuestTheme().theme
  const parent = useParentTheme().theme
  const theme = fromWorld ? world : parent
  const { t } = useI18n()
  const { goBack, leaveState } = useReturnTo('/map')

  return (
    <div className={css.stagePage}>
      {/* ── Child zone ── */}
      <div className={css.stageHero} style={{ background: theme.accentSoft }}>
        <AnimatedIcon emoji="😌" size={200} className={`${css.stageHeroImg} ${css.calmBreath}`} />
        {(theme.calmLines ?? [t('ui.labels.adult.calmDefault')]).map((line, i) => (
          <p key={i} className={i === 0 ? css.calmChildMain : css.calmChildLine} style={{ color: theme.accent }}>
            {line}
          </p>
        ))}
        <div className={css.stageBack}>
          <button
            className={css.backBtn}
            style={{ borderColor: theme.accent, color: theme.accent }}
            onClick={from?.back ? () => goBackTo(from.back as string, { absolute: true }) : goBack}
          >
            {t('ui.buttons.back')}
          </button>
        </div>
      </div>

      {/* ── Parent zone ── */}
      <div className={css.stageBody}>
        <p className={css.parentZoneLabel}>{t('ui.labels.adult.whenHard')}</p>

        {t('support.distressTips', distressTips).map((tip, i) => (
          <section key={i}>
            <h2>{distressTips[i].emoji} {tip.title}</h2>
            <p>{tip.body}</p>
            {i === REDUCE_STIMULATION_TIP && (
              <Link to="/distract" state={leaveState('/calm')} className={css.calmLink} style={{ marginTop: '0.5rem' }}>
                {t('ui.buttons.distractAnimations')}
              </Link>
            )}
          </section>
        ))}

        {/* what the parents can ask the staff for: sentences to read, not buttons */}
        <p className={css.parentZoneLabel}>{t('ui.labels.adult.readySentences')}</p>
        <section>
          <ul className={css.calmSentences}>
            {readySentences.map((s, i) => (
              <li key={s} className={css.calmSentence} style={{ borderColor: theme.accent, color: theme.accent }}>
                {t(`support.readySentences.${i}`, s)}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
