import { useEffect, useRef, useState } from 'react'
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

/** A portrait map with its own landscape (design.extended) on a screen wider than the scene's shape (a short phone,
 *  an upright tablet): how much the stations spread out sideways (1 = not at all, at most 2), so they use the whole
 *  width while the islands keep the size that fits the height */
const PORTRAIT_SHAPE = 412 / 939
function useSpread(on: boolean): number {
  const get = () => (on && typeof window !== 'undefined' ? Math.min(2, Math.max(1, window.innerWidth / window.innerHeight / PORTRAIT_SHAPE)) : 1)
  const [k, setK] = useState(get)
  useEffect(() => {
    const onResize = () => setK(get())
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on])
  return k
}

/** The picture's colours row by row (sky on top, grass below), without what stands on them: for each band of rows
 *  the median colour across the outer third of the picture on that side. Fills the sides of a very wide screen as
 *  a vertical gradient: [left, right]. */
function useSideColours(ref: React.RefObject<HTMLElement | null>, on: boolean, key: unknown): (string | undefined)[] {
  const [grad, setGrad] = useState<(string | undefined)[]>([])
  useEffect(() => {
    if (!on || !ref.current) return
    const url = getComputedStyle(ref.current).getPropertyValue('--w-background-wide').match(/url\(["']?([^"')]+)/)?.[1]
    if (!url) return
    const img = new Image()
    img.onload = () => {
      const W = 48, H = 27
      const c = document.createElement('canvas')
      c.width = W
      c.height = H
      const g = c.getContext('2d', { willReadFrequently: true })
      if (!g) return
      g.drawImage(img, 0, 0, W, H)
      const d = g.getImageData(0, 0, W, H).data
      const med = (a: number[]) => a.sort((x, y) => x - y)[a.length >> 1]
      const side = (x0: number) => {
        const stops = Array.from({ length: H }, (_, y) => {
          const ch = [0, 1, 2].map((k) => med(Array.from({ length: W / 3 }, (_, x) => d[(y * W + x0 + x) * 4 + k])))
          return `rgb(${ch.join(' ')}) ${((y + 0.5) / H * 100).toFixed(1)}%`
        })
        return `linear-gradient(${stops.join(', ')})`
      }
      setGrad([side(0), side(W - W / 3)])
    }
    img.src = url
  }, [ref, on, key])
  return grad
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

/** The see-through of each station picture (a small copy of its alpha), to tell a touch on the picture from one on its empty margin */
const alphaOf = new Map<string, { w: number; h: number; a: Uint8ClampedArray } | null>()

/** Whether the picture is drawn at this point (fx, fy: 0..1 across its box); null when it can't be read */
function opaqueAt(img: HTMLImageElement, fx: number, fy: number): boolean | null {
  if (!img.complete || !img.naturalWidth) return null
  const key = img.currentSrc || img.src
  let m = alphaOf.get(key)
  if (m === undefined) {
    try {
      const scale = Math.min(1, 256 / Math.max(img.naturalWidth, img.naturalHeight))
      const w = Math.max(1, Math.round(img.naturalWidth * scale))
      const h = Math.max(1, Math.round(img.naturalHeight * scale))
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      const g = c.getContext('2d', { willReadFrequently: true })
      if (!g) throw new Error('no canvas')
      g.drawImage(img, 0, 0, w, h)
      m = { w, h, a: g.getImageData(0, 0, w, h).data }
    } catch {
      m = null
    }
    alphaOf.set(key, m)
  }
  if (!m) return null
  const x = Math.min(m.w - 1, Math.max(0, Math.floor((img.hasAttribute('data-flip') ? 1 - fx : fx) * m.w)))
  const y = Math.min(m.h - 1, Math.max(0, Math.floor(fy * m.h)))
  return m.a[(y * m.w + x) * 4 + 3] > 32
}

/** A finger is not a mouse: the number badges answer within 48px across at least */
const BADGE_REACH = 24

/**
 * Which station a touch at (x, y) is for: its number badge first (a generous circle), then the picture that is
 * drawn there (the topmost one), then - on a picture's empty margin - the nearest picture whose box holds the point.
 */
function stationAt(scene: HTMLElement, x: number, y: number): number | null {
  const stations = [...scene.querySelectorAll<HTMLElement>('[data-station]')]
  const indexOf = (el: HTMLElement) => Number(el.dataset.station)
  for (const el of stations) {
    const r = el.querySelector('[data-badge]')?.firstElementChild?.getBoundingClientRect()
    if (r && Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)) <= Math.max(BADGE_REACH, r.width / 2)) return indexOf(el)
  }
  let near: { i: number; d: number } | null = null
  for (const el of stations.reverse()) {
    const img = el.querySelector('img')
    if (!img) continue
    const r = img.getBoundingClientRect()
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) continue
    if (opaqueAt(img, (x - r.left) / r.width, (y - r.top) / r.height) !== false) return indexOf(el)
    const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2))
    if (!near || d < near.d) near = { i: indexOf(el), d }
  }
  return near?.i ?? null
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
  /** The world's sentence that says the ER visit is like its journey: shown in the pill instead of the headline */
  intro?: string
}

