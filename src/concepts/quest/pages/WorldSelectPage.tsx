import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { themes } from '../themes'
import { useQuestTheme } from '../useQuestTheme'
import css from '../quest.module.css'

export function WorldSelectPage() {
  const { setThemeId } = useQuestTheme()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()

  function choose(id: string) {
    setThemeId(id)
    navigate(conceptPath('/map'))
  }

  const main = themes.filter((t) => t.id !== 'real')
  const real = themes.find((t) => t.id === 'real')!

  return (
    <div className={css.selectPage}>
      <h1 className={css.selectTitle}>באיזה עולם תרצה/י לבקר?</h1>
      <p className={css.selectSub}>בחר/י עולם — ותתחיל/י את המסע שלך</p>

      <div className={css.worldGrid}>
        {main.map((theme) => (
          <button
            key={theme.id}
            className={css.worldCard}
            style={{ '--accent': theme.accent, '--accent-soft': theme.accentSoft } as React.CSSProperties}
            onClick={() => choose(theme.id)}
            aria-label={`בחר עולם: ${theme.name}`}
          >
            <span className={css.worldEmoji}>{theme.emoji}</span>
            <span className={css.worldName}>{theme.name}</span>
          </button>
        ))}
      </div>

      <button
        className={css.realCard}
        style={{ '--accent': real.accent, '--accent-soft': real.accentSoft } as React.CSSProperties}
        onClick={() => choose(real.id)}
        aria-label={`בחר עולם: ${real.name}`}
      >
        <span className={css.worldEmoji}>{real.emoji}</span>
        <span className={css.realLabel}>
          <strong>{real.name}</strong>
          <span>מפת בית החולים — לילדים גדולים ולהורים</span>
        </span>
      </button>
    </div>
  )
}
