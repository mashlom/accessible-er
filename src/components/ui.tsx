import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Mascot } from './Mascot'
import styles from './ui.module.css'

/* ---------- PageHeader ---------- */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  mascot,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  mascot?: boolean
}) {
  return (
    <header className={styles.pageHeader}>
      {mascot && <Mascot size={72} mood="happy" />}
      <div className={styles.pageHeaderText}>
        {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
        <h1 className={styles.pageTitle}>{title}</h1>
        {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
      </div>
    </header>
  )
}

/* ---------- NavCard ---------- */
export function NavCard({
  to,
  emoji,
  title,
  desc,
  tint,
  tintSoft,
}: {
  to: string
  emoji: string
  title: string
  desc: string
  tint?: string
  tintSoft?: string
}) {
  const style = {
    '--tint': tint,
    '--tintSoft': tintSoft,
  } as CSSProperties
  return (
    <Link to={to} className={styles.navCard} style={style}>
      <span className={styles.navIcon} aria-hidden>
        {emoji}
      </span>
      <span className={styles.navBody}>
        <span className={styles.navTitle}>{title}</span>
        <span className={styles.navDesc}>{desc}</span>
      </span>
    </Link>
  )
}

/* ---------- Chip ---------- */
export function Chip({
  children,
  color,
  bg,
}: {
  children: ReactNode
  color?: string
  bg?: string
}) {
  return (
    <span className={styles.chip} style={{ color, background: bg }}>
      {children}
    </span>
  )
}

/* ---------- InfoList ---------- */
export function InfoList({ items }: { items: ReactNode[] }) {
  return (
    <ul className={styles.infoList}>
      {items.map((item, i) => (
        <li key={i} className={styles.infoItem}>
          <span className={styles.infoBullet} aria-hidden>
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/* ---------- Section (a titled card) ---------- */
export function Section({
  title,
  emoji,
  children,
}: {
  title: string
  emoji?: string
  children: ReactNode
}) {
  return (
    <section className={`card ${styles.section}`}>
      <h2 className={styles.sectionTitle}>
        {emoji && <span aria-hidden>{emoji}</span>}
        {title}
      </h2>
      {children}
    </section>
  )
}

export function Note({ children }: { children: ReactNode }) {
  return <p className={styles.note}>{children}</p>
}
