import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../../../hooks/useI18n'
import realTexts from '../../../data/child/worlds/real/texts.json'
import realInfo from '../../../data/child/book/real-info.json'
import encyclopedia from '../../../data/child/book/encyclopedia.json'
import measureInfo from '../../../data/child/book/measure-info.json'
import testsInfo from '../../../data/child/book/tests-info.json'
import treatmentInfo from '../../../data/child/book/treatment-info.json'
import css from '../book.module.css'
import quest from '../../quest/quest.module.css'
import { ProcedureLineIcon } from '../../quest/components/ProcedureLineIcon'

/**
 * "How it works" — the אני world retold as a book (issue #10): one stage per
 * page, the child's line in front, and the parent's text on a bottom sheet.
 * Like the picture book, the extra stages (tests, treatment, consult, waiting
 * for results) are chosen by the parent on a selection page mid-book.
 * The child's lines come from the real world's texts (Hebrew for now); the
 * parent's sheet shows the shared parent texts in the chosen language.
 */
const BASE_STAGES = ['reception', 'wait-before-triage', 'triage', 'wait-doctor', 'doctor'] as const
const OPTIONAL_STAGES = ['tests', 'treatment', 'consult', 'wait-results'] as const
const END_STAGES = ['decision'] as const
const SELECT_PAGE = 'parent-select'

/** The stage icons of the real world's theme (src/concepts/quest/themes). */
const STAGE_ICONS: Record<string, string> = {
  reception: '📝',
  'wait-before-triage': '⏳',
  triage: '🩺',
  'wait-doctor': '⏳',
  doctor: '👩‍⚕️',
  decision: '🏁',
  tests: '🔬',
  treatment: '💊',
  consult: '🧑‍⚕️',
  'wait-results': '🕰️',
}

type InsertTexts = { close: string }

