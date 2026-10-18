import { useState, useMemo } from 'react'
import { ParentSheet } from '../../quest/components/ParentInfo'
import quest from '../../quest/quest.module.css'
import { basePages, parentSelectPage, procedureOptions, endPages, dispositionPage, homePage, hospitalPage, BookPage } from '../script'
import { useI18n } from '../../../hooks/useI18n'
import css from '../book.module.css'

/** Which visit stage each picture-book page belongs to — the parent sheet of the ocean world opens on it. */
const PAGE_STAGE: Record<string, string> = {
  arrival: 'reception',
  reception: 'reception',
  'wait-before-triage': 'wait-before-triage',
  triage: 'triage',
  'wait-doctor': 'wait-doctor',
  doctor: 'doctor',
  tests: 'tests',
  treatment: 'treatment',
  consult: 'consult',
  'wait-results': 'wait-results',
  decision: 'decision',
  disposition: 'decision',
  home: 'decision',
  hospital: 'decision',
  end: 'decision',
}

/** Open-book icon from the ocean mockup (the same path as the quest's parent pill). */
const BOOK_PATH = 'M40.75 903C41.3553 903 41.9445 903.066 42.5176 903.197C43.0907 903.328 43.6606 903.525 44.2273 903.788V896.4C43.6992 896.1 43.139 895.875 42.5466 895.725C41.9542 895.575 41.3553 895.5 40.75 895.5C40.2864 895.5 39.8259 895.544 39.3688 895.631C38.9116 895.719 38.4705 895.85 38.0455 896.025V903.45C38.4962 903.3 38.9437 903.188 39.3881 903.113C39.8324 903.038 40.2864 903 40.75 903ZM45.7727 903.788C46.3394 903.525 46.9093 903.328 47.4824 903.197C48.0555 903.066 48.6447 903 49.25 903C49.7136 903 50.1676 903.038 50.6119 903.113C51.0563 903.188 51.5038 903.3 51.9545 903.45V896.025C51.5295 895.85 51.0884 895.719 50.6312 895.631C50.1741 895.544 49.7136 895.5 49.25 895.5C48.6447 895.5 48.0458 895.575 47.4534 895.725C46.861 895.875 46.3008 896.1 45.7727 896.4V903.788ZM45 906C44.3818 905.525 43.7121 905.156 42.9909 904.894C42.2697 904.631 41.5227 904.5 40.75 904.5C40.2091 904.5 39.6778 904.569 39.1562 904.706C38.6347 904.844 38.1356 905.038 37.6591 905.288C37.3886 905.425 37.1278 905.419 36.8767 905.269C36.6256 905.119 36.5 904.9 36.5 904.613V895.575C36.5 895.438 36.5354 895.306 36.6063 895.181C36.6771 895.056 36.7833 894.963 36.925 894.9C37.5174 894.6 38.1356 894.375 38.7795 894.225C39.4235 894.075 40.0803 894 40.75 894C41.497 894 42.2278 894.094 42.9426 894.281C43.6574 894.469 44.3432 894.75 45 895.125C45.6568 894.75 46.3426 894.469 47.0574 894.281C47.7722 894.094 48.503 894 49.25 894C49.9197 894 50.5765 894.075 51.2205 894.225C51.8644 894.375 52.4826 894.6 53.075 894.9C53.2167 894.963 53.3229 895.056 53.3938 895.181C53.4646 895.306 53.5 895.438 53.5 895.575V904.613C53.5 904.9 53.3744 905.119 53.1233 905.269C52.8722 905.419 52.6114 905.425 52.3409 905.288C51.8644 905.038 51.3653 904.844 50.8438 904.706C50.3222 904.569 49.7909 904.5 49.25 904.5C48.4773 904.5 47.7303 904.631 47.0091 904.894C46.2879 905.156 45.6182 905.525 45 906Z'

