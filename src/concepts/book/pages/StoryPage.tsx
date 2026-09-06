import { useState } from 'react'
import { bookPages } from '../script'
import css from '../book.module.css'

export function StoryPage() {
  const [index, setIndex] = useState(0)

  const page = bookPages[index]
  const isLast = index === bookPages.length - 1
  const isFirst = index === 0

  return (
    <div className={css.book}>
      <div className={css.pageCounter}>
        {bookPages.map((_, i) => (
          <span
            key={i}
            className={[css.dot, i === index ? css.dotActive : ''].join(' ')}
          />
        ))}
      </div>

      <div className={css.pageContent}>
        <div className={css.illustration}>{page.emoji}</div>
        <p className={css.mainText}>{page.text}</p>
        {page.sub && <p className={css.subText}>{page.sub}</p>}
      </div>

      <div className={css.nav}>
        {!isFirst && (
          <button className={css.backBtn} onClick={() => setIndex(i => i - 1)}>
            ← אחורה
          </button>
        )}
        {!isLast ? (
          <button className={css.nextBtn} onClick={() => setIndex(i => i + 1)}>
            הלאה ←
          </button>
        ) : (
          <button className={css.nextBtn} onClick={() => setIndex(0)}>
            מההתחלה ↺
          </button>
        )}
      </div>
    </div>
  )
}
