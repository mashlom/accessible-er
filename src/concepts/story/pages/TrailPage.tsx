import { useI18n } from '../../../hooks/useI18n'
import { useState } from 'react'
import { Link } from '../../nav'
import { Note } from '../components/kit'
import { getStageIndex } from '../../../data/journey'
import { parentJourney, parentProcedure } from '../../../data/parent'
import { parentPaths } from '../../../data/parent/paths'
import homeTexts from '../../../data/parent/home.json'
import { useVisitReason } from '../../../hooks/useVisitReason'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { DAY_MS } from '../../../lib/storage'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/**
 * "השביל שלנו" — the visit as a winding trail of stops. The child's own
 * figure stands on the current stop, passed stops get a star. Opening a
 * stop tells what it means, what may be hard, and what can be asked for
 * (the spec's status + meaning + action, not status alone).
 *
 * Shares `journey-stage` with the calm concept, so a family that switches
 * concepts mid-visit keeps their place.
 */
export function TrailPage() {
  const { lang, dir } = useI18n()
  const tx = homeTexts[lang].trail
  const home = homeTexts[lang]
  const { reasonId } = useVisitReason()
  const path = reasonId ? parentPaths(lang).find((p) => p.id === reasonId) : undefined
  const [currentId, setCurrentId] = usePersistentState<string | null>(
    'journey-stage',
    null,
    DAY_MS,
  )
  const [openId, setOpenId] = useState<string | null>(currentId ?? parentJourney(lang)[0].id)

  const currentIndex = currentId ? getStageIndex(currentId) : -1

  return (
    <div className={shell.page} dir={dir} lang={lang}>
      <header className={styles.trailHead}>
        <h1 className={styles.trailTitle}>
          {tx.title}
          <span className={styles.trailLead}>{tx.lead}</span>
        </h1>
        <p className={styles.trailSub}>{tx.subtitle}</p>
      </header>
      {path ? (
        <div className={styles.reasonStrip}>
          <span className={styles.reasonStripEmoji} aria-hidden>
            {path.emoji}
          </span>
          <span className={styles.reasonStripText}>
            <span className={styles.reasonStripLabel}>{home.reasonLabel}</span>
            {path.label}
          </span>
          <Link to="/reason" className={styles.reasonStripChange}>
            {home.reasonChange}
          </Link>
        </div>
      ) : (
        <Link to="/reason" className={styles.reasonStrip}>
          <span className={styles.reasonStripText}>{home.reasonAsk}</span>
        </Link>
      )}

      <ol className={styles.trail}>
        {parentJourney(lang).map((stage, i) => {
          const isHere = stage.id === currentId
          const isDone = currentIndex > -1 && i < currentIndex
          const isOpen = openId === stage.id
          return (
            <li key={stage.id} className={styles.stop}>
              <button
                type="button"
                className={`${styles.stopDot} ${isDone ? styles.stopDone : ''} ${
                  isHere ? styles.stopHere : ''
                }`}
                onClick={() => setOpenId(isOpen ? null : stage.id)}
                aria-expanded={isOpen}
                aria-label={`${stage.title}${isHere ? tx.hereSuffix : ''}`}
              >
                <span aria-hidden>{isDone ? '✓' : isHere ? '' : i + 1}</span>
              </button>

              <div className={`${styles.stopCard} ${isHere ? styles.stopCardHere : ''}`}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : stage.id)}
                  aria-expanded={isOpen}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'block',
                    width: '100%',
                  }}
                >
                  <span className={styles.stopTitleRow}>
                    <span className={styles.stopTitle}>
                      <span aria-hidden>{stage.emoji} </span>
                      {isHere && '📍 '}
                      {stage.title}
                    </span>
                    {stage.waitRange && (
                      <span className={styles.stopWait}>
                        {stage.waitKind === 'duration' ? '⏱️' : '⏳'} {stage.waitRange}
                      </span>
                    )}
                  </span>
                  <span className={styles.stopMeaning}>{stage.meaning}</span>
                </button>

                {isOpen && (
                  <div className={styles.stopDetail}>
                    <p className={styles.detailRow}>
                      <span className={styles.detailLabel}>{tx.whatHappens}</span>
                      {stage.whatHappens}
                    </p>
                    <p className={styles.detailRow}>
                      <span className={styles.detailLabel}>{tx.challenge}</span>
                      {stage.challenge}
                    </p>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>{tx.canAsk}</span>
                      <ul className={styles.askList}>
                        {stage.canAsk.map((a) => (
                          <li key={a}>{a}</li>
                        ))}
                      </ul>
                    </div>

                    {stage.procedureIds && stage.procedureIds.length > 0 && (
                      <div className={styles.prepRow}>
                        {stage.procedureIds.map((pid) => {
                          const p = parentProcedure(lang, pid)
                          if (!p) return null
                          return (
                            <Link key={pid} to={`/show/${pid}`} className={styles.prepLink}>
                              <span aria-hidden>{p.emoji}</span>
                              {p.title}
                            </Link>
                          )
                        })}
                      </div>
                    )}

                    <button
                      type="button"
                      className={`${styles.hereBtn} ${isHere ? styles.hereBtnOn : ''}`}
                      onClick={() => setCurrentId(isHere ? null : stage.id)}
                      aria-pressed={isHere}
                    >
                      {isHere ? tx.hereOn : tx.markHere}
                    </button>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Note>{tx.note}</Note>
      </div>

      <Link to="/going-home" className={styles.crossLink}>
        {tx.crossLink}
      </Link>
    </div>
  )
}
