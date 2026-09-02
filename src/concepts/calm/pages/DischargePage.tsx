import { Link } from '../../nav'
import { Mascot } from '../components/Mascot'
import { PageHeader, Note } from '../components/ui'
import styles from './SupportPages.module.css'

/**
 * Discharge / going-home screen (Keren & Rotem, K6 + K13/K14).
 * Draft Hebrew copy — to be refined together with Hagit.
 */
const dischargeBlocks: { emoji: string; title: string; body: string }[] = [
  {
    emoji: '📝',
    title: 'מה קורה עכשיו',
    body: 'הצוות מסכם איתכם את הביקור, נותן הנחיות להמשך, ולפעמים מרשם. אחר כך משתחררים הביתה.',
  },
  {
    emoji: '🚪',
    title: 'זה מעבר',
    body: 'אחרי ביקור ארוך ומעייף, גם עצם היציאה הביתה יכולה להרגיש כמו שינוי גדול. זה בסדר גמור.',
  },
  {
    emoji: '🏠',
    title: 'בבית',
    body: 'בבית אולי יהיה צורך בזמן, בשקט ובחזרה הדרגתית לשגרה. לפעמים התגובה למה שעברנו מגיעה רק אחר כך — וגם זה טבעי.',
  },
  {
    emoji: '🧰',
    title: 'ציוד או אביזרים לבית',
    body: 'לפעמים צריך בבית ציוד או אביזר קטן — למשל כיסוי אטום לגבס כדי להתקלח בלי להרטיב אותו. הצוות יסביר מה צריך ואיפה להשיג.',
  },
  {
    emoji: '🩺',
    title: 'מעקב אצל רופא/ת הילדים',
    body: 'חשוב להמשיך מעקב אצל רופא/ת הילדים בקהילה לפי ההמלצות — הם מכירים את הילד/ה וילוו אתכם גם אחרי הביקור.',
  },
]

export function DischargePage() {
  return (
    <div className="container">
      <PageHeader
        eyebrow="שחרור"
        title="לקראת שחרור הביתה"
        subtitle="מה קורה בסיום הביקור, ואיך מתכוננים לחזרה הביתה."
      />

      <div className={styles.list}>
        {dischargeBlocks.map((b, i) => (
          <div key={i} className={styles.tip}>
            <span className={styles.tipEmoji} aria-hidden>
              {b.emoji}
            </span>
            <div>
              <h2 className={styles.tipTitle}>{b.title}</h2>
              <p className={styles.tipBody}>{b.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
        <Mascot size={80} mood="happy" />
      </div>

      <div style={{ marginTop: 'var(--space-3)' }}>
        <Note>הטקסט כאן טיוטה ראשונית — לניסוח סופי יחד עם חגית.</Note>
      </div>

      <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
        <Link to="/">חזרה לדף הבית</Link>
      </div>
    </div>
  )
}
