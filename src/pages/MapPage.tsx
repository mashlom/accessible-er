import type { CSSProperties } from 'react'
import { PageHeader } from '../components/ui'
import { mapAreas, loadLabels } from '../data/map'
import styles from './MapPage.module.css'

export function MapPage() {
  return (
    <div className="container">
      <PageHeader
        eyebrow="איפה אנחנו"
        title="מפת המיון"
        subtitle="הכרות עם המרחבים העיקריים. הצבע מראה כמה כל אזור בדרך כלל שקט או עמוס."
      />

      <div className={styles.legend}>
        {(['calm', 'medium', 'busy'] as const).map((key) => (
          <span key={key} className={styles.legendItem}>
            <span className={styles.swatch} style={{ background: loadLabels[key].color }} />
            {loadLabels[key].label}
          </span>
        ))}
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
