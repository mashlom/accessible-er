import { PageHeader, Note } from '../components/ui'
import { staffRequests } from '../data/support'
import styles from './SupportPages.module.css'

export function RequestsPage() {
  return (
    <div className="container">
      <PageHeader
        eyebrow="מה אפשר לבקש"
        title="בקשות לגיטימיות מהצוות"
        subtitle="אלה דברים שמותר ואפשר לבקש כדי להקל על הילד/ה. הצוות כאן כדי לעזור."
      />

      <div className={styles.list}>
        {staffRequests.map((req, i) => (
          <div key={i} className={styles.tip}>
            <span className={styles.tipEmoji} aria-hidden>
              {req.emoji}
            </span>
            <div>
              <h2 className={styles.tipTitle}>{req.title}</h2>
              <p className={styles.tipBody}>{req.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Note>
          לא כל בקשה אפשרית בכל רגע, אבל תמיד אפשר לשאול. אפשר לומר לצוות במשפט קצר מה
          עוזר לילד/ה — אתם המומחים שלו/ה.
        </Note>
      </div>
    </div>
  )
}
