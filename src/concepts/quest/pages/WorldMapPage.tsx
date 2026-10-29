import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConceptPath, useGoBackTo } from '../../nav'
import { WORLD_SELECT } from '../components/WorldScope'
import { parentJourney } from '../../../data/parent'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, REQUIRED_STAGES } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { LanguagePicker } from '../../../components/LanguagePicker'
import { dotsAlong } from './trails'
import type { Pt, Scene, Trail, WorldDesign } from '../themes'
import css from '../quest.module.css'

export type { Pt, Scene, Slot } from '../themes'

// The scenes, the pictures and the colours are the world's: src/data/child/worlds/<world>/world.json (design).

/** True on screens wide enough for the landscape scene: a landscape shape, or wide enough that what the 560px portrait
 *  column leaves is a quarter of the window (747px) - but only when the window is not taller than it is wide: a
 *  tablet held upright keeps the portrait layout */
export function useWide(): boolean {
  const query = '(min-aspect-ratio: 3/2), (min-width: 747px) and (min-aspect-ratio: 1/1)'
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setWide(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return wide
}

/** Cuts the end of a polyline where it enters a circle (when it ends inside or next to it) */
function trimAtCircle(pts: Pt[], c: Pt, r: number): Pt[] {
  const d = (p: Pt) => Math.hypot(p[0] - c[0], p[1] - c[1])
  const out = [...pts]
  if (out.length < 3 || d(out[out.length - 1]) > r * 1.6) return pts
  let last = out.pop() as Pt
  while (out.length > 1 && d(out[out.length - 1]) < r) last = out.pop() as Pt
  // the point on the last segment that is exactly r from the centre
  const prev = out[out.length - 1]
  const dp = d(prev)
  const dl = d(last)
  if (dl < r && dp > r) {
    const t = (dp - r) / (dp - dl)
    out.push([prev[0] + (last[0] - prev[0]) * t, prev[1] + (last[1] - prev[1]) * t])
  } else if (dl >= r) {
    out.push(last)
  }
  return out
}

/** A trail's points: as listed, or along its Bezier curve */
export function trailPoints(trail: Trail): Pt[] {
  return Array.isArray(trail) ? trail : dotsAlong(...trail.bezier)
}

/** The picture of a station on the map, on its sheet, and on its card in the choice sheet */
export function stationPicture(design: WorldDesign, stageId: string, on: 'map' | 'sheet' | 'choice' = 'map'): string {
  const st = design.stations[stageId]
  if (on === 'choice') return st?.choice ?? st?.sheet ?? st?.map ?? ''
  return (on === 'sheet' ? st?.sheet : undefined) ?? st?.map ?? ''
}

export interface ViewItem {
  id: string
  label: string
  status: string
  image: string
  /** Stars earned: one for each procedure done at the station (or one for the station itself) */
  stars?: number
  /** Missing = not openable yet */
  onOpen?: () => void
}

interface ViewProps {
  portrait: Scene
  landscape: Scene
  items: ViewItem[]
  underSheet?: boolean
  progress: { done: number; total: number }
  /** Number badges on the stations, counting from firstNumber */
  numbers?: boolean
  firstNumber?: number
  /** No "your journey starts here" pill (the second stage's map) */
  noTitle?: boolean
  /** Stars earned on the first stage, shown at the top right (the second stage's map) */
  starsTotal?: number
  /** The world's own wording of the "your journey starts here" pill */
  headline?: string
}

/** The map scene with its top row, progress capsule and parent button; both layouts share it. */
export function WorldMapView({ portrait, landscape, items, underSheet, progress, numbers, firstNumber = 1, noTitle, starsTotal, headline }: ViewProps) {
  const { t, dir } = useI18n()
  const wide = useWide()
  const goBackTo = useGoBackTo()
  const { theme } = useQuestTheme()
  const { W, H, slots, dots, lines, vars } = wide ? landscape : portrait
  const pctX = (v: number) => `${(v / W) * 100}%`
  // the headline: in the scene on a narrow screen; on a wide one at the top of the page, on the sky
  const title = noTitle ? null : (() => {
    const text = headline ?? t<string>('ui.text.worldHeadline')
    const cut = text.lastIndexOf(' ')
    // longer wording (other languages) gets a smaller font and wraps to two lines, so it stays inside the pill
    const shrink = text.length > 22 ? 0.78 : 1
    return (
      <h1 className={wide ? `${css.worldTitle} ${css.worldTitleTop}` : css.worldTitle} style={{ '--title-shrink': shrink } as React.CSSProperties}>
        <span>{text.slice(0, cut + 1)}<strong>{text.slice(cut + 1)}</strong></span>
      </h1>
    )
  })()
  const pctY = (v: number) => `${(v / H) * 100}%`

  return (
    <div
      className={wide ? `${css.worldMap} ${css.worldMapWide}` : css.worldMap}
      // the same numbers are used by the mirrored pieces that fill what the scene doesn't reach
      style={vars as React.CSSProperties}
      // behind a sheet the map is only a picture: seen, but not reachable by touch, keyboard or screen reader
      {...(underSheet ? { inert: '', 'aria-hidden': true } : {})}
    >
      {wide && theme.design?.mirrorAbove !== false && (
        // the scene sits on the bottom of the screen; only what is above it is filled with the mirrored picture
        <div className={`${css.worldTileV} ${css.worldTileVTop}`} aria-hidden>
          <div className={css.worldSideBgW} />
        </div>
      )}
      {wide && (
        // on a screen wider than the scene (more than 16:9) the scene stands in the middle and the picture is
        // mirrored on each side of it (the CSS shows these only then)
        <>
          <div className={`${css.worldTileH} ${css.worldTileHLeft} ${theme.design?.mirrorAbove === false ? css.worldTileHFade : ''}`} aria-hidden>
            <div className={css.worldSideBgW} />
          </div>
          <div className={`${css.worldTileH} ${css.worldTileHRight} ${theme.design?.mirrorAbove === false ? css.worldTileHFade : ''}`} aria-hidden>
            <div className={css.worldSideBgW} />
          </div>
        </>
      )}
      {!wide && (
        <>
          {/* the column is pressed to the right edge; the rest of the screen, on its left, is the picture
              mirrored outwards from the column's edge (a mirror at each edge, so the pieces meet without a
              seam, and the next tile mirrors back) */}
          {[0, -1].map((k) => (
            <div
              key={k}
              className={`${css.worldTile} ${Math.abs(k) % 2 === 1 ? css.worldTileFlip : ''}`}
              style={{ '--k': k } as React.CSSProperties}
              aria-hidden
            >
              <div className={css.worldSideBg} />
            </div>
          ))}
          <div className={css.worldBackdropGrad} aria-hidden />
        </>
      )}
      {(
        <div className={wide ? `${css.worldTopRow} ${css.worldTopRowWide}` : css.worldTopRow}>
          {/* back to the world select screen (outside the world's own addresses) */}
          <button type="button" className={css.worldTopBtn} onClick={() => goBackTo(WORLD_SELECT, { absolute: true })} aria-label={t('ui.shell.worlds')}>
            <svg viewBox="0 0 24 24" aria-hidden className={css.worldTopIcon} style={{ scale: dir === 'rtl' ? '1' : '-1 1' }}>
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className={css.worldTopGroup}>
            <LanguagePicker variant="overlay" />
            <a href="#/" className={css.worldTopBtn} aria-label={t('ui.shell.menu')}>
              <svg viewBox="0 0 24 24" aria-hidden className={css.worldTopIcon}>
                <path d="M4 11l8-7 8 7M6 10v9h4v-5h4v5h4v-9" />
              </svg>
            </a>
          </div>
        </div>
      )}
      {(starsTotal ?? 0) > 0 && (
        <div
          className={wide ? `${css.worldStarsTotal} ${css.worldStarsTotalWide}` : css.worldStarsTotal}
          role="img"
          aria-label={`${t('ui.text.starsEarned')}: ${starsTotal}`}
        >
          {Array.from({ length: starsTotal ?? 0 }, (_, j) => <span key={j} aria-hidden>⭐</span>)}
        </div>
      )}
      {wide && title}
      <div
        // a world without the mirrored water above (all but the ocean): the picture's top fades into the sky colour
        className={wide ? `${css.worldScene} ${css.worldSceneWide} ${theme.design?.mirrorAbove === false ? css.worldSceneFade : ''}` : css.worldScene}
        style={{ aspectRatio: `${W} / ${H}`, '--u': `calc(100cqw / ${W})`, ...vars } as React.CSSProperties}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className={css.worldPath} aria-hidden>
          {/* a trail lights up once the station it leaves is done */}
          {dots?.map(trailPoints).map((seg, i) => {
            // the dots stop short of the next station's number: none inside the circle or right at its edge
            const target = numbers ? slots[i + 1]?.badge : undefined
            const r = (Number(vars['--badge']) || 0) / 2 + 8
            const shown = target ? seg.filter(([x, y]) => Math.hypot(x - target[0], y - target[1]) >= r) : seg
            return (
              <g key={i} className={items[i]?.status === 'done' ? css.worldTrailLit : undefined}>
                {shown.map(([x, y], j) => <circle key={j} cx={x} cy={y} r={1.8} />)}
              </g>
            )
          })}
          {lines?.map(trailPoints).map((pts, i) => {
            // a trail that ends at the next station's number stops at the circle's edge, not inside it
            const target = numbers ? slots[i + 1]?.badge : undefined
            const r = (Number(vars['--badge']) || 0) / 2 + 8
            let shown = target ? trimAtCircle(pts, target, r) : pts
            // a trail that starts at a number (the second stage) also starts at the circle's edge
            const origin = numbers ? slots[i]?.badge : undefined
            if (origin) shown = trimAtCircle([...shown].reverse(), origin, r).reverse()
            return (
              <path
                key={i}
                className={items[i]?.status === 'done' ? css.worldTrailLit : undefined}
                d={`M ${shown.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')}`}
              />
            )
          })}
        </svg>
        {!wide && title}
        {items.map((item, i) => {
          const slot = slots[i]
          if (!slot) return null
          const open = item.onOpen
          return (
            <div
              key={item.id}
              className={[css.worldStage, css[`pin--${item.status}`]].join(' ')}
              onClick={open}
              onKeyDown={(e) => open && (e.key === 'Enter' || e.key === ' ') && open()}
              role="button"
              tabIndex={open ? 0 : -1}
              aria-disabled={!open}
              aria-label={item.label}
            >
              <img
                src={item.image}
                alt=""
                className={css.worldObj}
                style={{ left: pctX(slot.x), top: pctY(slot.y), width: pctX(slot.w), transform: slot.flip ? 'scaleX(-1)' : undefined }}
              />
              {(item.stars ?? 0) > 0 && (
                <span
                  className={css.worldStars}
                  style={{ left: pctX(slot.x + slot.w / 2), top: pctY(slot.y + slot.h * 0.88) }}
                  role="img"
                  aria-label={`${t('ui.labels.adult.done')}: ${item.stars}`}
                >
                  {Array.from({ length: item.stars ?? 0 }, (_, j) => <span key={j} className={css.worldStar} aria-hidden>⭐</span>)}
                </span>
              )}
              {numbers && (
                <div className={css.worldBubble} style={{ left: pctX(slot.badge[0]), top: pctY(slot.badge[1]) }}>
                  <span className={css.worldNum} aria-label={item.label}>{firstNumber + i}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {(
        <div
          className={wide ? `${css.worldProgress} ${css.worldProgressWide}` : css.worldProgress}
          role="progressbar"
          aria-label={t('ui.labels.adult.journeyProgress')}
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-valuenow={progress.done}
        >
          {/* a glass case that the sticks go into one by one (gold, mint, gold, mint, gold from the bottom) */}
          {Array.from({ length: progress.total }, (_, i) => (
            <span key={i} className={css.worldProgressStick} data-on={i < progress.done} />
          ))}
        </div>
      )}
    </div>
  )
}

/** One star for each procedure done at a station; a station finished without one (no procedures) gets one */
export function starsFor(procedureIds: string[] | undefined, stageId: string, done: Set<string>): number {
  const procs = (procedureIds ?? []).filter((pid) => done.has(pid)).length
  return procs > 0 ? procs : done.has(stageId) ? 1 : 0
}

/** The first map of a designed world. underSheet: drawn (inert) behind a sheet */
export function WorldMapPage({ underSheet }: { underSheet?: boolean } = {}) {
  const { theme } = useQuestTheme()
  const design = theme.design!
  const { lang } = useI18n()
  const { visible, stages, doneProcedures } = useQuestProgress()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()

  const journey = parentJourney(lang)
  // Progress is shared equally between the five stations of the day map
  const dayStages = stages.filter((st) => (REQUIRED_STAGES as readonly string[]).includes(st.id))
  const doneStages = dayStages.filter((st) => st.status === 'done').length

  // A station that isn't reached yet can still be looked at (its sheet has no "done" button)
  const items: ViewItem[] = REQUIRED_STAGES.map((id) => {
    const skin = theme.stages[id]
    const data = journey.find((j) => j.id === id)
    const to = id === 'wait-before-triage' ? '/wait-times' : `/stage/${id}`
    return {
      id,
      label: skin?.label ?? data?.title ?? id,
      status: visible.find((s) => s.id === id)?.status ?? 'locked',
      image: stationPicture(design, id),
      stars: starsFor(data?.procedureIds, id, doneProcedures),
      onOpen: () => navigate(conceptPath(to)),
    }
  })

  return (
    <WorldMapView
      portrait={design.dayMap.portrait}
      landscape={design.dayMap.landscape}
      items={items}
      underSheet={underSheet}
      progress={{ done: doneStages, total: dayStages.length }}
      numbers
      headline={theme.ui?.headline}
    />
  )
}
