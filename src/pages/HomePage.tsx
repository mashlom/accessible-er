import { Link } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { NavCard } from '../components/ui'
import { useVisitReason } from '../hooks/useVisitReason'
import styles from './HomePage.module.css'

export function HomePage() {
  const { path } = useVisitReason()

  return (
    <div className="container">
      <section className={styles.hero}>
        <Mascot size={120} mood="wave" className={styles.heroMascot} />
        <h1 className={styles.heroTitle}>שלום, אני רוני 👋</h1>
        <p className={styles.heroSubtitle}>
          אני כאן כדי ללוות אתכם ואת הילד/ה במיון. נעבור יחד, שלב אחרי שלב, בקצב
          שלכם.
        </p>
      </section>

      {path ? (
        <div className={styles.reasonBanner}>
          <span className={styles.reasonEmoji} aria-hidden>
            {path.emoji}
          </span>
          <span className={styles.reasonText}>
            <span className={styles.reasonLabel}>הגענו בגלל</span>
            <span className={styles.reasonValue}>{path.label}</span>
          </span>
          <Link to="/reason" className={styles.reasonChange}>
            שינוי
          </Link>
        </div>
      ) : (
        <Link to="/reason" className={styles.reasonPrompt}>
          👉 ספרו לי למה הגעתם היום — כדי שאתאים לכם את המסלול
        </Link>
      )}

      <p className={styles.sectionLabel}>מה אפשר לעשות כאן</p>
      <nav className={styles.navList}>
        <NavCard
          to="/card"
          emoji="🪪"
          title="חשוב לדעת על הילד/ה שלי"
          desc="כרטיס התאמות קצר להצגה לצוות"
          tint="#a9d2ce"
          tintSoft="var(--c-primary-soft)"
        />
        <NavCard
          to="/journey"
          emoji="🧭"
          title="מה קורה עכשיו?"
          desc="שלבי הביקור במיון, ומה צפוי בהמשך"
          tint="#a9d2ce"
          tintSoft="var(--c-primary-soft)"
        />
        <NavCard
          to="/procedures"
          emoji="🎬"
          title="מה עומד לקרות?"
          desc="הכנה לבדיקות ולפרוצדורות, שלב אחרי שלב"
          tint="#cbb8e6"
          tintSoft="var(--c-lilac-soft)"
        />
        <NavCard
          to="/map"
          emoji="🗺️"
          title="איפה אנחנו?"
          desc="מפה פשוטה של המיון, כולל מקומות שקטים"
          tint="#a7cbe6"
          tintSoft="var(--c-sky-soft)"
        />
        <NavCard
          to="/calm"
          emoji="💗"
          title="מה עושים כשקשה?"
          desc="הנחיות קצרות להורה ברגעי מצוקה"
          tint="#efc0ac"
          tintSoft="var(--c-alert-soft)"
        />
        <NavCard
          to="/requests"
          emoji="🙋"
          title="מה אפשר לבקש?"
          desc="התאמות שאפשר לבקש מהצוות"
          tint="#a9dcb8"
          tintSoft="var(--c-calm-soft)"
        />
        <NavCard
          to="/reason"
          emoji="💭"
          title="למה הגענו?"
          desc="בחירת סיבת ההגעה להתאמת המסלול"
          tint="#f1d8bf"
          tintSoft="var(--c-accent-soft)"
        />
        <NavCard
          to="/feedback"
          emoji="💬"
          title="משוב קצר"
          desc="ספרו לנו איך היה — כדי שנשתפר"
          tint="#a7cbe6"
          tintSoft="var(--c-sky-soft)"
        />
      </nav>

      <p className={styles.footNote}>
        הכלי נועד להנגיש את הביקור ולהפחית אי־ודאות. הוא אינו מחליף את הצוות הרפואי
        ואינו מספק ייעוץ רפואי. אין צורך להזין שם או פרטים מזהים.
      </p>
    </div>
  )
}