/** The map scene with its top row, progress capsule and parent button; both layouts share it. */
export function WorldMapView({ portrait, landscape, items, underSheet, progress, numbers, firstNumber = 1, noTitle, starsTotal, headline, intro }: ViewProps) {
  const { t } = useI18n()
  const wide = useWide()
  const mapRef = useRef<HTMLDivElement>(null)
  const goBackTo = useGoBackTo()
  const { theme } = useQuestTheme()
  // a picture with its own landscape around the frame: nothing to mirror, blur or fill in
  const ext = !!theme.design?.extended
  const sideBg = useSideColours(mapRef, wide && !ext, theme)
  const sceneRef = useRef<HTMLDivElement>(null)
  // the station under the mouse (a touch screen has none): it gets the pointer and the hover shadow
  const [hover, setHover] = useState<number | null>(null)
  const { W, H, slots, dots, lines, vars } = wide ? landscape : portrait
  // the portrait scene of an extended picture spreads out sideways on a wider screen: k times its width in units
  const k = useSpread(ext && !wide)
  const sx = (x: number) => x * k
  // a trail between two stations moves out with them: each point by the shift of the stations it lies between
  // (from the first one's shift at its start to the second one's at its end), so it still joins them
  const centre = (i: number) => (slots[i] ? slots[i].x + slots[i].w / 2 : 0)
  const spreadTrail = (pts: Pt[], i: number): Pt[] =>
    k === 1 ? pts : pts.map(([x, y], j) => {
      const t = pts.length > 1 ? j / (pts.length - 1) : 0
      return [x + (k - 1) * (centre(i) + (centre(i + 1) - centre(i)) * t), y]
    })
  const pctX = (v: number) => `${(v / (W * k)) * 100}%`
  // the headline: in the scene on a narrow screen; on a wide one at the top of the page, on the sky
  const title = noTitle ? null : intro ? (
    // a whole sentence: the pill grows to fit it, with no bold last word; a long one (other languages) gets a smaller font
    <h1
      className={wide ? `${css.worldTitle} ${css.worldTitleTop} ${css.worldTitleIntro}` : `${css.worldTitle} ${css.worldTitleIntro}`}
      style={{ '--title-shrink': intro.length > 80 ? 0.88 : 1 } as React.CSSProperties}
    >
      <span>{intro}</span>
    </h1>
  ) : (() => {
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
      ref={mapRef}
      className={[css.worldMap, wide ? css.worldMapWide : '', ext ? css.worldMapExt : ''].join(' ')}
      // the same numbers are used by the mirrored pieces that fill what the scene doesn't reach
      style={vars as React.CSSProperties}
      // behind a sheet the map is only a picture: seen, but not reachable by touch, keyboard or screen reader
      {...(underSheet ? { inert: '', 'aria-hidden': true } : {})}
    >
      {wide && !ext && theme.design?.mirrorAbove !== false && (
        // the scene sits on the bottom of the screen; only what is above it is filled with the mirrored picture
        <div className={`${css.worldTileV} ${css.worldTileVTop}`} aria-hidden>
          <div className={css.worldSideBgW} />
        </div>
      )}
      {wide && !ext && theme.design?.mirrorAbove === false && (
        // the others: just above the scene a short blurred reflection of its top, fading into the sky
        <div className={`${css.worldTileV} ${css.worldTileVTop} ${css.worldTileVSoft}`} aria-hidden>
          <div className={css.worldSideBgW} />
        </div>
      )}
      {wide && !ext && (
        // on a screen wider than the scene (more than 16:9) the scene stands in the middle and the picture is
        // mirrored on each side of it (the CSS shows these only then)
        <>
          <div className={`${css.worldTileH} ${css.worldTileHLeft} ${theme.design?.mirrorAbove === false ? css.worldTileHFade : ''}`} aria-hidden>
            <div className={css.worldSideBgW} />
            <div className={`${css.worldSideBgW} ${css.worldSideBlur}`} />
            <div className={css.worldSideColour} style={sideBg[0] ? { background: sideBg[0] } : undefined} />
          </div>
          <div className={`${css.worldTileH} ${css.worldTileHRight} ${theme.design?.mirrorAbove === false ? css.worldTileHFade : ''}`} aria-hidden>
            <div className={css.worldSideBgW} />
            <div className={`${css.worldSideBgW} ${css.worldSideBlur}`} />
            <div className={css.worldSideColour} style={sideBg[1] ? { background: sideBg[1] } : undefined} />
          </div>
        </>
      )}
      {!wide && !ext && (
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
          {/* words, not pictures: these buttons are for the adult */}
          <button type="button" className={`${css.worldTopBtn} ${css.navWord}`} onClick={() => goBackTo(WORLD_SELECT, { absolute: true })}>
            {t('ui.shell.chooseWorld')}
          </button>
          <div className={css.worldTopGroup}>
            <LanguagePicker variant="overlay" />
            <a href="#/" className={`${css.worldTopBtn} ${css.homeIcon}`} aria-label={t('ui.shell.home')}>
              <span aria-hidden>🏠</span>
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
        style={{
          aspectRatio: `${W * k} / ${H}`,
          '--u': `calc(100cqw / ${W * k})`,
          ...vars,
          // the picture stays centred under the wider scene
          ...(k > 1 ? { '--bg-x': (Number(vars['--bg-x']) || 0) + (W * k - W) / 2, '--title-x': (Number(vars['--title-x']) || 0) + (W * k - W) / 2, width: `min(100vw, ${(PORTRAIT_SHAPE * k).toFixed(4)} * 100dvh)` } : {}),
          cursor: hover !== null && items[hover]?.onOpen ? 'pointer' : undefined } as React.CSSProperties}
        ref={sceneRef}
        // the scene decides which station a touch is for (see stationAt)
        onClick={(e) => {
          if (e.detail === 0 || (e.target as Element).closest('h1')) return
          const i = stationAt(e.currentTarget, e.clientX, e.clientY)
          if (i !== null) items[i]?.onOpen?.()
        }}
        onPointerMove={(e) => e.pointerType === 'mouse' && setHover(stationAt(e.currentTarget, e.clientX, e.clientY))}
        onPointerLeave={() => setHover(null)}
      >
        <svg viewBox={`0 0 ${W * k} ${H}`} className={css.worldPath} aria-hidden>
          {/* a trail lights up once the station it leaves is done */}
          {dots?.map(trailPoints).map((raw, i) => {
            const seg = spreadTrail(raw, i)
            // the dots stop short of the next station's number: none inside the circle or right at its edge
            const badge = numbers ? slots[i + 1]?.badge : undefined
            const target: Pt | undefined = badge && [badge[0] + (k - 1) * centre(i + 1), badge[1]]
            const r = (Number(vars['--badge']) || 0) / 2 + 8
            const shown = target ? seg.filter(([x, y]) => Math.hypot(x - target[0], y - target[1]) >= r) : seg
            return (
              <g key={i} className={items[i]?.status === 'done' ? css.worldTrailLit : undefined}>
                {shown.map(([x, y], j) => <circle key={j} cx={x} cy={y} r={1.8} />)}
              </g>
            )
          })}
          {lines?.map(trailPoints).map((raw, i) => {
            const pts = spreadTrail(raw, i)
            // a trail that ends at the next station's number stops at the circle's edge, not inside it
            const badge = numbers ? slots[i + 1]?.badge : undefined
            const target: Pt | undefined = badge && [badge[0] + (k - 1) * centre(i + 1), badge[1]]
            const r = (Number(vars['--badge']) || 0) / 2 + 8
            let shown = target ? trimAtCircle(pts, target, r) : pts
            // a trail that starts at a number (the second stage) also starts at the circle's edge
            const ob = numbers ? slots[i]?.badge : undefined
            const origin: Pt | undefined = ob && [ob[0] + (k - 1) * centre(i), ob[1]]
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
          // inside the station's box: the number and the stars are placed relative to it
          const inX = (v: number) => `${((v - slot.x) / slot.w) * 100}%`
          const inY = (v: number) => `${((v - slot.y) / slot.h) * 100}%`
          return (
            <div
              key={item.id}
              className={[css.worldStage, css[`pin--${item.status}`]].join(' ')}
              // the station keeps its size; on a spread scene only its centre moves out
              style={{ left: pctX(sx(slot.x + slot.w / 2) - slot.w / 2), top: pctY(slot.y), width: pctX(slot.w), height: pctY(slot.h) }}
              data-station={i}
              data-hover={hover === i && open ? '' : undefined}
              // a touch is placed by the scene (stationAt); this one is a screen reader's or the keyboard's "click"
              onClick={(e) => e.detail === 0 && open?.()}
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
                data-flip={slot.flip ? '' : undefined}
                style={{ transform: slot.flip ? 'scaleX(-1)' : undefined }}
              />
              {(item.stars ?? 0) > 0 && (
                <span
                  className={css.worldStars}
                  style={{ left: '50%', top: '88%' }}
                  role="img"
                  aria-label={`${t('ui.labels.adult.done')}: ${item.stars}`}
                >
                  {Array.from({ length: item.stars ?? 0 }, (_, j) => <span key={j} className={css.worldStar} aria-hidden>⭐</span>)}
                </span>
              )}
              {numbers && (
                <div className={css.worldBubble} data-badge style={{ left: inX(slot.badge[0]), top: inY(slot.badge[1]) }}>
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
      intro={theme.ui?.intro}
    />
  )
}
