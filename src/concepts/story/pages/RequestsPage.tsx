import { Scene, Bubble, Note } from '../components/kit'
import { staffRequests } from '../../../data/support'
import styles from '../pages.module.css'

/** The legitimate asks. Informational — nothing is sent; the parent asks. */
export function RequestsPage() {
  return (
    <Scene
      title="מה אפשר לבקש?"
      subtitle="אלה בקשות לגיטימיות לגמרי. הצוות רגיל אליהן, וזה בסדר גמור לבקש."
    >
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>
          אתם המומחים לילד/ה שלכם. אם משהו יעזור — אפשר פשוט לבקש, גם באמצע.
        </Bubble>
      </div>

      <div className={styles.requests}>
        {staffRequests.map((r) => (
          <div key={r.title} className={styles.request}>
            <span className={styles.requestEmoji} aria-hidden>
              {r.emoji}
            </span>
            <div>
              <h2 className={styles.tipTitle}>{r.title}</h2>
              <p className={styles.tipBody}>{r.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Note>
          הזמינות של כל התאמה תלויה במצב הרפואי, בציוד ובעומס באותו רגע. גם כשלא
          מתאפשר — שווה לשאול.
        </Note>
      </div>
    </Scene>
  )
}
