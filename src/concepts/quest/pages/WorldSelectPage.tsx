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
    navigate(conceptPath(`/world/${id}`))
  }

  const ORDER = ['ocean', 'knight', 'dollhouse', 'real', 'dino', 'fairy', 'safari', 'space']
  const ordered = [
    ...ORDER.map((id) => themes.find((t) => t.id === id)!).filter(Boolean),
    ...themes.filter((t) => !ORDER.includes(t.id)),
  ]

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
            aria-label={`${t('ui.buttons.chooseWorldAria', 'בחר עולם:')} ${name}`}
          >
            {theme.thumbnailOverlay ? (
              <div
                className={css.worldCardBackdrop}
                style={{ backgroundImage: `url(${theme.thumbnail ?? theme.bg})` }}
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
              {t('ui.buttons.startJourney', 'להתחיל במסע')}
            </span>
          </button>
          )
        })}
      </div>
    </div>
  )
}
