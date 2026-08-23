import type { CSSProperties } from 'react'
import { PageHeader } from '../components/ui'
import {
  mapAreas,
  loadLabels,
  sensoryChannels,
  sensoryColor,
  SENSORY_MAX,
} from '../data/map'
import styles from './MapPage.module.css'

export function MapPage() {
  return (
    <div className="container">
      <PageHeader
        eyebrow="איפה אנחנו"
        title="מפת המיון"
        subtitle="לכל אזור מוצג עומס חושי לפי ערוץ — רעש, אור, ריח ואנשים. המספר והצבע מראים כמה גירוי צפוי בכל ערוץ (0 = מעט, 5 = הרבה)."
      />

      <div className={styles.legend}>
        {(['calm', 'medium', 'busy'] as const).map((key) => (
          <span key={key} className={styles.legendItem}>
            <span className={styles.swatch} style={{ background: loadLabels[key].color }} />
            {loadLabels[key].label}
          </span>
        ))}
      </div>

      <div className={styles.sensoryLegend}>
        <span>0 = מעט גירוי</span>
        <span className={styles.sensoryScale} aria-hidden>
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <span key={n} style={{ background: sensoryColor(n) }} />
          ))}
        </span>
        <span>{SENSORY_MAX} = הרבה גירוי</span>
      </div>

      <div className={styles.areas}>
        {mapAreas.map((area) => {
          const color = loadLabels[area.load].color
          const style = { '--loadColor': color } as CSSProperties
          return (
            <div key={area.id} className={styles.area} style={style}>
              <span className={styles.areaEmoji} aria-hidden>
                {area.emoji}
              </span>
              <div className={styles.areaBody}>
                <div className={styles.areaHead}>
                  <span className={styles.areaName}>{area.name}</span>
                  <span className={styles.loadBadge}>{loadLabels[area.load].label}</span>
                </div>
                <p className={styles.areaNote}>{area.note}</p>
                <div className={styles.sensory} aria-label="עומס חושי לפי ערוץ">
                  {sensoryChannels.map((ch) => (
                    <div key={ch.key} className={styles.sensoryItem}>
                      <span className={styles.sensoryLabel}>
                        <span aria-hidden>{ch.emoji}</span> {ch.label}
                      </span>
                      <span
                        className={styles.sensoryValue}
                        style={{ background: sensoryColor(area.sensory[ch.key]) }}
                      >
                        {area.sensory[ch.key]}
                      </span>
                    </div>
                  ))}
                </div>
                {area.next && (
                  <p className={styles.areaNext}>
                    <span aria-hidden>👣</span> מכאן ממשיכים: {area.next}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
