import { useState } from 'react'
import { Link } from '../../nav'
import { Roni } from '../components/Roni'
import { Scene, Bubble } from '../components/kit'
import { distressTips, readySentences } from '../../../data/support'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/**
 * The hardest moment of the visit. Roni sits with the family, breathes
 * with them, and holds a set of ready sentences the parent can put on the
 * screen when talking is too much.
 */
export function CalmPage() {
  const [shown, setShown] = useState<string | null>(null)

  return (
    <Scene
      title="רגע קשה? אנחנו כאן"
      subtitle="כשהילד/ה מוצף/ת, כמה דברים קטנים עוזרים. קחו נשימה — אתם עושים עבודה נהדרת."
    >
      <div className={styles.breathe}>
        <Roni size={120} mood="hug" float />
        <div className={styles.breatheCircle} aria-hidden>
          נשימה
        </div>
        <p style={{ color: 'var(--s-ink-soft)', maxWidth: '30ch' }}>
          אפשר לנשום יחד עם העיגול: כשהוא גדל — שואפים. כשהוא קטן — נושפים.
        </p>
      </div>

      <h2 className={styles.sectionLabel}>מה עוזר עכשיו</h2>
      <div className={styles.tips}>
        {distressTips.map((tip) => (
          <div key={tip.title} className={styles.tip}>
            <span className={styles.tipEmoji} aria-hidden>
              {tip.emoji}
            </span>
            <div>
              <h3 className={styles.tipTitle}>{tip.title}</h3>
              <p className={styles.tipBody}>{tip.body}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className={styles.sectionLabel}>משפטים מוכנים לצוות</h2>
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <Bubble>
          קשה לדבר עכשיו? לחצו על משפט — הוא יופיע בגדול על המסך, ואפשר פשוט להראות
          אותו לצוות.
        </Bubble>
      </div>
      <div className={styles.sentences}>
        {readySentences.map((s) => (
          <button key={s} type="button" className={styles.sentence} onClick={() => setShown(s)}>
            {s}
          </button>
        ))}
      </div>

      <Link to="/distract" className={styles.crossLink}>
        🫧 לפינת הסחת דעת — משהו רגוע להסתכל עליו ←
      </Link>
      <Link to="/requests" className={styles.crossLink}>
        🙋 לכל מה שאפשר לבקש מהצוות ←
      </Link>

      {shown && (
        <div
          className={shell.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="משפט מוצג לצוות"
          onClick={() => setShown(null)}
        >
          <p className={shell.overlayText}>{shown}</p>
          <button type="button" className={shell.bigBtn}>
            סגירה
          </button>
        </div>
      )}
    </Scene>
  )
}
