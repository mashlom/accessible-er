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
type Names = { ru: string; en: string; he: string }
type Circle = readonly [key: string, icon: string, names: Names]

const CIRCLES: Record<string, readonly Circle[]> = {
  triage: [
    ['triage-temperature', 'temperature', { ru: 'Температура', en: 'Temperature', he: 'חום' }],
    ['triage-oxygen', 'saturation', { ru: 'Сатурация', en: 'Saturation', he: 'סטורציה' }],
    ['triage-pressure', 'blood-pressure', { ru: 'Давление', en: 'Blood pressure', he: 'לחץ דם' }],
  ],
  tests: [
    ['tests-blood-test', 'blood-test', { ru: 'Анализ крови', en: 'Blood test', he: 'בדיקת דם' }],
    ['tests-urine', 'urine', { ru: 'Анализ мочи', en: 'Urine test', he: 'בדיקת שתן' }],
    ['tests-xray', 'xray', { ru: 'Рентген', en: 'X-ray', he: 'רנטגן' }],
    ['tests-ultrasound', 'ultrasound', { ru: 'УЗИ', en: 'Ultrasound', he: 'אולטרסאונד' }],
    ['tests-ct', 'ct', { ru: 'КТ', en: 'CT scan', he: 'סי־טי' }],
  ],
  treatment: [
    ['treatment-iv', 'iv', { ru: 'Капельница', en: 'Drip', he: 'עירוי' }],
    ['treatment-medication', 'medication', { ru: 'Лекарство', en: 'Medicine', he: 'תרופה' }],
    ['treatment-inhalation', 'inhalation', { ru: 'Ингаляция', en: 'Inhalation', he: 'אינהלציה' }],
    ['treatment-bandage', 'bandage', { ru: 'Повязка', en: 'Bandage', he: 'תחבושת' }],
    ['treatment-cast', 'cast', { ru: 'Гипс', en: 'Cast', he: 'גבס' }],
    ['treatment-stitches', 'stitches', { ru: 'Швы', en: 'Stitches', he: 'תפרים' }],
  ],
  decision: [
    ['decision-discharge', 'discharge', { ru: 'Выписка', en: 'Going home', he: 'שחרור הביתה' }],
    ['decision-hospital', 'hospital', { ru: 'Госпитализация', en: 'Staying in hospital', he: 'שהייה בבית החולים' }],
  ],
}

/** Stages whose insert is opened from their circles, not from the stage's own button. */
const NO_STAGE_INSERT = ['triage', 'tests', 'treatment']

type Way = { label: string; what: string; feel: string; prepare: string }
type Heads = { what: string; feel: string; prepare: string; canAsk: string }
type Measure = { title: string; videoName?: string; videoText?: string; world?: string; what?: string; feel?: string; prepare?: string; canAsk?: string[]; headings?: Heads; armpit?: Way; mouth?: Way }
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

  const closeLabel = ({ ru: 'Закрыть', en: 'Close', he: 'סגירה' } as Record<string, string>)[lang] ?? 'סגירה'
  const insertLabel = t('ui.buttons.interesting')
  const circleList = CIRCLES[stageId] ?? []

  const circles = circleList.length ? (
    <div className={css.measureRow}>
      {circleList.map(([key, icon, names]) => (
        <button key={key} type="button" className={css.measureBtn} onClick={() => setMeasureOpen(key)} aria-haspopup="dialog">
          <span className={quest.procIcon} style={{ width: 64, height: 64, fontSize: 30 }} aria-hidden>
            <ProcedureLineIcon id={icon} />
          </span>
          <span className={css.measureLabel}>{names[lang as keyof Names] ?? names.he}</span>
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
      const plate = options.withVideo ? (parentUi as unknown as Record<'he' | 'en' | 'ru', { procedurePage: { videoTitle: string; videoText: string } }>)[lang as 'he' | 'en' | 'ru'].procedurePage : null
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
            {info.headings && <h3 className={css.sheetLabel}>{info.headings.what}</h3>}
            <p>{info.what}</p>
            {info.headings && <h3 className={css.sheetLabel}>{info.headings.feel}</h3>}
            <p>{info.feel}</p>
            {info.headings?.prepare && <h3 className={css.sheetLabel}>{info.headings.prepare}</h3>}
            <p>{info.prepare}</p>
            {info.canAsk && info.canAsk.length > 0 && (
              <>
                {info.headings && <h3 className={css.sheetLabel}>{info.headings.canAsk}</h3>}
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
            <strong><em>{({ ru: 'черновик — ждёт проверки', en: 'draft — awaiting review', he: 'טיוטה — ממתינה לאישור' } as Record<string, string>)[lang] ?? 'טיוטה'}</em></strong>
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
