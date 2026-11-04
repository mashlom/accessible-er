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
/** iconBack: "back" as a bare arrow without a frame (the label stays for screen readers) */
export function TitleRow({ fallback = '/', iconBack = false, children }: { fallback?: string; iconBack?: boolean; children: ReactNode }) {
  const back = useBack()
  const { t, dir } = useI18n()
  const label = t('ui.buttons.back')
  const cls = iconBack ? `${styles.titleBack} ${styles.titleBackIcon}` : styles.titleBack
  const content = iconBack ? <span aria-hidden>{dir === 'rtl' ? '→' : '←'}</span> : label
  return (
    <div className={styles.titleRow}>
      <button type="button" className={`${cls} app-no-print`} onClick={() => back(fallback)} aria-label={iconBack ? label : undefined}>
        {content}
      </button>
      <div className={styles.titleRowMain}>{children}</div>
      <span className={`${cls} ${styles.titleBackSpacer} app-no-print`} aria-hidden>
        {content}
      </span>
    </div>
  )
}

/**
 * Page frame with a big storybook heading. A page opened from a home tile has no "back" beside it (the top bar's
 * home pill does the same); a page opened from another page passes `back`, where back goes without a history.
 */
export function Scene({
  title,
  subtitle,
  back,
  children,
}: {
  title: string
  subtitle?: string
  back?: string
  children: ReactNode
}) {
  const heading = <h1 className={styles.sceneTitle}>{title}</h1>
  return (
    <div className={styles.page}>
      <header className={styles.sceneHead}>
        {back ? <TitleRow fallback={back}>{heading}</TitleRow> : heading}
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
  icon,
  children,
}: {
  title?: string
  emoji?: string
  /** a line icon instead of the emoji, in a lilac square */
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <section className={styles.panel}>
      {title && (
        <h2 className={styles.panelTitle}>
          {icon ? <span className={styles.panelIcon} aria-hidden>{icon}</span> : emoji && <span aria-hidden>{emoji}</span>}
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
