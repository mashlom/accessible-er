import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link, useConceptPath } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, REQUIRED_STAGES } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { LanguagePicker } from '../../../components/LanguagePicker'
import { ParentInfo } from '../components/ParentInfo'
import css from '../quest.module.css'

type Pt = [number, number]
/** Coordinates are in the Figma frame's units: picture box (x, y, w, h) and the number badge's center */
type Slot = { x: number; y: number; w: number; h: number; badge: Pt; flip?: boolean }

interface Scene {
  W: number
  H: number
  slots: Slot[]
  /** Dotted trails, as dot centers */
  dots?: Pt[]
  /** Dashed trails, as polylines */
  lines?: Pt[][]
  /** CSS variables in frame units: background box, title pill, badge and star sizes */
  vars: Record<string, string | number>
}

/** Points along a cubic Bezier, ~7 units apart */
function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt[] {
  const n = Math.max(8, Math.round(Math.hypot(p3[0] - p0[0], p3[1] - p0[1]) / 7))
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n
    const u = 1 - t
    const f = (k: number) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]
    return [f(0), f(1)] as Pt
  })
}

/** Dots every ~6 units along an upward-bulging arc, like the mockup's 1→2 trail */
function sampleArc(a: Pt, b: Pt): Pt[] {
  const ctrl: Pt = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 25]
  const n = Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 6)
  return Array.from({ length: n }, (_, i) => {
    const t = i / n
    const u = 1 - t
    return [u * u * a[0] + 2 * u * t * ctrl[0] + t * t * b[0], u * u * a[1] + 2 * u * t * ctrl[1] + t * t * b[1]] as Pt
  })
}

// Portrait: Frame 427319612 in Figma is 412×939. Stations 1–5, their pictures and the trails are
// taken from its SVG export (each picture is exactly its mask's bounding box). Station 6 (procedure
// choice) isn't in the mockup and continues the same rhythm below, with the house mirrored.
const PORTRAIT: Scene = {
  W: 412,
  H: 1050,
  slots: [
    { x: -27, y: 108, w: 211, h: 220, badge: [93, 176] },
    { x: 235, y: 237, w: 227, h: 169, badge: [266, 277] },
    { x: -26, y: 414, w: 287, h: 185, badge: [117, 410] },
    { x: 206, y: 563, w: 287, h: 185, badge: [337, 561] },
    { x: -56, y: 698, w: 262, h: 169, badge: [201, 792] },
    { x: 228, y: 815, w: 211, h: 220, badge: [319, 883], flip: true },
  ],
  // trail i runs from station i+1's edge to station i+2's number
  dots: [
    ...([[180, 271], [184, 268], [189, 266], [195, 263], [201, 262], [207, 260], [213, 260], [219, 259], [225, 260], [231, 260], [237, 262], [243, 264], [248, 266], [254, 269], [259, 272], [264, 275]] as Pt[]),
    ...([[252, 380], [247, 382], [241, 383], [235, 382], [229, 382], [223, 381], [217, 380], [211, 380], [205, 379], [199, 378], [194, 378], [188, 377], [182, 377], [176, 378], [170, 378], [164, 379], [158, 380], [152, 381], [147, 383], [141, 386], [136, 389], [131, 393], [127, 397], [123, 401], [120, 406]] as Pt[]),
    ...([[243, 527], [248, 525], [254, 523], [260, 523], [266, 525], [272, 527], [277, 531], [281, 535], [285, 540], [290, 544], [294, 548], [299, 552], [304, 555], [309, 558], [315, 560], [321, 562], [327, 562]] as Pt[]),
    ...([[304, 744], [299, 745], [293, 747], [287, 749], [282, 751], [276, 754], [271, 756], [266, 760], [261, 763], [256, 767], [251, 770], [247, 774], [242, 778], [237, 782], [233, 786], [227, 789], [222, 791], [216, 793], [210, 793], [204, 793]] as Pt[]),
    ...sampleArc([195, 830], [319, 883]),
  ],
  vars: {
    '--bg-x': -87, '--bg-y': -250, '--bg-w': 553, '--bg-h': 1260, '--bg-rot': '180deg',
    '--grad-y': -16, '--grad-h': 199,
    '--title-x': 64.5, '--title-y': 44.5, '--title-w': 283, '--title-h': 50, '--title-fs': 21,
    '--badge': 24, '--badge-fs': 15, '--star': 30,
  },
}

