import { keyed } from '../../../lib/keyed'
import { useI18n } from '../../../hooks/useI18n'
import { Navigate, Link } from '../../nav'
import { Note } from '../components/kit'
import { useParams } from 'react-router-dom'
import { parentProcedure } from '../../../data/parent'
import { ProcedurePanel } from '../../quest/components/ParentInfo'
import i18nUi from '../../../data/i18n/ui.json'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/**
 * One procedure for the parent: what it is, what it may feel like, how to get
 * ready, what to ask for. The child's picture-book story is not shown here:
 * it belongs to the child's side (the quest worlds).
 */
export function BookPage() {
  const { lang, dir } = useI18n()
  const tx = keyed((i18nUi as unknown as Record<'he' | 'en' | 'ru', { procedurePage: Record<string, string> }>)[lang], 'i18n/ui').procedurePage
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

      <div className={shell.stack} style={{ marginTop: 'var(--space-5)' }}>
        <ProcedurePanel pid={procedure.id} />

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
