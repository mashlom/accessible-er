import { useI18n } from '../hooks/useI18n'
import { PageHeader, Note } from './ui'
import { staffRequests } from '../data/support'
import styles from './SupportPages.module.css'

export function RequestsPage() {
  const { t } = useI18n()
  return (
    <div className="container">
      <PageHeader
        eyebrow={t('ui.calmRequests.eyebrow', 'מה אפשר לבקש')}
        title={t('ui.calmRequests.title', 'בקשות לגיטימיות מהצוות')}
        subtitle={t('ui.calmRequests.subtitle', 'אלה דברים שמותר ואפשר לבקש כדי להקל על הילד/ה. הצוות כאן כדי לעזור.')}
      />

      <div className={styles.list}>
        {t('support.staffRequests', staffRequests).map((req, i) => (
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
          {t('ui.calmRequests.note', 'לא כל בקשה אפשרית בכל רגע, אבל תמיד אפשר לשאול. אפשר לומר לצוות במשפט קצר מה עוזר לילד/ה — אתם המומחים שלו/ה.')}
        </Note>
      </div>
    </div>
  )
}
