import type { CSSProperties } from 'react'
import { Scene, Bubble, Note } from '../components/kit'
import {
  mapAreas,
  loadLabels,
  sensoryChannels,
  sensoryColor,
  sensoryColorSoft,
  SENSORY_MAX,
} from '../../../data/map'
import type { MapArea } from '../../../data/types'
import styles from '../pages.module.css'

const roomTint: Record<MapArea['load'], string> = {
  calm: 'var(--s-grass-soft)',
  medium: 'var(--s-sun-soft)',
  busy: 'var(--s-coral-soft)',
}

const loadFace: Record<MapArea['load'], string> = {
  calm: '😌',
  medium: '🙂',
  busy: '😵‍💫',
}

/**
 * The orientation map as a row of little rooms. On top of "where is it",
 * every room carries the sensory layer the spec asks for — how loud, how
 * bright, how smelly, how crowded — and where you usually go next.
 */
export function MapPage() {
  return (
    <Scene
      title="איפה אנחנו?"
      subtitle="לכל מקום במיון יש אופי משלו. כאן רואים איפה רועש, איפה אפשר לנוח, ולאן ממשיכים משם."
    >
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>
          העיגולים הצבעוניים מספרים כמה <strong>רעש, אור, ריח ואנשים</strong> יש בכל
          מקום. ירוק = מעט, אדום = הרבה.
        </Bubble>
      </div>

      <div className={styles.rooms}>
        {mapAreas.map((area) => {
          const load = loadLabels[area.load]
          return (
            <article
              key={area.id}
              className={styles.room}
              style={{ '--roomTint': roomTint[area.load] } as CSSProperties}
            >
              <div className={styles.roomTop}>
                <span className={styles.roomEmoji} aria-hidden>
                  {area.emoji}
                </span>
                <div>
                  <h2 className={styles.roomName}>{area.name}</h2>
                  <span className={styles.loadBadge} style={{ color: load.color }}>
                    <span aria-hidden>{loadFace[area.load]}</span>
                    {load.label}
                  </span>
                </div>
              </div>

              <div className={styles.roomBody}>
                <p>{area.note}</p>

                <div className={styles.weather}>
                  {sensoryChannels.map((ch) => {
                    const level = area.sensory[ch.key]
                    return (
                      <span
                        key={ch.key}
                        className={styles.weatherChip}
                        style={{ background: sensoryColorSoft(level) }}
                        title={`${ch.label}: ${level} מתוך ${SENSORY_MAX}`}
                      >
                        <span aria-hidden>{ch.emoji}</span>
                        {ch.label}
                        <span className={styles.weatherBars} aria-hidden>
                          {Array.from({ length: SENSORY_MAX }, (_, i) => (
                            <span
                              key={i}
                              className={styles.weatherBar}
                              style={
                                i < level
                                  ? { background: sensoryColor(level) }
                                  : undefined
                              }
                            />
                          ))}
                        </span>
                        <span className="visually-hidden">
                          {level} מתוך {SENSORY_MAX}
                        </span>
                      </span>
                    )
                  })}
                </div>

                {area.next && (
                  <p className={styles.roomNext}>
                    <span aria-hidden>➡️ </span>
                    ממשיכים מכאן אל: {area.next}
                  </p>
                )}
              </div>
            </article>
          )
        })}
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Note>
          המפה והדירוג החושי הם הערכה ראשונית לצורך הדמו, ויעודכנו יחד עם צוות המלר״ד
          ואלו״ט. מיקום מדויק של אזורים ייקבע לפי המחלקה בפועל.
        </Note>
      </div>
    </Scene>
  )
}
