import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useGoBackTo } from '../../nav'
import { lockBodyScroll } from '../../../lib/scrollLock'
import { useParentTheme, useQuestTheme } from '../useQuestTheme'
import { useLocation } from 'react-router-dom'
import { useReturnTo } from '../useReturnTo'
import { distressTips, readySentences } from '../../../data/support'
import { AnimatedIcon } from '../../../components/AnimatedIcon'
import { useI18n } from '../../../hooks/useI18n'
import { LineIcon } from '../../../components/LineIcon'
import css from '../quest.module.css'

// the tip that links to the distraction page: found by its place in the data, so it works in every language
const REDUCE_STIMULATION_TIP = distressTips.findIndex((tip) => tip.id === 'less-stimuli')

/** The design's colours on the parent's own page (from the home), as the home: one purple, a lilac tint */
const HOME_LOOK = { accent: '#6f4691', accentSoft: '#efe7f6' }

/** `look="home"`: opened from the home's tile, in the home's look and without "back" (the top bar goes home); the smile stays */
export function CalmPage({ look }: { look?: 'home' } = {}) {
  const home = look === 'home'
  // opened from a world: that world's colours; otherwise the parent's turquoise
  const location = useLocation()
  const goBackTo = useGoBackTo()
  const from = location.state as { fromWorld?: boolean; back?: string } | null
  const fromWorld = from?.fromWorld === true
  // from a world: back to that world, where the parent was
  const world = useQuestTheme().theme
  const parent = useParentTheme().theme
  const theme = fromWorld ? world : home ? { ...parent, ...HOME_LOOK } : parent
  const { t } = useI18n()
  const { goBack, leaveState } = useReturnTo('/map')
  // a sentence shown big on the whole screen, to hold the phone up to the staff
  const [shown, setShown] = useState<string | null>(null)
  useEffect(() => {
    if (!shown) return
    const unlock = lockBodyScroll()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShown(null) }
    window.addEventListener('keydown', onKey)
    return () => { unlock(); window.removeEventListener('keydown', onKey) }
  }, [shown])

  return (
    <div className={home ? `${css.stagePage} ${css.cardPageHome}` : css.stagePage}>
      {/* ── Child zone ── */}
      <div className={css.stageHero} style={{ background: home ? 'transparent' : theme.accentSoft }}>
        <AnimatedIcon emoji="😌" size={200} className={`${css.stageHeroImg} ${css.calmBreath}`} />
        {(theme.calmLines ?? [t('ui.labels.adult.calmDefault')]).map((line, i) => (
          <p key={i} className={i === 0 ? css.calmChildMain : css.calmChildLine} style={{ color: theme.accent }}>
            {line}
          </p>
        ))}
        {!home && (
          <div className={css.stageBack}>
            <button
              className={css.backBtn}
              style={{ borderColor: theme.accent, color: theme.accent }}
              onClick={from?.back ? () => goBackTo(from.back as string, { absolute: true }) : goBack}
            >
              {t('ui.buttons.back')}
            </button>
          </div>
        )}
      </div>

      {/* ── Parent zone ── */}
      <div className={css.stageBody}>
        <p className={css.parentZoneLabel}>{t('ui.labels.adult.whenHard')}</p>

        {t('support.distressTips', distressTips).map((tip, i) => (
          <section key={i} className={home ? css.cardSectionHome : undefined}>
            {home ? (
              <h2 className={css.cardHeadingIcon}>
                <span className={css.cardHeadingIconBox} aria-hidden><LineIcon id={`tip-${distressTips[i].id}`} emoji={distressTips[i].emoji} size={20} /></span>
                {tip.title}
              </h2>
            ) : (
              <h2>{distressTips[i].emoji} {tip.title}</h2>
            )}
            <p>{tip.body}</p>
            {i === REDUCE_STIMULATION_TIP && (
              <Link to="/distract" state={leaveState('/calm')} className={css.calmLink} style={{ marginTop: '0.5rem' }}>
                {t('ui.buttons.distractAnimations')}
              </Link>
            )}
          </section>
        ))}

        {/* what the parents can ask the staff for: the staff read them, so a tap shows one big to hold up */}
        <p className={css.parentZoneLabel}>{t('ui.labels.adult.readySentences')}</p>
        <section className={home ? css.cardSectionHome : undefined}>
          <ul className={css.calmSentences}>
            {readySentences.map((s, i) => {
              // the parent reads it in their language; the staff read it big, in Hebrew (the source text)
              const text = t(`support.readySentences.${i}`, s)
              return (
                <li key={s}>
                  <button type="button" className={css.calmSentence} style={{ borderColor: theme.accent, color: theme.accent }} onClick={() => setShown(s)}>
                    {text}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      {shown && createPortal(
        <button type="button" className={css.calmBig} style={{ color: theme.accent }} onClick={() => setShown(null)} aria-label={t('ui.buttons.close')}>
          <span className={css.calmBigText} dir="rtl" lang="he">{shown}</span>
        </button>,
        document.body,
      )}
    </div>
  )
}
