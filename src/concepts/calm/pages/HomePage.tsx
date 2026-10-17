import { useRef } from 'react'
import { Link } from '../../nav'
import { Mascot } from '../components/Mascot'
import { NavCard } from '../components/ui'
import { useVisitReason } from '../../../hooks/useVisitReason'
import { useI18n } from '../../../hooks/useI18n'
import {
  avatarEmojis,
  fileToAvatarDataUrl,
  useSessionAvatar,
} from '../../../hooks/useSessionAvatar'
import parentUi from '../../../data/parent/ui.json'
import styles from './HomePage.module.css'

export function HomePage() {
  const { lang } = useI18n()
  // the tiles' titles and descriptions: src/data/parent/ui.json, in the chosen language
  const tiles = (parentUi as unknown as Record<'he' | 'en' | 'ru', { tiles: Record<string, { title: string; desc: string }> }>)[lang]?.tiles ?? (parentUi as unknown as Record<'he', { tiles: Record<string, { title: string; desc: string }> }>).he.tiles
  const { path } = useVisitReason()
  const [avatar, setAvatar, resetAvatar] = useSessionAvatar()
  const fileRef = useRef<HTMLInputElement>(null)

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-picking the same file
    if (!file) return
    try {
      const value = await fileToAvatarDataUrl(file)
      setAvatar({ kind: 'photo', value })
    } catch {
      /* if the image can't be read, just keep the current avatar */
    }
  }

  return (
    <div className="container">
      <section className={styles.hero}>
        <Mascot size={120} mood="wave" className={styles.heroMascot} />
        <h1 className={styles.heroTitle}>שלום, אני רוני 👋</h1>
        <p className={styles.heroSubtitle}>
          אני כאן כדי ללוות אתכם ואת הילד/ה במיון. נעבור יחד, שלב אחרי שלב, בקצב
          שלכם.
        </p>

        <div className={styles.avatarPicker}>
          <span className={styles.avatarPickerLabel}>בחרו איך תיראו במסע:</span>
          <div className={styles.avatarPreview} aria-hidden>
            {avatar.kind === 'photo' ? (
              <img src={avatar.value} alt="" className={styles.avatarPreviewImg} />
            ) : (
              <span className={styles.avatarPreviewEmoji}>{avatar.value}</span>
            )}
          </div>
          <div className={styles.avatarOptions}>
            {avatarEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`${styles.avatarChip} ${
                  avatar.kind === 'emoji' && avatar.value === emoji ? styles.avatarChipOn : ''
                }`}
                onClick={() => setAvatar({ kind: 'emoji', value: emoji })}
                aria-pressed={avatar.kind === 'emoji' && avatar.value === emoji}
              >
                {emoji}
              </button>
            ))}
            <button
              type="button"
              className={styles.avatarChip}
              onClick={() => fileRef.current?.click()}
            >
              📷 תמונה
            </button>
            {avatar.kind === 'photo' && (
              <button type="button" className={styles.avatarChip} onClick={resetAvatar}>
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
          <span className={styles.avatarNote}>
            התמונה נשארת במכשיר לזמן השימוש בלבד ונמחקת ביציאה. שום דבר לא נשלח או נשמר.
          </span>
        </div>
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
          title={tiles["card"].title}
          desc={tiles["card"].desc}
          tint="#a9d2ce"
          tintSoft="var(--c-primary-soft)"
        />
        <NavCard
          to="/journey"
          emoji="🧭"
          title={tiles["journey"].title}
          desc={tiles["journey"].desc}
          tint="#a9d2ce"
          tintSoft="var(--c-primary-soft)"
        />
        <NavCard
          to="/wait-times"
          emoji="⏱️"
          title={tiles["wait-times"].title}
          desc={tiles["wait-times"].desc}
          tint="#d4a574"
          tintSoft="#f0e4d5"
        />
        <NavCard
          to="/procedures"
          emoji="🎬"
          title={tiles["procedures"].title}
          desc={tiles["procedures"].desc}
          tint="#cbb8e6"
          tintSoft="var(--c-lilac-soft)"
        />
        <NavCard
          to="/map"
          emoji="🗺️"
          title={tiles["map"].title}
          desc={tiles["map"].desc}
          tint="#a7cbe6"
          tintSoft="var(--c-sky-soft)"
        />
        <NavCard
          to="/calm"
          emoji="💗"
          title={tiles["calm"].title}
          desc={tiles["calm"].desc}
          tint="#efc0ac"
          tintSoft="var(--c-alert-soft)"
        />
        <NavCard
          to="/requests"
          emoji="🙋"
          title={tiles["requests"].title}
          desc={tiles["requests"].desc}
          tint="#a9dcb8"
          tintSoft="var(--c-calm-soft)"
        />
        <NavCard
          to="/discharge"
          emoji="🏠"
          title={tiles["discharge"].title}
          desc={tiles["discharge"].desc}
          tint="#bfe3df"
          tintSoft="var(--c-primary-soft)"
        />
        <NavCard
          to="/reason"
          emoji="💭"
          title={tiles["reason"].title}
          desc={tiles["reason"].desc}
          tint="#f1d8bf"
          tintSoft="var(--c-accent-soft)"
        />
        <NavCard
          to="/message"
          emoji="✉️"
          title={tiles["message"].title}
          desc={tiles["message"].desc}
          tint="#cbb8e6"
          tintSoft="var(--c-lilac-soft)"
        />
        <NavCard
          to="/feedback"
          emoji="💬"
          title={tiles["feedback"].title}
          desc={tiles["feedback"].desc}
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