// Landscape: Frame 427319619 is 1920×1080, the same pictures at other sizes; the path runs right to
// left. Station 6 isn't in the mockup: it comes last, at the far left under the doctor's side, house not mirrored.
const LANDSCAPE: Scene = {
  W: 1920,
  H: 1080,
  slots: [
    { x: 1494, y: 521, w: 493, h: 513, badge: [1640, 655], flip: true },
    { x: 1024, y: 437, w: 528, h: 393, badge: [1276.5, 839.5] },
    { x: 651, y: 156, w: 487, h: 314, badge: [1132.5, 339.5] },
    { x: 159, y: 554, w: 562, h: 363, badge: [429.5, 544.5] },
    { x: -89, y: 118, w: 512, h: 330, badge: [106.5, 452.5] },
    { x: -45, y: 735, w: 230, h: 240, badge: [170, 772] },
  ],
  lines: [
    [[1648.2, 788.2], [1636.1, 781.8], [1620.7, 778.5], [1604.8, 778.5], [1589.1, 780.7], [1573.8, 784.3], [1558.7, 789], [1543.8, 794.2], [1529, 799.9], [1514.4, 805.9], [1499.8, 812], [1485.2, 818.2], [1470.6, 824.4], [1456, 830.4], [1441.3, 836.3], [1426.5, 841.8], [1411.6, 846.9], [1396.4, 851.5], [1381.1, 855.4], [1365.5, 858.3], [1349.8, 860], [1333.9, 860], [1318.3, 857.9], [1303.2, 853.3], [1289.3, 845.9], [1278.4, 837.4]],
    [[1222.4, 478.4], [1209.1, 474.8], [1197.8, 464.4], [1190.7, 450.4], [1186.2, 435.2], [1183.1, 419.7], [1180.6, 404], [1178, 388.4], [1174.8, 372.9], [1169.8, 357.9], [1160.6, 345.5], [1145.7, 341.2], [1132.3, 344.2]],
    [[817.8, 456.2], [811.2, 468], [798.4, 477], [783.5, 482.4], [768.1, 485.7], [752.4, 487.9], [736.7, 489.2], [720.9, 490], [705.1, 490.5], [689.3, 490.7], [673.5, 490.8], [657.6, 490.8], [641.8, 490.7], [626, 490.7], [610.2, 490.8], [594.4, 491], [578.6, 491.4], [562.8, 492.1], [547.1, 493.1], [531.3, 494.6], [515.6, 496.7], [500.1, 499.5], [484.7, 503.4], [469.8, 508.6], [455.7, 515.6], [443.1, 525.1], [433.4, 537.3], [428, 550]],
    [[225.9, 739.9], [212.2, 736.6], [200.6, 726.1], [194.2, 711.4], [190.9, 695.6], [189, 679.5], [187.7, 663.4], [186.3, 647.4], [184.6, 631.3], [181.9, 615.4], [177.7, 599.8], [172.4, 586.8], [170.6, 583.3], [163.7, 571.6], [154.8, 558.8], [145.1, 546.7], [135.1, 534.8], [125.6, 522.5], [117.6, 509.3], [112, 494.9], [109.3, 479.6], [109, 463.9], [110.2, 450.4]],
    bezier([45, 452], [0, 560], [10, 680], [132, 748]),
  ],
  vars: {
    '--bg-x': 0, '--bg-y': -1682, '--bg-w': 1920, '--bg-h': 4376,
    '--title-x': 1270, '--title-y': 94, '--title-w': 550, '--title-h': 97, '--title-fs': 41,
    '--badge': 42, '--badge-fs': 26, '--star': 56,
  },
}

