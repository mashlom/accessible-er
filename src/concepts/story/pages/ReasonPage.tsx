import { Fragment } from 'react'
import { Link } from '../../nav'
import { Scene, Panel, Note } from '../components/kit'
import { parentPaths } from '../../../data/parent/paths'
import homeTexts from '../../../data/parent/home.json'
import { useI18n } from '../../../hooks/useI18n'
import { useVisitReason } from '../../../hooks/useVisitReason'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/** "Why we came today?" — the answer draws the family's stepping-stone route. */
export function ReasonPage() {
  const { reasonId, setReason, clearReason } = useVisitReason()
  const { lang, dir } = useI18n()
  const tx = homeTexts[lang].reason
  const all = parentPaths(lang)
  const path = reasonId ? all.find((p) => p.id === reasonId) : undefined

  return (
    <div dir={dir} lang={lang} style={{ display: 'contents' }}>
    <Scene title={tx.title} subtitle={tx.subtitle}>
      <div className={styles.reasonGrid} role="radiogroup" aria-label={tx.aria}>
        {all.map((p) => {
          const on = p.id === reasonId
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={on}
              className={`${styles.reasonBtn} ${on ? styles.reasonBtnOn : ''}`}
              onClick={() => setReason(p.id)}
            >
              <span className={styles.reasonEmoji} aria-hidden>
                {p.emoji}
              </span>
              <span>
                <span className={styles.reasonName}>{p.label}</span>
                <span className={styles.reasonBlurb}>{p.blurb}</span>
              </span>
              <span className={styles.reasonCheck} aria-hidden>
                {on ? '✓' : ''}
              </span>
            </button>
          )
        })}
      </div>

      {path && (
        <div className={shell.stack} style={{ marginTop: 'var(--space-4)' }}>
          <Panel title={tx.routeHeading} emoji={path.emoji}>
            <div className={styles.stones}>
              {path.route.map((stop, i) => (
                <Fragment key={i}>
                  {i > 0 && (
                    <span className={styles.stoneArrow} aria-hidden>
                      ←
                    </span>
                  )}
                  <span
                    className={`${styles.stone} ${stop.optional ? styles.stoneOptional : ''}`}
                  >
                    {stop.procedureId ? (
                      <Link to={`/show/${stop.procedureId}`}>{stop.title}</Link>
                    ) : (
                      stop.title
                    )}
                    {stop.optional && <span aria-hidden>{tx.optional}</span>}
                  </span>
                </Fragment>
              ))}
            </div>
            <div style={{ marginTop: 'var(--space-3)' }}>
              <Note>
                {tx.note}
              </Note>
            </div>
          </Panel>

          <div className={styles.actions}>
            <Link to="/trail" className={shell.bigBtn}>
              {tx.toTrail}
            </Link>
            <button type="button" className={shell.ghostBtn} onClick={clearReason}>
              {tx.clear}
            </button>
          </div>
        </div>
      )}
    </Scene>
    </div>
  )
}
