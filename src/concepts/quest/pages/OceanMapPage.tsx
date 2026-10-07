import { useNavigate } from 'react-router-dom'
import { Link, useConceptPath } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, REQUIRED_STAGES } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import css from '../quest.module.css'

type Box = { left?: number; right?: number; top: number; width: number }
type Slot = { obj: Box; bubble: Box; flip?: boolean; bubbleFront?: boolean }

// Percent coordinates on the 830×2700 scene; stages 1–3 traced from the mockup,
// 4–6 continue the same left/right rhythm below. Bubbles sit behind the object
// unless bubbleFront is set, so an object may overlap a bubble's edge, not vice versa.
const LAYOUT: Slot[] = [
  { obj: { left: -2, top: 1.02, width: 44 }, bubble: { left: 25, top: 3.33, width: 50 }, flip: true, bubbleFront: true },
  { obj: { left: 22, top: 19.63, width: 52 }, bubble: { left: 54, top: 20, width: 44 } },
  { obj: { left: 45, top: 35.37, width: 55 }, bubble: { right: 42, top: 36.3, width: 40 } },
  { obj: { left: 0, top: 51.85, width: 48 }, bubble: { left: 29.5, top: 52.22, width: 44 } },
  { obj: { left: 46, top: 66.67, width: 50 }, bubble: { right: 42, top: 67.04, width: 40 } },
  { obj: { left: 54, top: 79.63, width: 46 }, bubble: { right: 29, top: 83.5, width: 40 } },
]

export const OCEAN_IMAGES: Record<string, string> = {
  reception: '/worlds/ocean/wharf.png',
  'wait-before-triage': '/worlds/ocean/submarine.png',
  triage: '/worlds/ocean/checkup.png',
  'wait-doctor': '/worlds/ocean/submarine.png',
  doctor: '/worlds/ocean/submarine.png',
  procedures: '/worlds/ocean/wharf.png',
}

const side = (b: Box): React.CSSProperties =>
  b.right !== undefined ? { right: `${b.right}%` } : { left: `${b.left ?? 0}%` }

const pct = (b: Box): React.CSSProperties => ({ ...side(b), top: `${b.top}%`, width: `${b.width}%` })

export function OceanMapPage() {
  const { theme } = useQuestTheme()
  const { t, dir } = useI18n()
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
      <header className={css.oceanHeader}>
        <div className={css.oceanHeaderRow}>
          <Link to="/" className={css.oceanHeaderBack} aria-label={t('ui.shell.worlds', 'לבחירת עולם אחר')}>
            <span aria-hidden>{dir === 'rtl' ? '→' : '←'}</span>
          </Link>
          <span>{t('ui.text.oceanTopbar', 'המסע שלך בעולם התת-ימי')}</span>
        </div>
        <h1 className={css.oceanHeadline}>{t('ui.text.oceanHeadline', 'המסע שלך מתחיל כאן')}</h1>
        <p className={css.oceanSub}>{t('ui.text.oceanSub', 'בוא נראה מה מחכה לך בדרך')}</p>
      </header>

      <div className={css.oceanScene} style={{ '--scene-bg': `url(${theme.bg})` } as React.CSSProperties}>
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
                style={{ ...pct(slot.obj), transform: slot.flip ? 'scaleX(-1)' : undefined }}
              />
              <div
                className={css.oceanBubble}
                style={{
                  ...side(slot.bubble),
                  top: `${slot.bubble.top}%`,
                  maxWidth: `${slot.bubble.width}%`,
                  zIndex: slot.bubbleFront ? 3 : 1,
                }}
              >
                <h3>
                  <span className={css.oceanNum} aria-hidden>{i + 1}</span>
                  {item.label}
                  {item.status === 'done' && <span className={css.oceanDone}>{theme.doneEmoji ?? '✓'}</span>}
                </h3>
                {item.hint && <p>{item.hint}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
