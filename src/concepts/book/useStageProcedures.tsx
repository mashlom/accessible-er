import { keyed } from '../../lib/keyed'
import { useEffect, useState } from 'react'
import { useI18n } from '../../hooks/useI18n'
import encyclopedia from '../../data/child/book/encyclopedia.json'
import measureInfo from '../../data/child/book/measure-info.json'
import testsInfo from '../../data/child/book/tests-info.json'
import treatmentInfo from '../../data/child/book/treatment-info.json'
import decisionInfo from '../../data/child/book/decision-info.json'
import parentUi from '../../data/parent/ui.json'
import css from './book.module.css'
import quest from '../quest/quest.module.css'
import { ProcedureLineIcon } from '../quest/components/ProcedureLineIcon'

/**
 * The circles of a stage and their child sheets, shared by the books that
 * follow the real-photos structure ("How it works" and the Roni book): one
 * circle per measurement, test, treatment or outcome; each opens a sheet with
 * the child's text, and the sheet's "It's interesting" opens the insert.
 */
type Circle = readonly [key: string, icon: string]

const CIRCLES: Record<string, readonly Circle[]> = {
  triage: [
    ['triage-temperature', 'temperature'],
    ['triage-oxygen', 'saturation'],
    ['triage-pressure', 'blood-pressure'],
  ],
  tests: [
    ['tests-blood-test', 'blood-test'],
    ['tests-urine', 'urine'],
    ['tests-xray', 'xray'],
    ['tests-ultrasound', 'ultrasound'],
    ['tests-ct', 'ct'],
  ],
  treatment: [
    ['treatment-iv', 'iv'],
    ['treatment-medication', 'medication'],
    ['treatment-inhalation', 'inhalation'],
    ['treatment-bandage', 'bandage'],
    ['treatment-cast', 'cast'],
    ['treatment-stitches', 'stitches'],
  ],
  decision: [
    ['decision-discharge', 'discharge'],
    ['decision-hospital', 'hospital'],
  ],
}

/** Stages whose insert is opened from their circles, not from the stage's own button. */
const NO_STAGE_INSERT = ['triage', 'tests', 'treatment']

type Way = { label: string; what: string; feel: string; prepare: string }
type Measure = { title: string; videoName?: string; videoText?: string; world?: string; what?: string; feel?: string; prepare?: string; canAsk?: string[]; armpit?: Way; mouth?: Way }
type Insert = { title: string; text: string; draft?: boolean }

const pick = <T,>(data: Record<string, T> | Record<string, Record<string, T>>, lang: string) =>
  ((data as Record<string, unknown>)[lang] ?? (data as Record<string, unknown>).he) as never

