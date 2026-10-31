import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { themes } from '../themes'
import { useQuestTheme } from '../useQuestTheme'
import { worldText, type WorldLang } from '../../../data/child/worlds'
import { useI18n } from '../../../hooks/useI18n'
import css from '../quest.module.css'

export function WorldSelectPage() {
  const { setThemeId } = useQuestTheme()
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()

  function choose(id: string) {
    setThemeId(id)
    // the world's own address, so the address bar can be copied and sent
    navigate(conceptPath(`/${id}`))
  }

  // the worlds come in their own order (world.json, order)
  const ordered = themes

  return (
    <div className={css.selectPage}>
      <div className={css.worldGrid}>
        {ordered.map((theme) => {
          // the world's name comes from its texts file, in the chosen language
          const name = worldText(theme.id, lang as WorldLang)?.name ?? theme.name ?? ''
          return (
          <button
            key={theme.id}
            className={css.worldCard}
            style={{ '--accent': theme.accent, '--accent-soft': theme.accentSoft } as React.CSSProperties}
            onClick={() => choose(theme.id)}
            aria-label={`${t('ui.buttons.chooseWorldAria')} ${name}`}
          >
            {theme.thumbnailOverlay ? (
              <div
                // a map picture: its upper part, with plenty of sky over the land (the ocean has its own picture)
                className={theme.thumbnail ? `${css.worldCardBackdrop} ${css.worldCardBackdropSky}` : css.worldCardBackdrop}
                style={{
                  backgroundImage: `url(${theme.thumbnail ?? theme.bg})`,
                  backgroundSize: theme.thumbnailPiece?.size,
                  backgroundPosition: theme.thumbnailPiece?.position,
                }}
              >
                <img src={theme.thumbnailOverlay} alt="" className={css.worldCardOverlay} />
              </div>
            ) : (theme.thumbnail ?? theme.bg) ? (
              <img src={theme.thumbnail ?? theme.bg} alt="" className={css.worldCardImg} />
            ) : (
              <span className={css.worldEmoji}>{theme.emoji}</span>
            )}
            <span className={css.worldCardName}>{name}</span>
          </button>
          )
        })}
      </div>
    </div>
  )
}
