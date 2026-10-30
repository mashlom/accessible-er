import { keyed } from '../../../lib/keyed'
import { useI18n } from '../../../hooks/useI18n'
import { Navigate, Link } from '../../nav'
import { Note } from '../components/kit'
import { useParams } from 'react-router-dom'
import { parentProcedure } from '../../../data/parent'
import { procedureSteps } from '../../../data/child/procedures'
import { ProcedurePanel } from '../../quest/components/ParentInfo'
import i18nUi from '../../../data/i18n/ui.json'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/**
 * One procedure for the parent: what it is, what it may feel like, how to get
 * ready, what to ask for — and the short story the child hears in the game,
 * step by step, so the parent can read it with the child before the procedure.
 */
export function BookPage() {
  const { lang, dir } = useI18n()
  const tx = keyed((i18nUi as unknown as Record<'he' | 'en' | 'ru', { procedurePage: Record<string, string> }>)[lang], 'i18n/ui').procedurePage
  const { id } = useParams()
  const procedure = id ? parentProcedure(lang, id) : undefined

  if (!procedure) return <Navigate to="/show" replace />

  const steps = procedureSteps(lang, procedure.id)
  const stories = steps?.storyVariants ?? (steps?.story ? [{ label: '', steps: steps.story }] : [])

  return (
    <div className={shell.page} dir={dir} lang={lang}>
      <header className={shell.sceneHead}>
        <h1 className={shell.sceneTitle}>
          <span aria-hidden>{procedure.emoji} </span>
          {procedure.title}
        </h1>
      </header>

      <div className={shell.stack} style={{ marginTop: 'var(--space-5)' }}>
        <ProcedurePanel pid={procedure.id} withHead={false} />

        {stories.length > 0 && (
          <section className={styles.storySteps}>
            <span className={styles.storyStepsIcon} aria-hidden>
              📖
            </span>
            <div>
              <h2>{tx.storyTitle}</h2>
              <p>{tx.storyText}</p>
              {stories.map((s) => (
                <div key={s.label}>
                  {s.label && <h3>{s.label}</h3>}
                  <ol>
                    {s.steps.map((step, i) => <li key={i}>{step}</li>)}
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}
        <Note>{tx.note}</Note>
      </div>

      <Link to="/show" className={styles.crossLink}>
        {tx.crossLink}
      </Link>
    </div>
  )
}
