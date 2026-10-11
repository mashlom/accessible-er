import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, REQUIRED_STAGES } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { ParentInfo } from '../components/ParentInfo'
import css from '../quest.module.css'

type Pt = [number, number]
/** All coordinates are in the Figma frame's units (W×H): object box (x, y, width), badge center */
type Slot = { x: number; y: number; w: number; h: number; badge: Pt; flip?: boolean }

// Frame 427319612 in Figma is 412×939; stations 1–5 and their pictures are cut from its SVG export
// (each picture is exactly its mask's bounding box). Station 6 (procedure choice) isn't in the
// mockup and continues the same rhythm below with the house mirrored.
const W = 412
const H = 1050

const LAYOUT: Slot[] = [
  { x: -27, y: 108, w: 211, h: 220, badge: [93, 176] },
  { x: 235, y: 237, w: 227, h: 169, badge: [266, 277] },
  { x: -26, y: 414, w: 287, h: 185, badge: [117, 410] },
  { x: 206, y: 563, w: 287, h: 185, badge: [337, 561] },
  { x: -56, y: 698, w: 262, h: 169, badge: [201, 792] },
  { x: 228, y: 815, w: 211, h: 220, badge: [319, 883], flip: true },
]

/** Dot centers of each trail from the mockup: trail i runs from station i+1's edge to station i+2's number */
const TRAILS: Pt[][] = [
  [[180, 271], [184, 268], [189, 266], [195, 263], [201, 262], [207, 260], [213, 260], [219, 259], [225, 260], [231, 260], [237, 262], [243, 264], [248, 266], [254, 269], [259, 272], [264, 275]],
  [[252, 380], [247, 382], [241, 383], [235, 382], [229, 382], [223, 381], [217, 380], [211, 380], [205, 379], [199, 378], [194, 378], [188, 377], [182, 377], [176, 378], [170, 378], [164, 379], [158, 380], [152, 381], [147, 383], [141, 386], [136, 389], [131, 393], [127, 397], [123, 401], [120, 406]],
  [[243, 527], [248, 525], [254, 523], [260, 523], [266, 525], [272, 527], [277, 531], [281, 535], [285, 540], [290, 544], [294, 548], [299, 552], [304, 555], [309, 558], [315, 560], [321, 562], [327, 562]],
  [[304, 744], [299, 745], [293, 747], [287, 749], [282, 751], [276, 754], [271, 756], [266, 760], [261, 763], [256, 767], [251, 770], [247, 774], [242, 778], [237, 782], [233, 786], [227, 789], [222, 791], [216, 793], [210, 793], [204, 793]],
  sampleArc([195, 830], [319, 883]),
]

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

export const OCEAN_IMAGES: Record<string, string> = {
  reception: '/worlds/ocean/station-house.png',
  'wait-before-triage': '/worlds/ocean/station-sub.png',
  triage: '/worlds/ocean/station-pod.png',
  'wait-doctor': '/worlds/ocean/station-pod.png',
  doctor: '/worlds/ocean/station-doctor.png',
  procedures: '/worlds/ocean/station-house.png',
}

const pctX = (v: number) => `${(v / W) * 100}%`
const pctY = (v: number) => `${(v / H) * 100}%`

/** underSheet: rendered behind a stage sheet, which has its own parent-info pill */
export function OceanMapPage({ underSheet }: { underSheet?: boolean } = {}) {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const { visible, stages } = useQuestProgress()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()

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
    <div className={css.oceanMap}>
      <div className={css.oceanScene} style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className={css.oceanPath} aria-hidden>
          {TRAILS.flat().map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8} />)}
        </svg>
        <h1 className={css.oceanTitle}>
          {(() => {
            const text = t('ui.text.oceanHeadline', 'המסע שלך מתחיל כאן')
            const cut = text.lastIndexOf(' ')
            return <span>{text.slice(0, cut + 1)}<strong>{text.slice(cut + 1)}</strong></span>
          })()}
        </h1>
        {items.map((item, i) => {
          const slot = LAYOUT[i]
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
      {!underSheet && <ParentInfo nav ocean />}
    </div>
  )
}
