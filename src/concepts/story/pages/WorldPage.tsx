import type { CSSProperties } from 'react'
import { Link } from '../../nav'
import { openHelper } from '../../../components/helper/helperStore'
import { useVisitReason } from '../../../hooks/useVisitReason'
import shell from '../story.module.css'
import styles from '../pages.module.css'

interface Destination {
  to: string
  emoji: string
  name: string
  desc: string
  tint: string
}

const destinations: Destination[] = [
  { to: '/trail', emoji: '🛤️', name: 'השביל שלנו', desc: 'איפה אנחנו עכשיו ומה הלאה', tint: 'var(--s-mint-soft)' },
  { to: '/wait-times', emoji: '⏱️', name: 'זמנים משוערים', desc: 'כמה זמן כל שלב יכול לקחת', tint: 'var(--s-sun-soft)' },
  { to: '/show', emoji: '🎭', name: 'מה עומד לקרות?', desc: 'סיפור לכל בדיקה, עמוד אחרי עמוד', tint: 'var(--s-lilac-soft)' },
  { to: '/card', emoji: '🪪', name: 'הכרטיס שלך', desc: 'מה חשוב לדעת עליך', tint: 'var(--s-coral-soft)' },
  { to: '/map', emoji: '🗺️', name: 'איפה אנחנו?', desc: 'מפה עם מקומות שקטים', tint: 'var(--s-sea-soft)' },
  { to: '/calm', emoji: '💗', name: 'כשקשה', desc: 'לנשום יחד, ומה עוזר', tint: 'var(--s-coral-soft)' },
  { to: '/distract', emoji: '🫧', name: 'הסחת דעת', desc: 'משהו רגוע להסתכל עליו', tint: 'var(--s-sea-soft)' },
  { to: '/requests', emoji: '🙋', name: 'מה אפשר לבקש', desc: 'מותר לבקש מהצוות', tint: 'var(--s-grass-soft)' },
  { to: '/going-home', emoji: '🏠', name: 'הביתה', desc: 'איך נגמר היום', tint: 'var(--s-sun-soft)' },
  { to: '/message', emoji: '✉️', name: 'הודעה לצוות', desc: 'בקשה קטנה או תודה', tint: 'var(--s-lilac-soft)' },
  { to: '/feedback', emoji: '💬', name: 'איך היה?', desc: 'לספר לנו במשפט', tint: 'var(--s-sea-soft)' },
]

/**
 * The app's home (the parent side, as in the design): a header, the child's
 * world with the one big "start the journey" action and two shared activities,
 * then the parent's centre with the tiles of every stage of the visit.
 */
export function WorldPage() {
  const { path } = useVisitReason()

  return (
    <div className={shell.page}>
      <header className={styles.homeHead}>
        <span className={styles.homeEyebrow}>מלר״ד ילדים • לניאדו</span>
        <h1 className={styles.homeTitle}>מה שלומי?</h1>
        <p className={styles.homeSub}>
          כלי להנגשת הביקור במיון לילדים אוטיסטים ולמשפחותיהם
        </p>
      </header>

      <section className={styles.homeSection} aria-labelledby="child-world">
        <div className={styles.sectionHead}>
          <h2 id="child-world" className={styles.worldLabel}>עולם הילד</h2>
          <span className={styles.sectionChip}>בוחרים איך לצאת לדרך</span>
        </div>

        <a href="#/quest" className={styles.bigStart}>
          <span className={styles.bigStartIcon} aria-hidden>🗺️</span>
          <span className={styles.bigStartText}>
            <strong>בוא נצא למסע</strong>
            <span>בוחרים עולם — טירה, דינוזאורים, פיות ועוד — ועוברים את הביקור תחנה אחר תחנה על המפה</span>
          </span>
          <span className={styles.bigStartArrow} aria-hidden>←</span>
        </a>

        <div className={styles.childCards}>
          <button type="button" className={styles.childCard} onClick={openHelper}>
            <span aria-hidden>💬</span>
            <span className={styles.childCardName}>בוא נדבר!</span>
            <span className={styles.childCardDesc}>שיחה אחת רציפה עם רוני</span>
          </button>
          <a href="#/book" className={styles.childCard}>
            <span aria-hidden>📖</span>
            <span className={styles.childCardName}>בוא נקרא ביחד</span>
            <span className={styles.childCardDesc}>סיפור קצר, עמוד אחר עמוד</span>
          </a>
        </div>
      </section>

      {path ? (
        <div className={styles.reasonStrip}>
          <span className={styles.reasonStripEmoji} aria-hidden>
            {path.emoji}
          </span>
          <span className={styles.reasonStripText}>
            <span className={styles.reasonStripLabel}>באנו היום בגלל</span>
            {path.label}
          </span>
          <Link to="/reason" className={styles.reasonStripAction}>
            שינוי
          </Link>
        </div>
      ) : (
        <Link to="/reason" className={styles.reasonStrip}>
          <span className={styles.reasonStripEmoji} aria-hidden>
            💭
          </span>
          <span className={styles.reasonStripText}>
            ספרו לי למה באנו היום — ואראה לכם את הדרך שלנו
          </span>
          <span className={styles.reasonStripAction} aria-hidden>
            ←
          </span>
        </Link>
      )}

      <div className={styles.sectionHead}>
        <h2 className={styles.worldLabel}>מרכז ההורה</h2>
        <span className={styles.sectionChip}>כל מה שצריך במהלך הביקור</span>
      </div>
      <nav className={styles.destGrid}>
        {destinations.map((d) => (
          <Link
            key={d.to}
            to={d.to}
            className={styles.dest}
            style={{ '--tint': d.tint } as CSSProperties}
          >
            <span className={styles.destBadge} aria-hidden>
              {d.emoji}
            </span>
            <span className={styles.destName}>{d.name}</span>
            <span className={styles.destDesc}>{d.desc}</span>
          </Link>
        ))}
      </nav>

      <p className={styles.footNote}>
        הכלי נועד להנגיש את הביקור ולהפחית אי־ודאות. הוא אינו מחליף את הצוות הרפואי
        ואינו מספק ייעוץ רפואי. אין צורך להזין שם או פרטים מזהים.
      </p>
    </div>
  )
}