export function RealBookPage() {
  const { t, lang, dir } = useI18n()
  const labels = ((realInfo as unknown as Record<string, { headings: { whatHappens: string; challenge: string; canAsk: string } }>)[lang] ?? (realInfo as unknown as Record<string, { headings: { whatHappens: string; challenge: string; canAsk: string } }>).he).headings
  const tx: InsertTexts = { close: ({ ru: 'Закрыть', en: 'Close', he: 'סגירה' } as Record<string, string>)[lang] ?? 'סגירה' }
  const [index, setIndex] = useState(0)
  const [insertKey, setInsertKey] = useState<string | null>(null)
  // the temperature opens its parent description page first; from there the insert is one tap away
  const [measureOpen, setMeasureOpen] = useState<string | null>(null)
  // the temperature can be taken under the arm or in the mouth
  const [tempWay, setTempWay] = useState<'armpit' | 'mouth'>('armpit')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [chosen, setChosen] = useState(false)

  // the stage texts come in the chosen language; Hebrew is the source
  const stages = ((realTexts as unknown as Record<'he' | 'en' | 'ru', { stages: Record<string, { label: string; hint: string }> }>)[lang] ?? (realTexts as unknown as Record<'he', { stages: Record<string, { label: string; hint: string }> }>).he).stages
  const pages: string[] = useMemo(() => {
    const extras = chosen ? OPTIONAL_STAGES.filter((id) => selected.has(id)) : [SELECT_PAGE]
    return [...BASE_STAGES, ...extras, ...END_STAGES].filter((id) => id === SELECT_PAGE || stages[id])
  }, [chosen, selected, stages])

  const stageId = pages[index]
  // the stage information, written for the child (data/child/book/real-info.json)
  const info = ((realInfo as unknown as Record<string, Record<string, { meaning: string; whatHappens: string; challenge: string; canAsk: string[] }>>)[lang] ?? (realInfo as unknown as Record<string, Record<string, { meaning: string; whatHappens: string; challenge: string; canAsk: string[] }>>).he)[stageId]
  const isSelect = stageId === SELECT_PAGE
  const child = isSelect ? undefined : stages[stageId]
  const isLast = index === pages.length - 1

  // a new page closes the sheet
  useEffect(() => {
    setInsertKey(null)
  }, [index])

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function restart() {
    setIndex(0)
    setSelected(new Set())
    setChosen(false)
  }

  const counter = (
    <div className={css.pageCounter}>
      {pages.map((_, i) => (
        <span key={i} className={[css.dot, i === index ? css.dotActive : ''].join(' ')} />
      ))}
    </div>
  )

  if (isSelect) {
    return (
      <div className={css.book} dir={dir} lang={lang}>
        {counter}
        <div className={css.parentSelect}>
          <p className={css.parentSelectTitle}>{t('book.pages.parent-select.text', 'להורים ולצוות')}</p>
          <p className={css.parentSelectSub}>{t('book.pages.parent-select.sub', 'בחרו את השלבים הבאים שהרופא/ה קבע/ה')}</p>
          <div className={css.procGrid}>
            {OPTIONAL_STAGES.filter((id) => stages[id]).map((id) => {
              const on = selected.has(id)
              return (
                <button
                  key={id}
                  className={[css.procCard, on ? css.procCardOn : ''].join(' ')}
                  onClick={() => toggle(id)}
                  aria-pressed={on}
                >
                  <span className={css.procEmoji}>{STAGE_ICONS[id]}</span>
                  <span className={css.procLabel}>{stages[id].label}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className={css.nav}>
          <button className={css.backBtn} onClick={() => setIndex((i) => Math.max(0, i - 1))}>
            {t('book.ui.back', 'אחורה')}
          </button>
          <button className={css.nextBtn} onClick={() => setChosen(true)}>
            {selected.size > 0 ? t('book.ui.continue', 'המשיכו') : t('book.ui.toEnd', 'אין הפניות')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={css.book} dir={dir} lang={lang}>
      {counter}

      <div className={css.pageContent}>
        <div className={css.illustration}>{STAGE_ICONS[stageId]}</div>
        <p className={css.mainText}>{`${pages.filter((p) => p !== SELECT_PAGE).indexOf(stageId) + 1}. `}{child?.label}</p>
        <p className={css.subText}>{child?.hint}</p>
        {child && (stageId === 'triage' || stageId === 'tests' || stageId === 'treatment') && (
        <div className={css.measureRow}>
          {(stageId === 'treatment' ? [
            ['treatment-iv', 'iv', { ru: 'Капельница', en: 'Drip', he: 'עירוי' }],
            ['treatment-medication', 'medication', { ru: 'Лекарство', en: 'Medicine', he: 'תרופה' }],
            ['treatment-inhalation', 'inhalation', { ru: 'Ингаляция', en: 'Inhalation', he: 'אינהלציה' }],
            ['treatment-bandage', 'bandage', { ru: 'Повязка', en: 'Bandage', he: 'תחבושת' }],
            ['treatment-cast', 'cast', { ru: 'Гипс', en: 'Cast', he: 'גבס' }],
            ['treatment-stitches', 'stitches', { ru: 'Швы', en: 'Stitches', he: 'תפרים' }],
          ] as const : stageId === 'tests' ? [
            ['tests-blood-test', 'blood-test', { ru: 'Анализ крови', en: 'Blood test', he: 'בדיקת דם' }],
            ['tests-urine', 'urine', { ru: 'Анализ мочи', en: 'Urine test', he: 'בדיקת שתן' }],
            ['tests-xray', 'xray', { ru: 'Рентген', en: 'X-ray', he: 'רנטגן' }],
            ['tests-ultrasound', 'ultrasound', { ru: 'УЗИ', en: 'Ultrasound', he: 'אולטרסאונד' }],
            ['tests-ct', 'ct', { ru: 'КТ', en: 'CT scan', he: 'סי־טי' }],
          ] as const : [
            ['triage-temperature', 'temperature', { ru: 'Температура', en: 'Temperature', he: 'חום' }],
            ['triage-oxygen', 'saturation', { ru: 'Сатурация', en: 'Saturation', he: 'סטורציה' }],
            ['triage-pressure', 'blood-pressure', { ru: 'Давление', en: 'Blood pressure', he: 'לחץ דם' }],
          ] as const).map(([key, icon, names]) => (
            <button key={key} type="button" className={css.measureBtn} onClick={() => setMeasureOpen(key)} aria-haspopup="dialog">
              <span className={quest.procIcon} style={{ width: 64, height: 64, fontSize: 30 }} aria-hidden>
                <ProcedureLineIcon id={icon} />
              </span>
              <span className={css.measureLabel}>{names[lang as 'he' | 'en' | 'ru'] ?? names.he}</span>
            </button>
          ))}
        </div>
        )}
        {info && (
          <div className={css.stageInfo}>
            {info.meaning && <p>{info.meaning}</p>}
            {info.whatHappens && (
              <>
                <h3 className={css.sheetLabel}>{labels.whatHappens}</h3>
                <p>{info.whatHappens}</p>
              </>
            )}
            {info.challenge && (
              <>
                <h3 className={css.sheetLabel}>{labels.challenge}</h3>
                <p>{info.challenge}</p>
              </>
            )}
            {info.canAsk && info.canAsk.length > 0 && (
              <>
                <h3 className={css.sheetLabel}>{labels.canAsk}</h3>
                <ul className={css.sheetList}>
                  {info.canAsk.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>

      {/* the encyclopedic insert of every stage, above the next button; the measurements, tests and treatment stages have their own circles */}
      {child && stageId !== 'triage' && stageId !== 'tests' && stageId !== 'treatment' && (
        <button type="button" className={css.parentBtn} onClick={() => setInsertKey(stageId)} aria-haspopup="dialog">
          🔎 {({ ru: 'Это интересно', en: 'It is interesting', he: 'מעניין' } as Record<string, string>)[lang] ?? 'Это интересно'}
        </button>
      )}
      <div className={css.nav}>
        {index > 0 && (
          <button className={css.backBtn} onClick={() => setIndex((i) => i - 1)}>
            {t('book.ui.back', 'אחורה')}
          </button>
        )}
        {!isLast ? (
          <button className={css.nextBtn} onClick={() => setIndex((i) => i + 1)}>
            {t('book.ui.next', 'הלאה')}
          </button>
        ) : (
          <button className={css.nextBtn} onClick={restart}>
            {t('book.ui.restart', 'מההתחלה ↺')}
          </button>
        )}
      </div>

      {measureOpen && (() => {
        const measureKey = ({ 'triage-temperature': 'temperature', 'triage-oxygen': 'saturation', 'triage-pressure': 'blood-pressure' } as Record<string, string>)[measureOpen]
        type Way = { label: string; what: string; feel: string; prepare: string }
        type Heads = { what: string; feel: string; prepare: string; canAsk: string }
        // the treatments also carry the line from the world, the headings and the things to ask for
        type Measure = { title: string; world?: string; what?: string; feel?: string; prepare?: string; canAsk?: string[]; headings?: Heads; armpit?: Way; mouth?: Way }
        // the measurements and the tests each have their own child texts
        const extra = measureOpen.startsWith('tests-') ? testsInfo : measureOpen.startsWith('treatment-') ? treatmentInfo : null
        const raw = extra
          ? ((extra as unknown as Record<string, Record<string, Measure>>)[lang] ?? (extra as unknown as Record<string, Record<string, Measure>>).he)[measureOpen.slice(measureOpen.indexOf('-') + 1)]
          : ((measureInfo as unknown as Record<string, Record<string, Measure>>)[lang] ?? (measureInfo as unknown as Record<string, Record<string, Measure>>).he)[measureKey]
        if (!raw) return null
        const info: Measure = raw.armpit ? { ...raw, ...raw.armpit, ...(tempWay === 'mouth' && raw.mouth ? raw.mouth : {}) } : raw
        return (
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
              <div className={css.sheetActions}>
                <button type="button" className={css.sheetBtnOutline} onClick={() => { setInsertKey(measureOpen); setMeasureOpen(null) }}>
                  🔎 {({ ru: 'Это интересно', en: 'It is interesting', he: 'מעניין' } as Record<string, string>)[lang] ?? 'Это интересно'}
                </button>
                <button type="button" className={css.sheetBtnSolid} onClick={() => setMeasureOpen(null)}>
                  {tx.close}
                </button>
              </div>
            </div>
          </div>
        )
      })()}
      {insertKey && (() => {
        const insert = ((encyclopedia as unknown as Record<string, Record<string, { title: string; text: string; draft?: boolean }>>)[lang] ?? (encyclopedia as unknown as Record<string, Record<string, { title: string; text: string; draft?: boolean }>>).he)[insertKey]
        if (!insert) return null
        return (
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
                  {tx.close}
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