export function StoryPage() {
  const { t, dir, lang } = useI18n()
  // the page's own text, or its translation from data/i18n/book.json (keyed by the page id)
  const pageText = (id: string, field: 'text' | 'sub', fallback: string) => t(`book.pages.${id}.${field}`, fallback)
  const [index, setIndex] = useState(0)
  const [selectedProcs, setSelectedProcs] = useState<Set<string>>(new Set())
  const [procChosen, setProcChosen] = useState(false)
  const [parentOpen, setParentOpen] = useState(false)
  // the family's choice after the decision: going home, or staying in the hospital (issue #10)
  const [disposition, setDisposition] = useState<'home' | 'hospital' | null>(null)
  const [decisionPage, endLast] = endPages

  const allPages: BookPage[] = useMemo(() => {
    const head = procChosen ? [...basePages, ...procedureOptions.filter((p) => selectedProcs.has(p.id))] : [...basePages, parentSelectPage]
    const outcome = disposition === 'home' ? homePage : disposition === 'hospital' ? hospitalPage : null
    return [...head, decisionPage, dispositionPage, ...(outcome ? [outcome] : []), endLast]
  }, [selectedProcs, procChosen, disposition, decisionPage, endLast])

  const page = allPages[index]
  const isLast = index === allPages.length - 1
  const isFirst = index === 0

  function toggleProc(id: string) {
    setSelectedProcs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function confirmProcs() {
    setProcChosen(true)
    // skip the parentSelectPage slot, go to first end page (or first proc page)
    // index stays the same but allPages changes — we want to go forward
    setIndex((i) => i)
  }

  function goNext() {
    if (index < allPages.length - 1) setIndex((i) => i + 1)
    else setIndex(0) // restart
  }

  function goBack() {
    if (index > 0) setIndex((i) => i - 1)
  }

  // Restart: reset everything
  function restart() {
    setDisposition(null)
    setIndex(0)
    setSelectedProcs(new Set())
    setProcChosen(false)
  }

  if (page.isParentSelect) {
    return (
      <div className={css.book} dir={dir} lang={lang}>
        <div className={css.pageCounter}>
          {allPages.map((_, i) => (
            <span key={i} className={[css.dot, i === index ? css.dotActive : ''].join(' ')} />
          ))}
        </div>

        <div className={css.parentSelect}>
          <p className={css.parentSelectTitle}>{pageText('parent-select', 'text', 'להורים ולצוות')}</p>
          <p className={css.parentSelectSub}>{pageText('parent-select', 'sub', 'בחרו את השלבים הבאים שהרופא/ה קבע/ה')}</p>
          <div className={css.procGrid}>
            {procedureOptions.map((proc) => {
              const on = selectedProcs.has(proc.id)
              return (
                <button
                  key={proc.id}
                  className={[css.procCard, on ? css.procCardOn : ''].join(' ')}
                  onClick={() => toggleProc(proc.id)}
                  aria-pressed={on}
                >
                  <span className={css.procEmoji}>{proc.emoji}</span>
                  <span className={css.procLabel}>{pageText(proc.id, 'text', proc.text)}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className={css.nav}>
          <button className={css.backBtn} onClick={goBack}>{t('book.ui.back', 'אחורה')}</button>
          <button className={css.nextBtn} onClick={confirmProcs}>
            {selectedProcs.size > 0 ? t('book.ui.continue', 'המשיכו') : t('book.ui.toEnd', 'אין הפניות')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={css.book} dir={dir} lang={lang}>
      <div className={css.pageCounter}>
        {allPages.map((_, i) => (
          <span key={i} className={[css.dot, i === index ? css.dotActive : ''].join(' ')} />
        ))}
      </div>

      <div className={css.pageContent}>
        <div className={css.illustration}>{page.emoji}</div>
        <p className={css.mainText}>
          {page.id !== 'parent-select' && `${allPages.filter((p) => p.id !== 'parent-select').indexOf(page) + 1}. `}
          {pageText(page.id, 'text', page.text)}
        </p>
        {page.sub && <p className={css.subText}>{pageText(page.id, 'sub', page.sub)}</p>}
      </div>

      {page.id === 'disposition' ? (
        <div className={css.procGrid}>
          <button className={css.procCard} onClick={() => { setDisposition('home'); setIndex((i) => i + 1) }}>
            <span className={css.procEmoji}>🏠</span>
            <span className={css.procLabel}>{t('book.ui.choiceHome', 'הביתה')}</span>
          </button>
          <button className={css.procCard} onClick={() => { setDisposition('hospital'); setIndex((i) => i + 1) }}>
            <span className={css.procEmoji}>🏥</span>
            <span className={css.procLabel}>{t('book.ui.choiceHospital', 'נשארים בבית החולים')}</span>
          </button>
        </div>
      ) : (
        <div className={css.nav}>
          {!isFirst && (
            <button className={css.backBtn} onClick={goBack}>{t('book.ui.back', 'אחורה')}</button>
          )}
          {!isLast ? (
            <button className={css.nextBtn} onClick={goNext}>{t('book.ui.next', 'הלאה')}</button>
          ) : (
            <button className={css.nextBtn} onClick={restart}>{t('book.ui.restart', 'מההתחלה ↺')}</button>
          )}
        </div>
      )}

      {/* the ocean world's parent pill, under the whole child part; opens its sheet on this page's stage */}
      {PAGE_STAGE[page.id] && (
        <button
          type="button"
          className={`${quest.parentBtnOcean} ${quest.parentBtnOceanInline}`}
          style={{ ['--u' as string]: '1px', marginTop: '0.75rem' }}
          onClick={() => setParentOpen(true)}
          aria-haspopup="dialog"
        >
          <span className={quest.parentBtnOceanPill}>
            {t('ui.buttons.parentInfo', 'מידע נוסף להורה')}
            <svg viewBox="33 888 24 24" className={quest.parentBtnOceanIcon} aria-hidden>
              <rect x="33" y="888" width="24" height="24" rx="12" />
              <path d={BOOK_PATH} />
            </svg>
          </span>
        </button>
      )}

      {parentOpen && PAGE_STAGE[page.id] && (
        <ParentSheet stageId={PAGE_STAGE[page.id]} onClose={() => setParentOpen(false)} oceanLook questLinks={false} />
      )}
    </div>
  )
}
