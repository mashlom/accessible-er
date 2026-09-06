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

  const ORDER = ['real', 'knight', 'dino', 'ocean', 'fairy', 'safari', 'space']
  const ordered = [
    ...ORDER.map((id) => themes.find((t) => t.id === id)!).filter(Boolean),
    ...themes.filter((t) => !ORDER.includes(t.id)),
  ]

  return (
    <div className={css.selectPage}>
      <h1 className={css.selectTitle}>איזה עולם מחכה לך?</h1>
      <p className={css.selectSub}>בחרו עולם — ויוצאים למסע</p>

      <div className={css.worldGrid}>
        {ordered.map((theme) => (
          <button
            key={theme.id}
            className={css.worldCard}
            style={{ '--accent': theme.accent, '--accent-soft': theme.accentSoft } as React.CSSProperties}
            onClick={() => choose(theme.id)}
            aria-label={`בחר עולם: ${theme.name}`}
          >
            {(theme.thumbnail ?? theme.bg) ? (
              <img src={theme.thumbnail ?? theme.bg} alt="" className={css.worldCardImg} />
            ) : (
              <span className={css.worldEmoji}>{theme.emoji}</span>
            )}
            <span className={css.worldCardLabel} style={{ background: theme.accent }}>
              {theme.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