export function useStageProcedures(stageId: string, options: { withVideo?: boolean; withInserts?: boolean } = {}) {
  // the books that show the video stories have no "It's interesting" inserts
  const withInserts = options.withInserts ?? true
  const { lang, t } = useI18n()
  const [insertKey, setInsertKey] = useState<string | null>(null)
  const [measureOpen, setMeasureOpen] = useState<string | null>(null)
  // the temperature can be taken under the arm or in the mouth
  const [tempWay, setTempWay] = useState<'armpit' | 'mouth'>('armpit')

  // a new stage closes the sheets
  useEffect(() => {
    setInsertKey(null)
    setMeasureOpen(null)
  }, [stageId])

  const closeLabel = t('ui.buttons.close')
  const insertLabel = t('ui.buttons.interesting')
  const circleList = CIRCLES[stageId] ?? []

  const circles = circleList.length ? (
    <div className={css.measureRow}>
      {circleList.map(([key, icon]) => (
        <button key={key} type="button" className={css.measureBtn} onClick={() => setMeasureOpen(key)} aria-haspopup="dialog">
          <span className={quest.procIcon} style={{ width: 64, height: 64, fontSize: 30 }} aria-hidden>
            <ProcedureLineIcon id={icon} />
          </span>
          <span className={css.measureLabel}>{t(`ui.circles.${key}`)}</span>
        </button>
      ))}
    </div>
  ) : null

  // the measure sheet: the child's text of a measurement, test, treatment or outcome
  let measureSheet: React.ReactNode = null
  if (measureOpen) {
    const measureKey = ({ 'triage-temperature': 'temperature', 'triage-oxygen': 'saturation', 'triage-pressure': 'blood-pressure' } as Record<string, string>)[measureOpen]
    const extra = measureOpen.startsWith('tests-') ? testsInfo : measureOpen.startsWith('treatment-') ? treatmentInfo : measureOpen.startsWith('decision-') ? decisionInfo : null
    const raw: Measure | undefined = extra
      ? (pick(extra as never, lang) as Record<string, Measure>)[measureOpen.slice(measureOpen.indexOf('-') + 1)]
      : (pick(measureInfo as never, lang) as Record<string, Measure>)[measureKey]
    if (raw) {
      const info: Measure = raw.armpit ? { ...raw, ...raw.armpit, ...(tempWay === 'mouth' && raw.mouth ? raw.mouth : {}) } : raw
      const plate = options.withVideo ? keyed((parentUi as unknown as Record<'he' | 'en' | 'ru', { procedurePage: { videoTitle: string; videoText: string } }>)[lang as 'he' | 'en' | 'ru'], 'parent/ui').procedurePage : null
      measureSheet = (
        <div className={css.sheetBackdrop} onClick={() => setMeasureOpen(null)}>
          <div className={css.sheet} role="dialog" aria-modal="true" aria-label={info.title} onClick={(e) => e.stopPropagation()}>
            <h2 className={css.sheetTitle}>{info.title}</h2>
            {raw.armpit && raw.mouth && (
              <div className={css.measureRow} style={{ marginTop: 0 }}>
                {(['armpit', 'mouth'] as const).map((way) => (
                  <button key={way} type="button" className={[css.procCard, tempWay === way ? css.procCardOn : ''].join(' ')} aria-pressed={tempWay === way} onClick={() => setTempWay(way)}>
                    <span className={css.procLabel}>{raw[way]?.label}</span>
                  </button>
                ))}
              </div>
            )}
            {info.world && <p style={{ fontStyle: 'italic' }}>{info.world}</p>}
            <h3 className={css.sheetLabel}>{t('ui.labels.book.what')}</h3>
            <p>{info.what}</p>
            <h3 className={css.sheetLabel}>{t('ui.labels.book.feel')}</h3>
            <p>{info.feel}</p>
            <p>{info.prepare}</p>
            {info.canAsk && info.canAsk.length > 0 && (
              <>
                <h3 className={css.sheetLabel}>{t('ui.labels.book.canAsk')}</h3>
                <ul className={css.sheetList}>
                  {info.canAsk.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </>
            )}
            {plate && (
              <div className={css.videoSlot}>
                <span className={css.videoSlotIcon} aria-hidden>🎬</span>
                <div>
                  <strong>{plate.videoTitle}</strong>
                  <p>{(info.videoText ?? plate.videoText).replace('{title}', info.videoName ?? info.title)}</p>
                </div>
              </div>
            )}
            <div className={css.sheetActions}>
              {withInserts && !!(pick(encyclopedia as never, lang) as Record<string, Insert>)[measureOpen] && (
                <button type="button" className={css.sheetBtnOutline} onClick={() => { setInsertKey(measureOpen); setMeasureOpen(null) }}>
                  🔎 {insertLabel}
                </button>
              )}
              <button type="button" className={css.sheetBtnSolid} onClick={() => setMeasureOpen(null)}>
                {closeLabel}
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  // the insert: the encyclopedic text of a stage or of a circle
  const insert = insertKey ? (pick(encyclopedia as never, lang) as Record<string, Insert>)[insertKey] : undefined
  const insertSheet = insertKey && insert ? (
    <div className={css.sheetBackdrop} onClick={() => setInsertKey(null)}>
      <div className={css.sheet} role="dialog" aria-modal="true" aria-label={insert.title} onClick={(e) => e.stopPropagation()}>
        <h2 className={css.sheetTitle}>{insert.title}</h2>
        {insert.draft && (
          <p style={{ marginTop: '0.25rem', marginBottom: '0.75rem' }}>
            <strong><em>{t('ui.text.draft')}</em></strong>
          </p>
        )}
        <p style={{ whiteSpace: 'pre-line' }}>{insert.text}</p>
        <div className={css.sheetActions}>
          <button type="button" className={css.sheetBtnSolid} onClick={() => setInsertKey(null)}>
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  ) : null

  // the stage's own insert, above the next button, for the stages without circles
  const hasStageInsert = withInserts && !NO_STAGE_INSERT.includes(stageId) && !!(pick(encyclopedia as never, lang) as Record<string, Insert>)[stageId]
  const stageInsertButton = hasStageInsert ? (
    <button type="button" className={css.parentBtn} onClick={() => setInsertKey(stageId)} aria-haspopup="dialog">
      🔎 {insertLabel}
    </button>
  ) : null

  return {
    circles,
    footer: (
      <>
        {stageInsertButton}
        {measureSheet}
        {insertSheet}
      </>
    ),
  }
}
