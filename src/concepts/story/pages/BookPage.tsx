import { keyed } from '../../../lib/keyed'
import { useI18n } from '../../../hooks/useI18n'
import { Navigate, Link } from '../../nav'
import { Panel, Note } from '../components/kit'
import { useParams } from 'react-router-dom'
import { parentProcedure } from '../../../data/parent'
import parentUi from '../../../data/parent/ui.json'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/**
 * One procedure for the parent: what it is, what it may feel like, how to get
 * ready, what to ask for. The child's picture-book story is not shown here:
 * it belongs to the child's side (the quest worlds).
 */
export function BookPage() {
  const { lang, dir } = useI18n()
  const tx = keyed((parentUi as unknown as Record<'he' | 'en' | 'ru', { procedurePage: Record<string, string> }>)[lang], 'parent/ui').procedurePage
  const { id } = useParams()
  const procedure = id ? parentProcedure(lang, id) : undefined

  if (!procedure) return <Navigate to="/show" replace />

  return (
    <div className={shell.page} dir={dir} lang={lang}>
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

      <div className={shell.stack} style={{ marginTop: 'var(--space-5)' }}>
        <Panel title={tx.what} emoji="ℹ️">
          <p>{procedure.what}</p>
        </Panel>
        <Panel title={tx.feel} emoji="💛">
          <p>{procedure.feel}</p>
        </Panel>
        <Panel title={tx.prepare} emoji="🎒">
          <p>{procedure.prepare}</p>
        </Panel>
        <Panel title={tx.ask} emoji="🙋">
          <ul className={styles.suggestList}>
            {procedure.adaptations.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <Link to="/distract" className={styles.prepLink} style={{ marginTop: 'var(--space-3)' }}>
            {tx.distract}
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
            <strong>{tx.videoTitle}</strong>
            <p>{tx.videoText.replace('{title}', procedure.title)}</p>
          </div>
        </div>
        <Note>{tx.note}</Note>
      </div>

      <Link to="/show" className={styles.crossLink}>
        {tx.crossLink}
      </Link>
    </div>
  )
}
