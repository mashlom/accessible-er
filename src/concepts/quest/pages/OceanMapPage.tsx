import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link, useConceptPath } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, REQUIRED_STAGES } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { LanguagePicker } from '../../../components/LanguagePicker'
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
  slots: [
    { x: -27, y: 108, w: 211, h: 220, badge: [93, 176] },
    { x: 235, y: 237, w: 227, h: 169, badge: [266, 277] },
    { x: -26, y: 414, w: 287, h: 185, badge: [117, 410] },
    // the aquarium is as big as the captain's dome after it (the cropped picture is as wide as that one)
    { x: 148, y: 566, w: 262, h: 179, badge: [337, 561] },
    { x: -56, y: 698, w: 262, h: 169, badge: [201, 792] },
  ],
  // trail i runs from station i+1's edge to station i+2's number
  dots: [
    ([[180, 271], [184, 268], [189, 266], [195, 263], [201, 262], [207, 260], [213, 260], [219, 259], [225, 260], [231, 260], [237, 262], [243, 264], [248, 266], [254, 269], [259, 272], [264, 275]] as Pt[]),
    ([[252, 380], [247, 382], [241, 383], [235, 382], [229, 382], [223, 381], [217, 380], [211, 380], [205, 379], [199, 378], [194, 378], [188, 377], [182, 377], [176, 378], [170, 378], [164, 379], [158, 380], [152, 381], [147, 383], [141, 386], [136, 389], [131, 393], [127, 397], [123, 401], [120, 406]] as Pt[]),
    ([[243, 527], [248, 525], [254, 523], [260, 523], [266, 525], [272, 527], [277, 531], [281, 535], [285, 540], [290, 544], [294, 548], [299, 552], [304, 555], [309, 558], [315, 560], [321, 562], [327, 562]] as Pt[]),
    ([[304, 744], [299, 745], [293, 747], [287, 749], [282, 751], [276, 754], [271, 756], [266, 760], [261, 763], [256, 767], [251, 770], [247, 774], [242, 778], [237, 782], [233, 786], [227, 789], [222, 791], [216, 793], [210, 793], [204, 793]] as Pt[]),
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
  slots: [
    { x: 1494, y: 521, w: 493, h: 513, badge: [1640, 655], flip: true },
    { x: 1024, y: 437, w: 528, h: 393, badge: [1276.5, 839.5] },
    { x: 651, y: 156, w: 487, h: 314, badge: [1132.5, 339.5] },
    { x: 184, y: 568, w: 512, h: 349, badge: [429.5, 544.5] },
    { x: -89, y: 118, w: 512, h: 330, badge: [106.5, 452.5] },
  ],
  lines: [
    [[1648.2, 788.2], [1636.1, 781.8], [1620.7, 778.5], [1604.8, 778.5], [1589.1, 780.7], [1573.8, 784.3], [1558.7, 789], [1543.8, 794.2], [1529, 799.9], [1514.4, 805.9], [1499.8, 812], [1485.2, 818.2], [1470.6, 824.4], [1456, 830.4], [1441.3, 836.3], [1426.5, 841.8], [1411.6, 846.9], [1396.4, 851.5], [1381.1, 855.4], [1365.5, 858.3], [1349.8, 860], [1333.9, 860], [1318.3, 857.9], [1303.2, 853.3], [1289.3, 845.9], [1278.4, 837.4]],
    [[1222.4, 478.4], [1209.1, 474.8], [1197.8, 464.4], [1190.7, 450.4], [1186.2, 435.2], [1183.1, 419.7], [1180.6, 404], [1178, 388.4], [1174.8, 372.9], [1169.8, 357.9], [1160.6, 345.5], [1145.7, 341.2], [1132.3, 344.2]],
    [[817.8, 456.2], [811.2, 468], [798.4, 477], [783.5, 482.4], [768.1, 485.7], [752.4, 487.9], [736.7, 489.2], [720.9, 490], [705.1, 490.5], [689.3, 490.7], [673.5, 490.8], [657.6, 490.8], [641.8, 490.7], [626, 490.7], [610.2, 490.8], [594.4, 491], [578.6, 491.4], [562.8, 492.1], [547.1, 493.1], [531.3, 494.6], [515.6, 496.7], [500.1, 499.5], [484.7, 503.4], [469.8, 508.6], [455.7, 515.6], [443.1, 525.1], [433.4, 537.3], [428, 550]],
    [[225.9, 739.9], [212.2, 736.6], [200.6, 726.1], [194.2, 711.4], [190.9, 695.6], [189, 679.5], [187.7, 663.4], [186.3, 647.4], [184.6, 631.3], [181.9, 615.4], [177.7, 599.8], [172.4, 586.8], [170.6, 583.3], [163.7, 571.6], [154.8, 558.8], [145.1, 546.7], [135.1, 534.8], [125.6, 522.5], [117.6, 509.3], [112, 494.9], [109.3, 479.6], [109, 463.9], [110.2, 450.4]],
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
          {dots?.map((seg, i) => (
            <g key={i} className={items[i]?.status === 'done' ? css.oceanTrailLit : undefined}>
              {seg.map(([x, y], j) => <circle key={j} cx={x} cy={y} r={1.8} />)}
            </g>
          ))}
          {lines?.map((pts, i) => (
            <path
              key={i}
              className={items[i]?.status === 'done' ? css.oceanTrailLit : undefined}
              d={`M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')}`}
            />
          ))}
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
