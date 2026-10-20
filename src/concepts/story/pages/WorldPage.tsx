import type { CSSProperties } from 'react'
import { Link } from '../../nav'
import { openHelper } from '../../../components/helper/helperStore'
import { LanguagePicker } from '../../../components/LanguagePicker'
import { useI18n } from '../../../hooks/useI18n'
import { useVisitReason } from '../../../hooks/useVisitReason'
import { parentPaths } from '../../../data/parent/paths'
import homeTexts from '../../../data/parent/home.json'
import parentUi from '../../../data/parent/ui.json'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/** The stages of the home, in the design's order; the names and descriptions come from parent/home.json */
const destinations = [
  { to: '/trail', id: 'trail', emoji: '🛤️', tint: 'var(--s-mint-soft)' },
  { to: '/wait-times', id: 'wait-times', emoji: '⏱️', tint: 'var(--s-sun-soft)' },
  { to: '/show', id: 'show', emoji: '🎭', tint: 'var(--s-lilac-soft)' },
  { to: '/card', id: 'card', emoji: '🪪', tint: 'var(--s-coral-soft)' },
  { to: '/map', id: 'map', emoji: '🗺️', tint: 'var(--s-sea-soft)' },
  { to: '/calm', id: 'calm', emoji: '💗', tint: 'var(--s-coral-soft)' },
  { to: '/distract', id: 'distract', emoji: '🫧', tint: 'var(--s-sea-soft)' },
  { to: '/requests', id: 'requests', emoji: '🙋', tint: 'var(--s-grass-soft)' },
  { to: '/going-home', id: 'going-home', emoji: '🏠', tint: 'var(--s-sun-soft)' },
  { to: '/message', id: 'message', emoji: '✉️', tint: 'var(--s-lilac-soft)' },
  { to: '/feedback', id: 'feedback', emoji: '💬', tint: 'var(--s-sea-soft)' },
]

type HomeLang = keyof typeof homeTexts

/** The same destination in the calm concept: its title and line come from parent/ui.json, so the wording is one for the whole app */
const calmTileOf: Record<string, string> = {
  trail: 'journey',
  'wait-times': 'wait-times',
  show: 'procedures',
  card: 'card',
  map: 'map',
  calm: 'calm',
  requests: 'requests',
  'going-home': 'discharge',
  message: 'message',
  feedback: 'feedback',
}
type Tile = { name: string; desc: string }
const calmTiles = parentUi as unknown as Record<HomeLang, { tiles: Record<string, { title: string; desc: string }> }>

/** Hebrew stays the story's own (the design's names); the other languages reuse the calm wording where the destination is the same */
function tileText(lang: HomeLang, id: string): Tile {
  const own = (homeTexts[lang].tiles as Record<string, Partial<Tile> | undefined>)[id]
  const hebrew = (homeTexts.he.tiles as Record<string, Tile>)[id]
  const calmKey = calmTileOf[id]
  if (lang === 'he' || !calmKey) {
    return { name: own?.name ?? hebrew.name, desc: own?.desc ?? hebrew.desc }
  }
  const c = calmTiles[lang].tiles[calmKey]
  return { name: c.title, desc: c.desc }
}

/**
 * The app's home (the parent side, as in the design): a header with the
 * language choice, the child's world (one big start button, two shared
 * activities), then the parent's centre with the tiles of every stage.
 */
export function WorldPage() {
  const { path } = useVisitReason()
  const { lang, dir } = useI18n()
  const tx = homeTexts[lang as HomeLang] ?? homeTexts.he
  const reasonLabel = path ? parentPaths(lang as HomeLang).find((p) => p.id === path.id)?.label ?? path.label : ''

  return (
    <div className={shell.page} dir={dir} lang={lang}>
      <header className={styles.homeHead}>
        <div className={styles.homeLang}>
          <LanguagePicker align="start" />
        </div>
        <span className={styles.homeEyebrow}>{tx.eyebrow}</span>
        <h1 className={styles.homeTitle}>{tx.title}</h1>
        <p className={styles.homeSub}>{tx.subtitle}</p>
      </header>

      <section className={styles.homeSection} aria-labelledby="child-world">
        <div className={styles.sectionHead}>
          <h2 id="child-world" className={styles.worldLabel}>{tx.childLabel}</h2>
        </div>

        <div className={styles.childCards}>
          <a href="#/quest" className={styles.childCard}>
            <span className={styles.childCardIcon} aria-hidden>🗺️</span>
            <span className={styles.childCardName}>{tx.start.title}</span>
            <span className={styles.childCardDesc}>{tx.start.desc}</span>
          </a>
          <a href="#/book" className={styles.childCard}>
            <span className={styles.childCardIcon} aria-hidden>📖</span>
            <span className={styles.childCardName}>{tx.read.title}</span>
            <span className={styles.childCardDesc}>{tx.read.desc}</span>
          </a>
        </div>
      </section>

      <div className={styles.sectionHead}>
        <h2 className={styles.worldLabel}>{tx.parentLabel}</h2>
      </div>
      {path ? (
        <div className={styles.reasonStrip}>
          <span className={styles.reasonStripEmoji} aria-hidden>
            {path.emoji}
          </span>
          <span className={styles.reasonStripText}>
            <span className={styles.reasonStripLabel}>{tx.reasonLabel}</span>
            {reasonLabel}
          </span>
          <Link to="/reason" className={styles.reasonStripChange}>
            {tx.reasonChange}
          </Link>
        </div>
      ) : (
        <Link to="/reason" className={styles.reasonStrip}>
          <span className={styles.reasonStripText}>{tx.reasonAsk}</span>
        </Link>
      )}

      <nav className={styles.destGrid}>
        <button
          type="button"
          className={styles.dest}
          style={{ '--tint': 'var(--s-sky-soft, #e3f2fb)' } as CSSProperties}
          onClick={openHelper}
        >
          <span className={styles.destBadge} aria-hidden>
            💬
          </span>
          <span className={styles.destName}>{tx.talk.title}</span>
          <span className={styles.destDesc}>{tx.talk.desc}</span>
        </button>
        {destinations.map((d) => {
          const text = tileText(lang as HomeLang, d.id)
          return (
            <Link
              key={d.to}
              to={d.to}
              className={styles.dest}
              style={{ '--tint': d.tint } as CSSProperties}
            >
              <span className={styles.destBadge} aria-hidden>
                {d.emoji}
              </span>
              <span className={styles.destName}>{text.name}</span>
              <span className={styles.destDesc}>{text.desc}</span>
            </Link>
          )
        })}
      </nav>

      <p className={styles.footNote}>{tx.foot}</p>
      {/* the credits of the animations and the pictures (CC BY 4.0 and the AI disclosure) */}
      <footer className={styles.footNote}>
        <p>{tx.credits.disclaimer}</p>
        <p>{tx.credits.animations}</p>
        <p>{tx.credits.ai}</p>
      </footer>
    </div>
  )
}
