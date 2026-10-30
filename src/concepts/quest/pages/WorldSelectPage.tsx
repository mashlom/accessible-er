import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { themes } from '../themes'
import { useQuestTheme } from '../useQuestTheme'
import { worldText, type WorldLang } from '../../../data/child/worlds'
import childUi from '../../../data/child/ui.json'
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
      <h1 className={css.selectTitle}>{(childUi[lang as WorldLang] ?? childUi.he).worlds.title}</h1>
      <p className={css.selectSub}>{(childUi[lang as WorldLang] ?? childUi.he).worlds.subtitle}</p>

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
                  backgroundImage: [
                    // a plain sky over the picture's own (it ends just above the land behind the station)
                    theme.thumbnailSky ? `linear-gradient(${theme.thumbnailSky} 42%, transparent 50%)` : '',
                    `url(${theme.thumbnail ?? theme.bg})`,
                  ].filter(Boolean).join(', '),
                  // with its own sky: a piece of the ground only (lower in the picture, under its sky and planets)
                  backgroundSize: theme.thumbnailSky ? '100% 100%, 280%' : undefined,
                  backgroundPosition: theme.thumbnailSky ? 'center, center 62%' : undefined,
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
            <span className={css.worldCardCta}>
              <span className={css.worldCardArrow} aria-hidden>↖</span>
              {t('ui.buttons.playWorld')}
            </span>
          </button>
          )
        })}
      </div>
    </div>
  )
}
