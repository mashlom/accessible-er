import { Link } from '../../nav'
import { Roni } from '../../../components/Roni'
import { Scene, Bubble, Note } from '../components/kit'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/**
 * Discharge as its own scene (Keren & Rotem's feedback): going home is a
 * transition too, and the reaction to the visit often arrives only later,
 * at home. Draft copy — to be finalised with Hagit.
 */
const blocks: { emoji: string; title: string; body: string }[] = [
  {
    emoji: '📝',
    title: 'מה קורה עכשיו',
    body: 'הצוות מסכם איתכם את הביקור, נותן הנחיות להמשך, ולפעמים מרשם. אחר כך משתחררים הביתה.',
  },
  {
    emoji: '🚪',
    title: 'גם היציאה היא מעבר',
    body: 'אחרי ביקור ארוך ומעייף, עצם היציאה יכולה להרגיש כמו שינוי גדול. אפשר לצאת לאט, ולהיפרד מהמרחב לפני שיוצאים.',
  },
  {
    emoji: '🏠',
    title: 'בבית',
    body: 'בבית אולי יהיה צורך בזמן, בשקט ובחזרה הדרגתית לשגרה. לפעמים התגובה למה שעברנו מגיעה רק אחר כך — וגם זה טבעי.',
  },
  {
    emoji: '🧰',
    title: 'ציוד או אביזרים לבית',
    body: 'לפעמים צריך בבית ציוד קטן — למשל כיסוי אטום לגבס כדי להתקלח בלי להרטיב. הצוות יסביר מה צריך ואיפה להשיג.',
  },
  {
    emoji: '🩺',
    title: 'מעקב אצל רופא/ת הילדים',
    body: 'חשוב להמשיך מעקב אצל רופא/ת הילדים בקהילה לפי ההמלצות — הם מכירים את הילד/ה וילוו אתכם גם אחרי הביקור.',
  },
]

export function GoingHomePage() {
  return (
    <Scene
      title="בדרך הביתה"
      subtitle="מה קורה בסיום הביקור, ואיך מתכוננים לחזרה הביתה."
    >
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>
          עשיתם היום משהו גדול. עכשיו הולכים הביתה — לאט, בקצב שלכם.
        </Bubble>
      </div>

      <div className={styles.tips}>
        {blocks.map((b) => (
          <div key={b.title} className={styles.tip}>
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

      <div className={styles.center} style={{ marginTop: 'var(--space-5)' }}>
        <Roni size={140} mood="proud" float />
        <p style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--s-ink)' }}>
          כל הכבוד לכם. נתראה — ושיהיה לכם רק טוב 💛
        </p>
      </div>

      <div className={styles.actions}>
        <Link to="/feedback" className={shell.bigBtn}>
          לספר לנו איך היה ←
        </Link>
        <Link to="/" className={shell.ghostBtn}>
          חזרה לעולם של רוני
        </Link>
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Note>הטקסט כאן טיוטה ראשונית — לניסוח סופי יחד עם חגית.</Note>
      </div>
    </Scene>
  )
}
