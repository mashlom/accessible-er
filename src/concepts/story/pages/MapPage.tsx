import type { CSSProperties } from 'react'
import { Scene, Bubble, Note } from '../components/kit'
import {
  loadLabels,
  sensoryChannels,
  sensoryColor,
  sensoryColorSoft,
  SENSORY_MAX,
} from '../../../data/map'
import { parentMapAreas, parentLoadLabel, parentChannelLabel } from '../../../data/parent/map'
import homeTexts from '../../../data/parent/home.json'
import { useI18n } from '../../../hooks/useI18n'
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
  const { lang, dir } = useI18n()
  const tx = homeTexts[lang].mapPage
  return (
    <div dir={dir} lang={lang} style={{ textAlign: 'start' }}>
    <Scene title={tx.title} subtitle={tx.subtitle}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>{tx.bubble}</Bubble>
      </div>

      <div className={styles.rooms}>
        {parentMapAreas(lang).map((area) => {
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
                    {parentLoadLabel(lang, area.load)}
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
                        title={`${parentChannelLabel(lang, ch.key)}: ${tx.ofFive.replace('{level}', String(level)).replace('{max}', String(SENSORY_MAX))}`}
                      >
                        <span aria-hidden>{ch.emoji}</span>
                        {parentChannelLabel(lang, ch.key)}
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
                          {tx.ofFive.replace('{level}', String(level)).replace('{max}', String(SENSORY_MAX))}
                        </span>
                      </span>
                    )
                  })}
                </div>

                {area.next && (
                  <p className={styles.roomNext}>
                    <span aria-hidden>➡️ </span>
                    {tx.next} {area.next}
                  </p>
                )}
              </div>
            </article>
          )
        })}
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Note>{tx.note}</Note>
      </div>
    </Scene>
    </div>
  )
}
