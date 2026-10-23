import { keyed } from '../../../lib/keyed'
import type { CSSProperties } from 'react'
import { Scene, Bubble, Note } from '../components/kit'
import { loadLabels } from '../../../data/map'
import { parentMapAreas, parentLoadLabel } from '../../../data/parent/map'
import { SensoryBar } from '../../../components/SensoryBar'
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
  const { lang, dir, t } = useI18n()
  const tx = keyed(homeTexts[lang], 'parent/home').mapPage
  return (
    <div dir={dir} lang={lang} style={{ textAlign: 'start' }}>
    <Scene title={t('ui.tiles.map.title')} subtitle={tx.subtitle}>
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

                <div className={styles.roomSense}>
                  <SensoryBar sensory={area.sensory} />
                </div>

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
