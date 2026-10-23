import { useState } from 'react'
import { Link } from '../../nav'
import { useParentTheme, useQuestTheme } from '../useQuestTheme'
import { useLocation } from 'react-router-dom'
import { useReturnTo } from '../useReturnTo'
import { distressTips, readySentences } from '../../../data/support'
import { AnimatedIcon } from '../../../components/AnimatedIcon'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { DAY_MS } from '../../../lib/storage'
import { emptyCard, isCardEmpty, type CareCard } from '../../../data/careCard'
import { useI18n } from '../../../hooks/useI18n'
import css from '../quest.module.css'

// the tip that links to the distraction page: found by its place in the data, so it works in every language
const REDUCE_STIMULATION_TIP = distressTips.findIndex((tip) => tip.id === 'less-stimuli')

export function CalmPage() {
  // opened from a world: that world's colours; otherwise the parent's turquoise
  const fromWorld = (useLocation().state as { fromWorld?: boolean } | null)?.fromWorld === true
  const world = useQuestTheme().theme
  const parent = useParentTheme().theme
  const theme = fromWorld ? world : parent
  const { t } = useI18n()
  const { goBack, leaveState } = useReturnTo('/map')
  const [shown, setShown] = useState<string | null>(null)
  const [freeText, setFreeText] = useState('')
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  const cardEmpty = isCardEmpty(card)

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
            onClick={goBack}
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

        <p className={css.parentZoneLabel}>{t('ui.labels.adult.readySentences')}</p>
        <section>
          <p style={{ marginBottom: '0.75rem', color: '#555', fontSize: '0.9rem' }}>
            {t('ui.labels.adult.readyHint')}
          </p>
          <div className={css.calmSentences}>
            {readySentences.map((s, i) => (
              <button
                key={s}
                type="button"
                className={css.calmSentenceBtn}
                style={{ borderColor: theme.accent, color: theme.accent }}
                onClick={() => setShown(s)}
              >
                {t(`support.readySentences.${i}`, s)}
              </button>
            ))}
          </div>
        </section>

        <p className={css.parentZoneLabel}>{t('ui.labels.adult.freeMessage')}</p>
        <section>
          <p style={{ marginBottom: '0.75rem', color: '#555', fontSize: '0.9rem' }}>
            {t('ui.labels.adult.freeHint')}
          </p>
          <textarea
            className={css.calmFreeText}
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder={t('ui.labels.adult.writeHere')}
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
              {t('ui.buttons.showToStaff')}
            </button>
          )}
        </section>

        <p className={css.parentZoneLabel}>{t('ui.labels.adult.cardTitle')}</p>
        <section>
          <p style={{ marginBottom: '0.75rem', color: '#555', fontSize: '0.9rem' }}>
            {t('ui.labels.adult.cardDesc')}
          </p>
          {cardEmpty ? (
            <Link to="/card" state={leaveState('/calm')} className={css.calmLink}>{t('ui.buttons.makeCard')}</Link>
          ) : (
            <Link to="/card/view" state={leaveState('/calm')} className={css.calmLink}>{t('ui.buttons.showCard')}</Link>
          )}
        </section>

        <button
          type="button"
          className={css.calmHelpBtn}
          style={{ background: theme.accent, color: theme.accentText }}
          onClick={() => setShown(t('ui.buttons.staffHelpMessage'))}
        >
          {t('ui.buttons.needHelp')}
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
            {t('ui.buttons.close')}
          </button>
        </div>
      )}
    </div>
  )
}
