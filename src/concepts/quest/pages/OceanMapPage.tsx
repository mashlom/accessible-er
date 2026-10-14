import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link, useConceptPath } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, REQUIRED_STAGES } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { LanguagePicker } from '../../../components/LanguagePicker'
import { dotsAlong } from './oceanTrails'
import css from '../quest.module.css'

export type Pt = [number, number]
/** Coordinates are in the Figma frame's units: picture box (x, y, w, h) and the number badge's center */
export type Slot = { x: number; y: number; w: number; h: number; badge: Pt; flip?: boolean }

export interface Scene {
  W: number
  H: number
  slots: Slot[]
  /** Dotted trails, one list of dot centers per trail (trail i leaves station i) */
  dots?: Pt[][]
  /** Dashed trails, as polylines */
  lines?: Pt[][]
  /** CSS variables in frame units: background box, title pill, badge and star sizes */
  vars: Record<string, string | number>
}

// Portrait: Frame 427319612 in Figma is 412×939. The five stations, their pictures and the trails are
// taken from its SVG export (each picture is exactly its mask's bounding box). The procedure choice
// is not a station: it opens from the last one, once it is done.
const PORTRAIT: Scene = {
  W: 412,
  H: 939,
  // the stations as in Shevi's portrait frame (measured on screenshots of it): the house and the submarine as
  // before, the three domes smaller; each number on the top of its station
  slots: [
    { x: -27, y: 108, w: 211, h: 220, badge: [92, 176] },
    { x: 235, y: 235, w: 227, h: 169, badge: [265, 277] },
    { x: 16, y: 408, w: 211, h: 136, badge: [116, 411] },
    { x: 177, y: 566, w: 189, h: 129, badge: [272, 567] },
    { x: 31, y: 748, w: 214, h: 138, badge: [123, 745] },
  ],
  // trail i runs from station i's edge to station i+1's number (the first two as drawn in the mockup, the others
  // curves between the measured points)
  dots: [
    ([[180, 271], [184, 268], [189, 266], [195, 263], [201, 262], [207, 260], [213, 260], [219, 259], [225, 260], [231, 260], [237, 262], [243, 264], [248, 266], [254, 269], [259, 272], [264, 275]] as Pt[]),
    ([[252, 380], [247, 382], [241, 383], [235, 382], [229, 382], [223, 381], [217, 380], [211, 380], [205, 379], [199, 378], [194, 378], [188, 377], [182, 377], [176, 378], [170, 378], [164, 379], [158, 380], [152, 381], [147, 383], [141, 386], [136, 389], [131, 393], [127, 397], [123, 401], [120, 406]] as Pt[]),
    dotsAlong([183, 517], [215, 520], [240, 552], [272, 567]),
    dotsAlong([255, 691], [200, 700], [140, 702], [123, 745]),
  ],
  vars: {
    '--bg-x': -87, '--bg-y': -250, '--bg-w': 553, '--bg-h': 1260, '--bg-rot': '180deg',
    '--grad-y': -16, '--grad-h': 199,
    '--title-x': 64.5, '--title-y': 72, '--title-w': 283, '--title-h': 50, '--title-fs': 21,
    '--badge': 24, '--badge-fs': 15, '--star': 30,
  },
}

// Landscape: Frame 427319619 is 1920×1080, the same pictures at other sizes; the path runs right to left.
const LANDSCAPE: Scene = {
  W: 1920,
  H: 1080,
  // the stations as in Shevi's landscape frame (measured on screenshots of it, 0.384 px per unit): the house at the
  // bottom right, the submarine top right, the pod in the middle, the aquarium top left, the captain's dome
  // bottom left; the numbers as drawn there (the house has none in her frame; ours stays)
  slots: [
    { x: 1494, y: 523, w: 493, h: 513, badge: [1640, 655], flip: true },
    { x: 1322, y: 233, w: 432, h: 322, badge: [1504, 540] },
    { x: 821, y: 545, w: 468, h: 302, badge: [1050, 568] },
    { x: 239, y: 205, w: 475, h: 324, badge: [664, 478] },
    { x: 85, y: 720, w: 406, h: 262, badge: [284, 710] },
  ],
  // trail i runs from station i to the number of station i+1 (curves between the measured points)
  lines: [
    dotsAlong([1650, 790], [1590, 740], [1620, 600], [1504, 540]),
    dotsAlong([1340, 505], [1250, 480], [1120, 490], [1050, 568]),
    dotsAlong([835, 618], [760, 625], [740, 500], [664, 478]),
    dotsAlong([456, 527], [480, 640], [200, 590], [284, 710]),
  ],
  vars: {
    '--bg-x': 0, '--bg-y': -1682, '--bg-w': 1920, '--bg-h': 4376,
    // behind the picture: the water's colour, so its edge pixels never show light cyan
    '--map-bg': '#1f6f80',
    '--title-x': 1270, '--title-y': 94, '--title-w': 550, '--title-h': 97, '--title-fs': 41,
    '--badge': 60, '--badge-fs': 36, '--star': 56,
  },
}

