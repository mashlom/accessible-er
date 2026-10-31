import { Outlet, useLocation } from 'react-router-dom'
import { useLayoutEffect } from 'react'
import { Link, useBack, useIsConceptHome } from '../../nav'
import { designVars } from '../themes'
import { REQUIRED_STAGES, useQuestProgress } from '../useQuestProgress'
import { useQuestTheme } from '../useQuestTheme'
import { HomePill } from '../../../components/HomePill'
import { LanguagePicker } from '../../../components/LanguagePicker'
import { setI18nEnabled, useI18n } from '../../../hooks/useI18n'
import childUi from '../../../data/child/ui.json'
import { type WorldLang } from '../../../data/child/worlds'
import css from '../quest.module.css'

/**
 * Frame of the quest concept: a slim sticky header (back + quick link to
 * the current map + concept menu) plus the routed page content.
 *
 * Per Rotem's feedback (issue #8) — every deep screen (calm, card, reason,
 * distract, procedure detail…) needs a fast way back to the map, not just
 * a "back one step" button. The target map depends on progress: while a
 * required stage is still active, that's the day map; once the day is
 * done and optional stages are revealed, it's the night map.
 */
export function QuestShell() {
  const back = useBack()
  const { pathname } = useLocation()
  const isHome = useIsConceptHome()
  const { active, visibleOptionals } = useQuestProgress()
  const { theme } = useQuestTheme()
  const { lang, dir, t } = useI18n()
  const selectUi = childUi[lang as WorldLang] ?? childUi.he
  // a designed world (world.json has a design): its own map header, sheets and colours
  const designed = !!theme.design && !isHome

  // translations are on for the whole child side (the worlds and their screens), not only for the ocean
  useLayoutEffect(() => {
    setI18nEnabled(true)
    return () => setI18nEnabled(false)
  }, [])

  const dayActive = active && (REQUIRED_STAGES as readonly string[]).includes(active.id)
  const mapTarget = dayActive || visibleOptionals.length === 0 ? '/map' : '/second-map'
  // the world's map: /quest/<world>/map, /quest/<world>/second-map or the world's own address /quest/<world>
  // (night-map is only the old address of second-map and redirects to it)
  const isMapPage = /\/(second-)?map$/.test(pathname) || /^\/quest\/[^/]+\/?$/.test(pathname)
  // the sheets over the map: the map under them is drawn with its own header
  const isSheet = /\/(stage\/[^/]+|wait-times|procedures|procedure\/[^/]+|celebrate|shop)$/.test(pathname)
  // A designed world's maps carry their own language picker and menu link in their header row
  const hideTopbar = designed && (isMapPage || isSheet)

  return (
    <div
      className={`${css.questShell} ${designed ? css.questShellWorld : ''}`}
      style={designed ? designVars(theme.design) : undefined}
      dir={dir}
      lang={lang}
    >
      {/* Pinned RTL so the top bar doesn't flip when the language changes */}
      {!hideTopbar && <header className={`${css.questTopbar} ${designed ? css.questTopbarWorld : ''} app-no-print`} dir="rtl">
        {!isHome ? (
          <button
            type="button"
            className={css.questTopBtn}
            // the previous screen; on the first screen of the visit (a link that was sent), the map
            onClick={() => back(mapTarget)}
            aria-label={t('ui.buttons.back')}
          >
            <span aria-hidden>›</span>
          </button>
        ) : (
          // the world choice: the same home pill as the parent pages, on the other side from the language
          <div style={{ display: 'flex', paddingInlineStart: '0.5rem' }}><HomePill /></div>
        )}

        {/* not on the world choice: with no world chosen, the map would only lead back here */}
        {!isMapPage && !isHome ? (
          // words, not a picture: these buttons are for the adult (the map of the journey in this world)
          <Link to={mapTarget} className={`${css.questTopBrand} ${css.navWord}`}>
            {t('ui.shell.map')}
          </Link>
        ) : isHome ? (
          // the world choice: its question on the bar, right between the buttons
          <div className={css.selectBarText}>
            <h1 className={css.selectTitle}>{selectUi.worlds.title}</h1>
            <p className={css.selectSub}>{selectUi.worlds.subtitle}</p>
          </div>
        ) : (
          <span className={css.questTopBrand} aria-hidden />
        )}

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1, justifyContent: 'flex-end', paddingInlineEnd: '0.5rem' }}>
          <LanguagePicker />
          {!isHome && <>
          {/* children's screens: the word, not a picture (Rakheli's review, #37); the parents' pages keep the house */}
          <a href="#/" className={`${css.questTopBtn} ${css.navWord}`}>
            {t('ui.shell.home')}
          </a>
          </>}
        </div>
      </header>}
      <main id="main">
        <Outlet />
      </main>
    </div>
  )
}
