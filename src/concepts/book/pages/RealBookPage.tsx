import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../../../hooks/useI18n'
import { parentJourney } from '../../../data/parent'
import parentUi from '../../../data/parent/ui.json'
import realTexts from '../../../data/child/worlds/real/texts.json'
import css from '../book.module.css'

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

type RealBookTexts = { parentBtn: string; close: string; whatHappens: string; challenge: string; canAsk: string }

export function RealBookPage() {
  const { t, lang, dir } = useI18n()
  const tx = (parentUi as unknown as Record<'he' | 'en' | 'ru', { realBook: RealBookTexts }>)[lang].realBook
  const [index, setIndex] = useState(0)
  const [parentOpen, setParentOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [chosen, setChosen] = useState(false)

  // the stage texts come in the chosen language; Hebrew is the source
  const stages = ((realTexts as unknown as Record<'he' | 'en' | 'ru', { stages: Record<string, { label: string; hint: string }> }>)[lang] ?? (realTexts as unknown as Record<'he', { stages: Record<string, { label: string; hint: string }> }>).he).stages
  const pages: string[] = useMemo(() => {
    const extras = chosen ? OPTIONAL_STAGES.filter((id) => selected.has(id)) : [SELECT_PAGE]
    return [...BASE_STAGES, ...extras, ...END_STAGES].filter((id) => id === SELECT_PAGE || stages[id])
  }, [chosen, selected, stages])

  const stageId = pages[index]
  const isSelect = stageId === SELECT_PAGE
  const child = isSelect ? undefined : stages[stageId]
  const parent = isSelect ? undefined : parentJourney(lang).find((s) => s.id === stageId)
  const isLast = index === pages.length - 1

  // a new page closes the sheet
  useEffect(() => {
    setParentOpen(false)
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
      </div>

      <button type="button" className={css.parentBtn} onClick={() => setParentOpen(true)} aria-haspopup="dialog">
        {tx.parentBtn}
      </button>

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

      {parentOpen && parent && (
        <div className={css.sheetBackdrop} onClick={() => setParentOpen(false)}>
          <div className={css.sheet} role="dialog" aria-modal="true" aria-label={tx.parentBtn} onClick={(e) => e.stopPropagation()}>
            <h2 className={css.sheetTitle}>{parent.title}</h2>
            <p>{parent.meaning}</p>
            <h3 className={css.sheetLabel}>{tx.whatHappens}</h3>
            <p>{parent.whatHappens}</p>
            <h3 className={css.sheetLabel}>{tx.challenge}</h3>
            <p>{parent.challenge}</p>
            <h3 className={css.sheetLabel}>{tx.canAsk}</h3>
            <ul className={css.sheetList}>
              {parent.canAsk.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <button type="button" className={css.nextBtn} onClick={() => setParentOpen(false)}>
              {tx.close}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