/** True on screens wide enough for the landscape scene */
function useWide(): boolean {
  const query = '(min-aspect-ratio: 3/2)'
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
  'wait-doctor': '/worlds/ocean/station-pod.png',
  doctor: '/worlds/ocean/station-doctor.png',
  procedures: '/worlds/ocean/station-house.png',
}

/** underSheet: rendered behind a stage sheet, which has its own parent-info pill */
export function OceanMapPage({ underSheet }: { underSheet?: boolean } = {}) {
  const { theme } = useQuestTheme()
  const { t, dir } = useI18n()
  const { visible, stages } = useQuestProgress()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()
  const wide = useWide()
  const { W, H, slots, dots, lines, vars } = wide ? LANDSCAPE : PORTRAIT
  const pctX = (v: number) => `${(v / W) * 100}%`
  const pctY = (v: number) => `${(v / H) * 100}%`

  const lastRequired = stages.find((s) => s.id === REQUIRED_STAGES[REQUIRED_STAGES.length - 1])
  const canContinueToProcedures = lastRequired?.status === 'done'
  const journey = t('journey.journeyStages', journeyStages)

  const items = [
    ...REQUIRED_STAGES.map((id) => {
      const skin = theme.stages[id]
      const data = journey.find((j) => j.id === id)
      return {
        id,
        label: skin?.label ?? data?.title ?? id,
        hint: skin?.hint ?? '',
        status: visible.find((s) => s.id === id)?.status ?? 'locked',
        to: id === 'wait-before-triage' ? '/wait-times' : `/stage/${id}`,
      }
    }),
    {
      id: 'procedures',
      label: t('ui.buttons.selectProcedures', 'בחירת בדיקות'),
      hint: t('ui.text.procedurePrompt', 'בחרו את הפרוצדורות שנקבעו'),
      status: canContinueToProcedures ? 'active' : 'locked',
      to: '/procedures',
    },
  ]

  return (
    <div className={wide ? `${css.oceanMap} ${css.oceanMapWide}` : css.oceanMap}>
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
      <div
        className={wide ? `${css.oceanScene} ${css.oceanSceneWide}` : css.oceanScene}
        style={{ aspectRatio: `${W} / ${H}`, '--u': `calc(100cqw / ${W})`, ...vars } as React.CSSProperties}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className={css.oceanPath} aria-hidden>
          {dots?.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8} />)}
          {lines?.map((pts, i) => <path key={i} d={`M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')}`} />)}
        </svg>
        <h1 className={css.oceanTitle}>
          {(() => {
            const text = t('ui.text.oceanHeadline', 'המסע שלך מתחיל כאן')
            const cut = text.lastIndexOf(' ')
            return <span>{text.slice(0, cut + 1)}<strong>{text.slice(cut + 1)}</strong></span>
          })()}
        </h1>
        {items.map((item, i) => {
          const slot = slots[i]
          const locked = item.status === 'locked'
          const go = () => !locked && navigate(conceptPath(item.to))
          return (
            <div
              key={item.id}
              className={[css.oceanStage, css[`pin--${item.status}`]].join(' ')}
              onClick={go}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go()}
              role="button"
              tabIndex={locked ? -1 : 0}
              aria-disabled={locked}
              aria-label={item.label}
            >
              <img
                src={OCEAN_IMAGES[item.id]}
                alt=""
                className={css.oceanObj}
                style={{ left: pctX(slot.x), top: pctY(slot.y), width: pctX(slot.w), transform: slot.flip ? 'scaleX(-1)' : undefined }}
              />
              {item.status === 'done' && (
                <span
                  className={css.oceanStar}
                  style={{ left: pctX(slot.x + slot.w / 2), top: pctY(slot.y + slot.h * 0.88) }}
                  aria-label={t('ui.text.done', 'בוצע')}
                >
                  ⭐
                </span>
              )}
              <div
                className={css.oceanBubble}
                style={{ left: pctX(slot.badge[0]), top: pctY(slot.badge[1]) }}
              >
                <span className={css.oceanNum} aria-label={item.label}>{i + 1}</span>
              </div>
            </div>
          )
        })}
      </div>
      {!underSheet && <ParentInfo ocean wide={wide} />}
    </div>
  )
}
