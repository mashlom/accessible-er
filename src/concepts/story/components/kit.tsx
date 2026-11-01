import type { ReactNode } from 'react'
import { useBack } from '../../nav'
import { useI18n } from '../../../hooks/useI18n'
import styles from '../story.module.css'

/**
 * The screen's heading with a "back" button beside it, at the start side.
 * An invisible copy of the button holds the other side, so the heading stays
 * in the middle. Back goes through the history, or to `fallback` when the
 * screen was opened straight from a link.
 */
export function TitleRow({ fallback = '/', children }: { fallback?: string; children: ReactNode }) {
  const back = useBack()
  const { t } = useI18n()
  const label = t('ui.buttons.back')
  return (
    <div className={styles.titleRow}>
      <button type="button" className={`${styles.titleBack} app-no-print`} onClick={() => back(fallback)}>
        {label}
      </button>
      <div className={styles.titleRowMain}>{children}</div>
      <span className={`${styles.titleBack} ${styles.titleBackSpacer} app-no-print`} aria-hidden>
        {label}
      </span>
    </div>
  )
}

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
        <TitleRow>
          <h1 className={styles.sceneTitle}>{title}</h1>
        </TitleRow>
        {subtitle && <p className={styles.sceneSub}>{subtitle}</p>}
      </header>
      {children}
    </div>
  )
}

/** A speech bubble with a tail — used wherever Roni or the app "says" something. */
export function Bubble({ children }: { children: ReactNode }) {
  return <div className={`${styles.bubble} ${styles.bubblePlain}`}>{children}</div>
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
