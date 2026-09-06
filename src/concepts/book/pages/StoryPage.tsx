import { useState, useMemo } from 'react'
import { basePages, parentSelectPage, procedureOptions, endPages, BookPage } from '../script'
import css from '../book.module.css'

export function StoryPage() {
  const [index, setIndex] = useState(0)
  const [selectedProcs, setSelectedProcs] = useState<Set<string>>(new Set())
  const [procChosen, setProcChosen] = useState(false)

  const allPages: BookPage[] = useMemo(() => {
    if (!procChosen) {
      return [...basePages, parentSelectPage, ...endPages]
    }
    const chosen = procedureOptions.filter((p) => selectedProcs.has(p.id))
    return [...basePages, ...chosen, ...endPages]
  }, [selectedProcs, procChosen])

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
    setIndex(0)
    setSelectedProcs(new Set())
    setProcChosen(false)
  }

  if (page.isParentSelect) {
    return (
      <div className={css.book}>
        <div className={css.pageCounter}>
          {allPages.map((_, i) => (
            <span key={i} className={[css.dot, i === index ? css.dotActive : ''].join(' ')} />
          ))}
        </div>

        <div className={css.parentSelect}>
          <p className={css.parentSelectTitle}>להורים ולצוות</p>
          <p className={css.parentSelectSub}>בחרו את השלבים הבאים שהרופא/ה קבע/ה</p>
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
                  <span className={css.procLabel}>{proc.text}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className={css.nav}>
          <button className={css.backBtn} onClick={goBack}>← אחורה</button>
          <button className={css.nextBtn} onClick={confirmProcs}>
            {selectedProcs.size > 0 ? 'המשיכו ←' : 'לסיום ←'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={css.book}>
      <div className={css.pageCounter}>
        {allPages.map((_, i) => (
          <span key={i} className={[css.dot, i === index ? css.dotActive : ''].join(' ')} />
        ))}
      </div>

      <div className={css.pageContent}>
        <div className={css.illustration}>{page.emoji}</div>
        <p className={css.mainText}>{page.text}</p>
        {page.sub && <p className={css.subText}>{page.sub}</p>}
      </div>

      <div className={css.nav}>
        {!isFirst && (
          <button className={css.backBtn} onClick={goBack}>← אחורה</button>
        )}
        {!isLast ? (
          <button className={css.nextBtn} onClick={goNext}>הלאה ←</button>
        ) : (
          <button className={css.nextBtn} onClick={restart}>מההתחלה ↺</button>
        )}
      </div>
    </div>
  )
}
