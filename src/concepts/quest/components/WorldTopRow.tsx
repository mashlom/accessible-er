import { useGoBackTo } from '../../nav'
import { WORLD_SELECT } from './WorldScope'
import { useWide } from '../pages/WorldMapPage'
import { useI18n } from '../../../hooks/useI18n'
import { LanguagePicker } from '../../../components/LanguagePicker'
import css from '../quest.module.css'

/**
 * The world's top row: the adult's three buttons, all outlined like the language button — the home page (Shevi's
 * house) in one corner, the world choice (four squares) in the middle, the language at the other edge. On the light
 * shop page they are drawn dark.
 */
export function WorldTopRow({ light }: { light?: boolean }) {
  const { t } = useI18n()
  const wide = useWide()
  const goBackTo = useGoBackTo()
  return (
    <div className={[css.worldTopRow, wide ? css.worldTopRowWide : '', css.worldTopRowCorner, light ? css.worldTopLight : ''].join(' ')}>
      {/* the home page in one corner, the world choice in the middle, the language at the other edge */}
      <a href="#/" className={`${css.worldPill} ${css.worldTopStart}`}>
        {/* the house from Shevi's mockup */}
        <svg viewBox="0 0 24 24" aria-hidden className={css.worldPillIcon}>
          <path d="M4 11l8-7 8 7M6 10v9h4v-5h4v5h4v-9" />
        </svg>
        {t('ui.shell.home')}
      </a>
      <button type="button" className={`${css.worldPill} ${css.worldTopMiddle}`} onClick={() => goBackTo(WORLD_SELECT, { absolute: true })}>
        <svg viewBox="0 0 24 24" aria-hidden className={css.worldPillIcon}>
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </svg>
        {t('ui.shell.chooseWorld')}
      </button>
      <div className={css.worldTopEnd}>
        <LanguagePicker variant={light ? undefined : 'overlay'} />
      </div>
    </div>
  )
}
