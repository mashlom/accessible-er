import { useEffect, useRef, useState } from 'react'
import { Link } from '../../nav'
import { useReturnTo } from '../useReturnTo'
import { useParentTheme as useQuestTheme } from '../useQuestTheme'
import { useI18n } from '../../../hooks/useI18n'
import { CareCardForm } from '../../../components/careCard/CareCardForm'
import { CareCardPaper } from '../../../components/careCard/CareCardPaper'
import { careCardHeading } from '../../../components/careCard/CareCardView'
import { saveCardPdf } from '../../../components/careCard/saveCardPdf'
import { emptyCard, type CareCard } from '../../../data/careCard'
import { readStored } from '../../../lib/storage'
import css from '../quest.module.css'

/** "Save as PDF" is hidden for now (the card is shown to the staff from the screen); true brings it back */
const SHOW_PDF_BUTTON = false

/** The design's colours on the parent's own card page (/card), as the home: one purple, a lilac tint */
const HOME_LOOK = { accent: '#6f4691', accentSoft: '#efe7f6', accentText: '#fff' }

/** `look="home"`: the card page opened from the home's tile, in the home's look and without "back" (the top bar goes home) */
export function CardPage({ look }: { look?: 'home' } = {}) {
  const { theme: worldTheme } = useQuestTheme()
  const home = look === 'home'
  const theme = home ? { ...worldTheme, ...HOME_LOOK } : worldTheme
  const { t, lang, dir } = useI18n()
  const { goBack, leaveState } = useReturnTo('/stage/reception')
  // "save as PDF": the paper is drawn out of sight, saved as a file, and taken away
  const [pdf, setPdf] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle')
  const saving = pdf === 'saving'
  const paperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const paper = paperRef.current
    if (!saving || !paper) return
    const name = careCardHeading(readStored<CareCard>('care-card', emptyCard), 'he').title
    saveCardPdf(paper, name).then(
      () => setPdf('saved'),
      () => setPdf('failed'),
    )
  }, [saving])

  return (
    <div className={home ? `${css.stagePage} ${css.cardPageHome}` : css.stagePage} dir={dir} lang={lang} style={{ '--accent': theme.accent, textAlign: 'start' } as React.CSSProperties}>
      <div className={css.stageHero} style={{ background: home ? 'transparent' : theme.accentSoft, ...(lang === 'he' ? {} : { alignItems: 'flex-start', textAlign: 'start' }) }}>
        {/* the home's other pages have no picture over the title either */}
        {!home && <span className={css.stageHeroIcon}>🪪</span>}
        <h1 style={{ color: home ? '#173b4d' : theme.accent }}>
          {t('ui.tiles.card.title')}
        </h1>
        {/* the card is the same on every page and in every world: the same heading as the parent's card page */}
        <p className={css.stageHeroHint}>{t('ui.labels.adult.cardSubtitle')}</p>
        {!home && (
          <div className={css.stageBack}>
            <button className={css.backBtn} style={{ borderColor: theme.accent, color: theme.accent }} onClick={goBack}>
              {t('ui.buttons.back')}
            </button>
          </div>
        )}
      </div>

      <div className={css.stageBody}>
        <CareCardForm
          colours={{ accent: theme.accent, accentSoft: theme.accentSoft, accentText: theme.accentText }}
          sectionClass={home ? css.cardSectionHome : undefined}
          lineIcons={home}
          footer={({ empty }) => (
            <>
            <div className={css.stageBack}>
              <Link to="/card/view" state={leaveState('/card')}>
                <button className={css.doneBtn} style={{ background: theme.accent, color: theme.accentText, opacity: empty ? 0.4 : 1 }} disabled={empty}>
                  {t('ui.buttons.showCardNext')}
                </button>
              </Link>
              {SHOW_PDF_BUTTON && (
                <button
                  type="button"
                  className={css.backBtn}
                  style={{ borderColor: theme.accent, color: theme.accent, opacity: empty ? 0.4 : 1 }}
                  disabled={empty || saving}
                  aria-busy={saving}
                  onClick={() => setPdf('saving')}
                >
                  {saving ? t('ui.cardView.pdfSaving') : t('ui.cardView.savePdf')}
                </button>
              )}
            </div>
            {/* the parent sees that the file was made (a download gives no sign of its own on every phone) */}
            <p className={css.pdfStatus} role="status">
              {pdf === 'saved' && t('ui.cardView.pdfSaved')}
              {pdf === 'failed' && t('ui.cardView.pdfFailed')}
            </p>
            </>
          )}
        />
      </div>

      {saving && <CareCardPaper ref={paperRef} card={readStored<CareCard>('care-card', emptyCard)} />}
    </div>
  )
}
