import { keyed } from '../../../lib/keyed'
import { useI18n } from '../../../hooks/useI18n'
import { Navigate } from '../../nav'
import { Note, TitleRow } from '../components/kit'
import { useParams } from 'react-router-dom'
import { parentProcedure } from '../../../data/parent'
import { ProcedurePanel } from '../../quest/components/ParentInfo'
import i18nUi from '../../../data/i18n/ui.json'
import { LineIcon } from '../../../components/LineIcon'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/**
 * One procedure for the parent: what it is, what it may feel like, how to get
 * ready, what to ask for.
 */
export function BookPage() {
  const { lang, dir } = useI18n()
  const tx = keyed((i18nUi as unknown as Record<'he' | 'en' | 'ru', { procedurePage: Record<string, string> }>)[lang], 'i18n/ui').procedurePage
  const { id } = useParams()
  const procedure = id ? parentProcedure(lang, id) : undefined

  if (!procedure) return <Navigate to="/show" replace />

  return (
    <div className={`${shell.page} ${styles.trailLook}`} dir={dir} lang={lang}>
      <header className={shell.sceneHead}>
        <TitleRow fallback="/show" iconBack>
          <h1 className={`${shell.sceneTitle} ${styles.procTitle}`}>
            <span className={styles.stopIcon} aria-hidden><LineIcon id={procedure.id} emoji={procedure.emoji} size={24} /></span>
            {procedure.title}
          </h1>
        </TitleRow>
      </header>

      <div className={shell.stack} style={{ marginTop: 'var(--space-5)' }}>
        <ProcedurePanel pid={procedure.id} withHead={false} look="home" />

        <Note>{tx.note}</Note>
      </div>
    </div>
  )
}
