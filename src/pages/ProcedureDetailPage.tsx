import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { Section, InfoList } from '../components/ui'
import { getProcedure } from '../data/procedures'
import styles from './ProcedureDetailPage.module.css'

export function ProcedureDetailPage() {
  const { id } = useParams()
  const procedure = id ? getProcedure(id) : undefined
  const [step, setStep] = useState(0)

  if (!procedure) return <Navigate to="/procedures" replace />

  const steps = procedure.story
  const lastStep = step >= steps.length - 1
  const isFinished = step === steps.length - 1

  return (
    <div className="container">
      <div className={styles.hero}>
        <span className={styles.heroEmoji} aria-hidden>
          {procedure.emoji}
        </span>
        <div>
          <h1 className={styles.heroTitle}>{procedure.title}</h1>
          <div className={styles.metaRow}>
            <span className={styles.meta}>⏱️ {procedure.duration}</span>
            <span className={styles.meta}>👤 {procedure.who}</span>
          </div>
        </div>
      </div>

      {/* Story mode — the mascot walks the child through, step by step */}
      <section className={styles.story} aria-label="סיפור הכנה לילד">
        <p className={styles.storyLabel}>🎬 בואו נראה מה יקרה, שלב אחרי שלב</p>

        <div className={styles.bubble} aria-live="polite">
          {steps[step]}
        </div>

        <Mascot
          size={80}
          mood={isFinished ? 'happy' : 'calm'}
          className={styles.storyMascot}
        />

        <div className={styles.dots} aria-hidden>
          {steps.map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i === step ? styles.dotActive : ''}`}
            />
          ))}
        </div>

        <div className={styles.storyNav}>
          <button
            type="button"
            className={`${styles.storyBtn} ${styles.storyBtnGhost}`}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            הקודם
          </button>
          {!lastStep ? (
            <button
              type="button"
              className={styles.storyBtn}
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            >
              הבא ←
            </button>
          ) : (
            <button
              type="button"
              className={styles.storyBtn}
              onClick={() => setStep(0)}
            >
              עוד פעם ↻
            </button>
          )}
        </div>

        {isFinished && <p className={styles.finishNote}>כל הכבוד! עברנו את זה יחד 🌟</p>}
      </section>

      <div className={styles.sections}>
        <Section title="מה קורה" emoji="ℹ️">
          <p>{procedure.what}</p>
        </Section>

        <Section title="מה הילד/ה עשוי/ה להרגיש" emoji="💛">
          <p>{procedure.feel}</p>
        </Section>

        <Section title="איך אפשר להתכונן" emoji="🎒">
          <p>{procedure.prepare}</p>
        </Section>

        <Section title="מה אפשר לבקש מהצוות" emoji="🙋">
          <InfoList items={procedure.adaptations} />
        </Section>
      </div>
    </div>
  )
}
