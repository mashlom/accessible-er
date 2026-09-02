import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { concepts } from '../concepts/registry'
import styles from './MenuPage.module.css'

/**
 * Landing screen of the demo: a menu of UI/UX concepts over the same
 * content. It is aimed at the ER team and at אלו״ט — they open a concept,
 * walk through it, and decide what the real app should feel like.
 */
export function MenuPage() {
  return (
    <div className={styles.page}>
      <a href="#main" className="skip-link">
        דילוג לתוכן
      </a>

      <main id="main" className={styles.inner}>
        <header className={styles.hero}>
          <p className={styles.kicker}>מלר״ד ילדים · לניאדו</p>
          <h1 className={styles.title}>מה שלומי?</h1>
          <p className={styles.subtitle}>
            כלי להנגשת הביקור במיון לילדים אוטיסטים ולמשפחותיהם.
            <br />
            כאן אפשר להתנסות בכמה כיווני עיצוב — <strong>אותו תוכן בדיוק</strong>,
            חוויית שימוש שונה.
          </p>
        </header>

        <p className={styles.sectionLabel}>בחרו קונספט להתנסות</p>

        <nav className={styles.list}>
          {concepts.map((c, i) => (
            <Link
              key={c.id}
              to={c.base}
              className={styles.card}
              style={
                { '--accent': c.accent, '--accentSoft': c.accentSoft } as CSSProperties
              }
            >
              <span className={styles.cardNum} aria-hidden>
                {i + 1}
              </span>
              <span className={styles.cardEmoji} aria-hidden>
                {c.emoji}
              </span>
              <span className={styles.cardBody}>
                <span className={styles.cardName}>{c.name}</span>
                <span className={styles.cardTagline}>{c.tagline}</span>
                <span className={styles.cardDesc}>{c.description}</span>
                <span className={styles.cardBullets}>
                  {c.bullets.map((b) => (
                    <span key={b} className={styles.bullet}>
                      {b}
                    </span>
                  ))}
                </span>
                <span className={styles.cardCta}>לכניסה לקונספט ←</span>
              </span>
            </Link>
          ))}
        </nav>

        <section className={styles.about}>
          <h2 className={styles.aboutTitle}>על הדמו הזה</h2>
          <p>
            התוכן — שלבי הביקור, ההכנה לפרוצדורות, המפה, כרטיס ההתאמות וההנחיות
            להורים — הוא פרי עבודתם של <strong>אלו״ט</strong> ושל צוות המלר״ד, ומשותף
            לכל הקונספטים. מה שמשתנה בין הקונספטים הוא הממשק בלבד.
          </p>
          <p>
            זו אינה האפליקציה הסופית. מטרתה להראות קונספט ולאפשר לצוות הרפואי להחליט
            איך תיראה הגרסה האמיתית.
          </p>
          <p className={styles.disclaimer}>
            הכלי אינו מחליף את הצוות הרפואי ואינו מספק ייעוץ רפואי. אין צורך להזין שם
            או פרטים מזהים, והמידע נשמר במכשיר בלבד.
          </p>
          <p className={styles.disclaimer}>
            האנימציות בקונספט "המסע של רוני" הן{' '}
            <a
              href="https://googlefonts.github.io/noto-emoji-animation/"
              className={styles.creditLink}
              target="_blank"
              rel="noreferrer"
            >
              Noto Animated Emoji
            </a>{' '}
            של Google, ברישיון{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              className={styles.creditLink}
              target="_blank"
              rel="noreferrer"
            >
              CC BY 4.0
            </a>
            . דמות רוני מקורית לפרויקט.
          </p>
        </section>
      </main>
    </div>
  )
}
