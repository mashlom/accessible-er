import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Navigate, Link } from '../../nav'
import { Roni, type RoniMood } from '../../../components/Roni'
import { AnimatedIcon } from '../../../components/AnimatedIcon'
import { Panel, Note } from '../components/kit'
import { getProcedure } from '../../../data/procedures'
import { useSessionAvatar } from '../../../hooks/useSessionAvatar'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/** Roni's expression follows the arc of the story: curious → calm → proud. */
function moodForStep(step: number, total: number): RoniMood {
  if (total <= 1) return 'happy'
  if (step === 0) return 'curious'
  if (step === total - 1) return 'cheer'
  return 'calm'
}

/**
 * One procedure as a picture book: a big illustrated scene, one short
 * first-person sentence per page, Roni and the child's figure standing in
 * the picture, and a medal at the end. The parent-facing detail (what it
 * is, what it may feel like, what to ask for) sits below the book.
 */
export function BookPage() {
  const { id } = useParams()
  const procedure = id ? getProcedure(id) : undefined
  const [avatar] = useSessionAvatar()
  const [step, setStep] = useState(0)
  const [variant, setVariant] = useState(0)

  // The component stays mounted while navigating between procedures.
  useEffect(() => {
    setStep(0)
    setVariant(0)
  }, [id])

  if (!procedure) return <Navigate to="/show" replace />

  const variants = procedure.storyVariants
  const steps = variants ? (variants[variant] ?? variants[0]).steps : procedure.story
  const isLast = step === steps.length - 1

  return (
    <div className={shell.page}>
      <header className={shell.sceneHead}>
        <h1 className={shell.sceneTitle}>
          <span aria-hidden>{procedure.emoji} </span>
          {procedure.title}
        </h1>
      </header>

      <div className={styles.bookMeta}>
        <span className={styles.bookMetaChip}>⏱️ {procedure.duration}</span>
        <span className={styles.bookMetaChip}>👤 {procedure.who}</span>
      </div>

      <section className={styles.book} aria-label="סיפור הכנה">
        {variants && variants.length > 1 && (
          <div className={styles.variantRow} role="group" aria-label="איך עושים את זה">
            {variants.map((v, i) => (
              <button
                key={v.label}
                type="button"
                className={`${shell.pchip} ${i === variant ? shell.pchipOn : ''}`}
                aria-pressed={i === variant}
                onClick={() => {
                  setVariant(i)
                  setStep(0)
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        <div className={styles.bookScene}>
          <AnimatedIcon emoji={procedure.emoji} size={124} className={styles.bookSceneArt} />
          <span className={styles.bookRoni} aria-hidden>
            <Roni size={104} mood={moodForStep(step, steps.length)} decorative />
          </span>
          <span className={styles.bookMe} aria-hidden>
            {avatar.kind === 'photo' ? <img src={avatar.value} alt="" /> : avatar.value}
          </span>
        </div>

        <p className={styles.bookText} aria-live="polite">
          {steps[step]}
        </p>

        <div className={styles.pageDots} aria-hidden>
          {steps.map((_, i) => (
            <span
              key={i}
              className={`${styles.pageDot} ${i === step ? styles.pageDotOn : ''}`}
            />
          ))}
        </div>

        <div className={styles.bookNav}>
          <button
            type="button"
            className={shell.ghostBtn}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            → הקודם
          </button>
          {!isLast ? (
            <button
              type="button"
              className={shell.bigBtn}
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            >
              הבא ←
            </button>
          ) : (
            <button type="button" className={shell.bigBtn} onClick={() => setStep(0)}>
              עוד פעם ↻
            </button>
          )}
        </div>
      </section>

      {isLast && (
        <div className={styles.medal}>
          <span style={{ fontSize: '2.6rem' }} aria-hidden>
            🏅
          </span>
          <p className={styles.medalTitle}>כל הכבוד! עברנו את הסיפור עד הסוף</p>
          <p style={{ color: 'var(--s-ink-soft)', marginTop: 4 }}>
            עכשיו כבר יודעים מה יקרה. אני אהיה שם איתכם.
          </p>
        </div>
      )}

      <div className={shell.stack} style={{ marginTop: 'var(--space-5)' }}>
        <Panel title="מה קורה" emoji="ℹ️">
          <p>{procedure.what}</p>
        </Panel>
        <Panel title="מה אפשר להרגיש" emoji="💛">
          <p>{procedure.feel}</p>
        </Panel>
        <Panel title="איך מתכוננים" emoji="🎒">
          <p>{procedure.prepare}</p>
        </Panel>
        <Panel title="מה אפשר לבקש מהצוות" emoji="🙋">
          <ul className={styles.suggestList}>
            {procedure.adaptations.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <Link
            to="/distract"
            className={styles.prepLink}
            style={{ marginTop: 'var(--space-3)' }}
          >
            <span aria-hidden>🫧</span> לפתוח פינת הסחת דעת בזמן הפעולה
          </Link>
        </Panel>

        {/* Placeholder, not a feature: the spec and the first round of feedback
            both ask for filmed clips and social stories alongside the text.
            Real footage has to be produced at Laniado — this shows the team
            where it would sit. */}
        <div className={styles.videoSlot}>
          <span className={styles.videoSlotIcon} aria-hidden>
            🎬
          </span>
          <div>
            <strong>כאן ייכנס סרטון קצר</strong>
            <p>
              סרטון אמיתי של {procedure.title} מהמלר״ד בלניאדו, או סיפור חברתי
              מצולם. בדמו זה שמור מקום בלבד — הצילום צריך להיעשות במחלקה עצמה.
            </p>
          </div>
        </div>
        <Note>
          הסדר והזמנים עשויים להשתנות לפי החלטת הצוות והעומס במיון. הסיפור הוא הכנה
          כללית, לא הבטחה.
        </Note>
      </div>

      <Link to="/show" className={styles.crossLink}>
        🎭 לכל הסיפורים ←
      </Link>
    </div>
  )
}
