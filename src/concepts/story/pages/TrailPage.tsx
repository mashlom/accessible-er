import { keyed } from '../../../lib/keyed'
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
import { LineIcon } from '../../../components/LineIcon'
import { withoutEmoji } from '../../quest/components/ButtonIcon'

/**
 * "Our trail" — the visit as a winding trail of stops. The child's own
 * figure stands on the current stop, passed stops get a star. Opening a
 * stop tells what it means, what may be hard, and what can be asked for
 * (the spec's status + meaning + action, not status alone).
 *
 * Shares `journey-stage` with the calm concept, so a family that switches
 * concepts mid-visit keeps their place.
 */
export function TrailPage() {
  const { lang, dir, t } = useI18n()
  const tx = keyed(homeTexts[lang], 'parent/home').trail
  const home = keyed(homeTexts[lang], 'parent/home')
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
    <div className={`${shell.page} ${styles.trailLook}`} dir={dir} lang={lang}>
      <header className={styles.trailHead}>
        <h1 className={styles.trailTitle}>
          {t('ui.tiles.journey.title')}
          <span className={styles.trailLead}>{tx.lead}</span>
        </h1>
        <p className={styles.trailSub}>{tx.together}</p>
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
            <li key={stage.id} className={`${styles.stop} ${currentIndex > -1 && i < currentIndex ? styles.stopPassed : ''}`}>
              {/* as in Shevi's design: the station's circle inside its card, beside the icon and the name */}
              <div className={`${styles.stopCard} ${isHere ? styles.stopCardHere : ''}`}>
                <button
                  type="button"
                  className={styles.stopHead}
                  onClick={() => setOpenId(isOpen ? null : stage.id)}
                  aria-expanded={isOpen}
                  aria-label={`${stage.title}${isHere ? tx.hereSuffix : ''}`}
                >
                  <span
                    className={`${styles.stopDot} ${isDone ? styles.stopDone : ''} ${isHere ? styles.stopHere : ''}`}
                    aria-hidden
                  >
                    {isDone ? '✓' : i + 1}
                  </span>
                  <span className={styles.stopIcon} aria-hidden>
                    <LineIcon id={`stage-${stage.id}`} emoji={stage.emoji} size={22} />
                  </span>
                  <span className={styles.stopTitle}>{stage.title}</span>
                </button>

                {isOpen && (
                  <div className={styles.stopDetail}>
                    <p className={styles.stopMeaning}>{stage.meaning}</p>
                    <div className={styles.detailBox}>
                      <h3 className={styles.detailLabel}>{t('ui.labels.adult.whatHappens')}</h3>
                      <p>{stage.whatHappens}</p>
                    </div>
                    <div className={styles.detailBox}>
                      <h3 className={styles.detailLabel}>{t('ui.labels.adult.challenge')}</h3>
                      <p>{stage.challenge}</p>
                    </div>
                    <div className={styles.detailBox}>
                      <h3 className={styles.detailLabel}>{t('ui.tiles.requests.title')}</h3>
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
                              {p.title}
                            </Link>
                          )
                        })}
                      </div>
                    )}

                    <div className={styles.stopFoot}>
                      {stage.waitRange ? (
                        <span className={styles.stopWait}>
                          <img src={`${import.meta.env.BASE_URL}icons/hourglass.svg`} alt="" aria-hidden width={16} height={16} /> {stage.waitRange}
                        </span>
                      ) : <span />}
                      <button
                        type="button"
                        className={`${styles.hereBtn} ${isHere ? styles.hereBtnOn : ''}`}
                        onClick={() => setCurrentId(isHere ? null : stage.id)}
                        aria-pressed={isHere}
                      >
                        {isHere ? tx.hereOn : t('ui.labels.adult.weAreHere')}
                      </button>
                    </div>
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

      {/* the two ends of the visit, as the last sheet's answers in the worlds: Shevi's house and the red Star of David */}
      <div className={styles.outcomeLinks}>
        <Link to="/going-home" className={styles.crossLink}>
          <span className={styles.stopIcon} aria-hidden><LineIcon id="going-home" size={22} /></span>
          {withoutEmoji(t('ui.buttons.discharge'))}
        </Link>
        <Link to="/going-home?stay=1" className={styles.crossLink}>
          <span className={styles.stopIcon} aria-hidden><LineIcon id="tile-admission" size={22} /></span>
          {withoutEmoji(t('ui.buttons.admission'))}
        </Link>
      </div>
    </div>
  )
}
