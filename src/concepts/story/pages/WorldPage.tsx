import { useRef, type CSSProperties } from 'react'
import { Link } from '../../nav'
import { Roni } from '../components/Roni'
import { Bubble } from '../components/kit'
import { useVisitReason } from '../../../hooks/useVisitReason'
import {
  avatarEmojis,
  fileToAvatarDataUrl,
  useSessionAvatar,
} from '../../../hooks/useSessionAvatar'
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
  { to: '/show', emoji: '🎭', name: 'מה עומד לקרות?', desc: 'סיפור לכל בדיקה, עמוד אחרי עמוד', tint: 'var(--s-lilac-soft)' },
  { to: '/card', emoji: '🪪', name: 'הכרטיס שלי', desc: 'מה חשוב לדעת עליי', tint: 'var(--s-coral-soft)' },
  { to: '/map', emoji: '🗺️', name: 'איפה אנחנו?', desc: 'מפה עם מקומות שקטים', tint: 'var(--s-sea-soft)' },
  { to: '/calm', emoji: '💗', name: 'כשקשה', desc: 'לנשום יחד, ומה עוזר', tint: 'var(--s-coral-soft)' },
  { to: '/distract', emoji: '🫧', name: 'הסחת דעת', desc: 'משהו רגוע להסתכל עליו', tint: 'var(--s-sea-soft)' },
  { to: '/requests', emoji: '🙋', name: 'מה אפשר לבקש', desc: 'מותר לבקש מהצוות', tint: 'var(--s-grass-soft)' },
  { to: '/going-home', emoji: '🏠', name: 'הביתה', desc: 'איך נגמר היום', tint: 'var(--s-sun-soft)' },
  { to: '/message', emoji: '✉️', name: 'הודעה לצוות', desc: 'בקשה קטנה או תודה', tint: 'var(--s-lilac-soft)' },
  { to: '/feedback', emoji: '💬', name: 'איך היה?', desc: 'לספר לנו במשפט', tint: 'var(--s-sea-soft)' },
]

/**
 * The concept's home: a little illustrated world. Roni and the child's own
 * figure stand together on a hill, and each destination is a place you can
 * walk to — not a row in a menu.
 */
export function WorldPage() {
  const { path } = useVisitReason()
  const [avatar, setAvatar, resetAvatar] = useSessionAvatar()
  const fileRef = useRef<HTMLInputElement>(null)

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setAvatar({ kind: 'photo', value: await fileToAvatarDataUrl(file) })
    } catch {
      /* unreadable image — keep the current avatar */
    }
  }

  return (
    <div className={shell.page}>
      <section className={styles.hero}>
        <div className={styles.heroCast}>
          <span className={styles.heroMe}>
            {avatar.kind === 'photo' ? (
              <img src={avatar.value} alt="הדמות שלי" />
            ) : (
              <span aria-hidden>{avatar.value}</span>
            )}
          </span>
          <Roni size={150} mood="wave" float />
        </div>
        <div className={styles.hill} aria-hidden />

        <div className={styles.heroBubble}>
          <Bubble>
            <strong>שלום! אני רוני.</strong> נעבור את היום הזה יחד — לאט, שלב אחרי
            שלב. אני אהיה כאן בכל מסך, ואפשר תמיד ללחוץ עליי.
          </Bubble>
        </div>
      </section>

      <div className={styles.picker}>
        <span className={styles.pickerLabel}>איך אני נראה/ית במסע?</span>
        <div className={styles.pickerRow}>
          {avatarEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className={`${styles.avatarOpt} ${
                avatar.kind === 'emoji' && avatar.value === emoji ? styles.avatarOptOn : ''
              }`}
              onClick={() => setAvatar({ kind: 'emoji', value: emoji })}
              aria-pressed={avatar.kind === 'emoji' && avatar.value === emoji}
              aria-label={`דמות ${emoji}`}
            >
              <span aria-hidden>{emoji}</span>
            </button>
          ))}
          <button
            type="button"
            className={`${styles.avatarOpt} ${styles.avatarOptWide}`}
            onClick={() => fileRef.current?.click()}
          >
            📷 תמונה שלי
          </button>
          {avatar.kind === 'photo' && (
            <button
              type="button"
              className={`${styles.avatarOpt} ${styles.avatarOptWide}`}
              onClick={resetAvatar}
            >
              ✕ הסרה
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onPickFile}
          style={{ display: 'none' }}
        />
        <span className={styles.pickerNote}>
          התמונה נשארת במכשיר לזמן השימוש בלבד ונמחקת ביציאה. שום דבר לא נשלח.
        </span>
      </div>

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

      <h2 className={styles.worldLabel}>לאן הולכים?</h2>
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
