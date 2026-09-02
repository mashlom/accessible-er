import type { ReactNode } from 'react'
import styles from '../story.module.css'

/** Page frame with a big storybook heading. */
export function Scene({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div className={styles.page}>
      <header className={styles.sceneHead}>
        <h1 className={styles.sceneTitle}>{title}</h1>
        {subtitle && <p className={styles.sceneSub}>{subtitle}</p>}
      </header>
      {children}
    </div>
  )
}

/** A speech bubble with a tail — used wherever Roni or the app "says" something. */
export function Bubble({ children }: { children: ReactNode }) {
  return (
    <div className={styles.bubble}>
      {children}
      <span className={styles.bubbleTail} aria-hidden />
    </div>
  )
}

export function Panel({
  title,
  emoji,
  children,
}: {
  title?: string
  emoji?: string
  children: ReactNode
}) {
  return (
    <section className={styles.panel}>
      {title && (
        <h2 className={styles.panelTitle}>
          {emoji && <span aria-hidden>{emoji}</span>}
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

export function Note({ children }: { children: ReactNode }) {
  return <p className={styles.note}>{children}</p>
}

export function ChipButton({
  on,
  onClick,
  children,
}: {
  on: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className={`${styles.pchip} ${on ? styles.pchipOn : ''}`}
      aria-pressed={on}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