/** True on screens wide enough for the landscape scene: a landscape shape, or wide enough that what the
 *  560px portrait column leaves is a quarter of the window (747px), whatever its height */
export function useWide(): boolean {
  const query = '(min-aspect-ratio: 3/2), (min-width: 747px)'
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

export const OCEAN_IMAGES: Record<string, string> = {
  reception: '/worlds/ocean/station-house.png',
  'wait-before-triage': '/worlds/ocean/station-sub.png',
  triage: '/worlds/ocean/station-pod.png',
  'wait-doctor': '/worlds/ocean/station-aquarium.png',
  doctor: '/worlds/ocean/station-doctor.png',
  // Second stage (stand-in pictures until the four stations are drawn); the last one stands on land
  tests: '/worlds/ocean/station-sonar.png',
  consult: '/worlds/ocean/station-sub.png',
  'wait-results': '/worlds/ocean/station-pod.png',
  treatment: '/worlds/ocean/station-sub.png',
  decision: '/worlds/ocean/station-house.png',
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
}

/** The map scene with its top row, progress capsule and parent button; both layouts share it. */
export function OceanMapView({ portrait, landscape, items, underSheet, progress, numbers, firstNumber = 1, noTitle, starsTotal }: ViewProps) {
  const { t, dir } = useI18n()
  const wide = useWide()
  const { W, H, slots, dots, lines, vars } = wide ? landscape : portrait
  const pctX = (v: number) => `${(v / W) * 100}%`
  const pctY = (v: number) => `${(v / H) * 100}%`

  return (
    <div
      className={wide ? `${css.oceanMap} ${css.oceanMapWide}` : css.oceanMap}
      // the same numbers are used by the mirrored pieces that fill what the scene doesn't reach
      style={vars as React.CSSProperties}
    >
      {wide && (
        // the scene sits on the bottom of the screen; only what is above it is filled with the mirrored picture
        <div className={`${css.oceanTileV} ${css.oceanTileVTop}`} aria-hidden>
          <div className={css.oceanSideBgW} />
        </div>
      )}
      {!wide && (
        <>
          {/* the column is pressed to the right edge; the rest of the screen, on its left, is the picture
              mirrored outwards from the column's edge (a mirror at each edge, so the pieces meet without a
              seam, and the next tile mirrors back) */}
          {[-1].map((k) => (
            <div
              key={k}
              className={`${css.oceanTile} ${Math.abs(k) % 2 === 1 ? css.oceanTileFlip : ''}`}
              style={{ '--k': k } as React.CSSProperties}
              aria-hidden
            >
              <div className={css.oceanSideBg} />
            </div>
          ))}
          <div className={css.oceanBackdropGrad} aria-hidden />
        </>
      )}
      {!underSheet && (
        <div className={wide ? `${css.oceanTopRow} ${css.oceanTopRowWide}` : css.oceanTopRow}>
          <Link to="/" className={css.oceanTopBtn} aria-label={t('ui.shell.worlds', 'לבחירת עולם אחר')}>
            <svg viewBox="0 0 24 24" aria-hidden className={css.oceanTopIcon} style={{ scale: dir === 'rtl' ? '1' : '-1 1' }}>
              <path d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <div className={css.oceanTopGroup}>
            <LanguagePicker variant="overlay" />
            <a href="#/" className={css.oceanTopBtn} aria-label={t('ui.shell.menu', 'לתפריט הקונספטים')}>
              <svg viewBox="0 0 24 24" aria-hidden className={css.oceanTopIcon}>
                <path d="M4 11l8-7 8 7M6 10v9h4v-5h4v5h4v-9" />
              </svg>
            </a>
          </div>
        </div>
      )}
      {!underSheet && (starsTotal ?? 0) > 0 && (
        <div
          className={wide ? `${css.oceanStarsTotal} ${css.oceanStarsTotalWide}` : css.oceanStarsTotal}
          role="img"
          aria-label={`${t('ui.text.starsEarned', 'כוכבים שהרווחת')}: ${starsTotal}`}
        >
          {Array.from({ length: starsTotal ?? 0 }, (_, j) => <span key={j} aria-hidden>⭐</span>)}
        </div>
      )}
      <div
        className={wide ? `${css.oceanScene} ${css.oceanSceneWide}` : css.oceanScene}
        style={{ aspectRatio: `${W} / ${H}`, '--u': `calc(100cqw / ${W})`, ...vars } as React.CSSProperties}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className={css.oceanPath} aria-hidden>
          {/* a trail lights up once the station it leaves is done */}
          {dots?.map((seg, i) => {
            // the dots stop short of the next station's number: none inside the circle or right at its edge
            const target = numbers ? slots[i + 1]?.badge : undefined
            const r = (Number(vars['--badge']) || 0) / 2 + 8
            const shown = target ? seg.filter(([x, y]) => Math.hypot(x - target[0], y - target[1]) >= r) : seg
            return (
              <g key={i} className={items[i]?.status === 'done' ? css.oceanTrailLit : undefined}>
                {shown.map(([x, y], j) => <circle key={j} cx={x} cy={y} r={1.8} />)}
              </g>
            )
          })}
          {lines?.map((pts, i) => {
            // a trail that ends at the next station's number stops at the circle's edge, not inside it
            const target = numbers ? slots[i + 1]?.badge : undefined
            const shown = target ? trimAtCircle(pts, target, (Number(vars['--badge']) || 0) / 2 + 8) : pts
            return (
              <path
                key={i}
                className={items[i]?.status === 'done' ? css.oceanTrailLit : undefined}
                d={`M ${shown.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')}`}
              />
            )
          })}
        </svg>
        {!noTitle && (() => {
          const text = t('ui.text.oceanHeadline', 'המסע שלך מתחיל כאן')
          const cut = text.lastIndexOf(' ')
          // longer wording (other languages) gets a smaller font and wraps to two lines, so it stays inside the pill
          const shrink = text.length > 22 ? 0.78 : 1
          return (
            <h1 className={css.oceanTitle} style={{ '--title-shrink': shrink } as React.CSSProperties}>
              <span>{text.slice(0, cut + 1)}<strong>{text.slice(cut + 1)}</strong></span>
            </h1>
          )
        })()}
        {items.map((item, i) => {
          const slot = slots[i]
          if (!slot) return null
          const open = item.onOpen
          return (
            <div
              key={item.id}
              className={[css.oceanStage, css[`pin--${item.status}`]].join(' ')}
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
                className={css.oceanObj}
                style={{ left: pctX(slot.x), top: pctY(slot.y), width: pctX(slot.w), transform: slot.flip ? 'scaleX(-1)' : undefined }}
              />
              {(item.stars ?? 0) > 0 && (
                <span
                  className={css.oceanStars}
                  style={{ left: pctX(slot.x + slot.w / 2), top: pctY(slot.y + slot.h * 0.88) }}
                  role="img"
                  aria-label={`${t('ui.text.done', 'בוצע')}: ${item.stars}`}
                >
                  {Array.from({ length: item.stars ?? 0 }, (_, j) => <span key={j} className={css.oceanStar} aria-hidden>⭐</span>)}
                </span>
              )}
              {numbers && (
                <div className={css.oceanBubble} style={{ left: pctX(slot.badge[0]), top: pctY(slot.badge[1]) }}>
                  <span className={css.oceanNum} aria-label={item.label}>{firstNumber + i}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {!underSheet && (
        <div
          className={wide ? `${css.oceanProgress} ${css.oceanProgressWide}` : css.oceanProgress}
          role="progressbar"
          aria-label={t('ui.text.journeyProgress', 'התקדמות במסע')}
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-valuenow={progress.done}
        >
          <span className={css.oceanProgressFill} style={{ '--p': progress.total ? progress.done / progress.total : 0 } as React.CSSProperties} />
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

/** underSheet: rendered behind a stage sheet, which has its own parent-info pill */
export function OceanMapPage({ underSheet }: { underSheet?: boolean } = {}) {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const { visible, stages, doneProcedures } = useQuestProgress()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()

  const journey = t('journey.journeyStages', journeyStages)
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
      image: OCEAN_IMAGES[id],
      stars: starsFor(data?.procedureIds, id, doneProcedures),
      onOpen: () => navigate(conceptPath(to)),
    }
  })

  return (
    <OceanMapView
      portrait={PORTRAIT}
      landscape={LANDSCAPE}
      items={items}
      underSheet={underSheet}
      progress={{ done: doneStages, total: dayStages.length }}
      numbers
    />
  )
}
