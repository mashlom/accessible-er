import { Link } from '../../nav'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import css from '../quest.module.css'

export function ShopPage() {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const { reset, doneProcedures } = useQuestProgress()
  const doneCount = doneProcedures.size

  return (
    <div className={css.shopPage} style={{ background: '#000' }}>
      {theme.shopImage && (
        <img src={theme.shopImage} alt="" className={css.shopImg} />
      )}
      {doneCount > 0 && (
        <p className={css.shopCoins}>
          {Array.from({ length: doneCount }, (_, i) => (
            <span key={i} className={css.coinCounterItem}>{theme.doneEmoji ?? '✓'}</span>
          ))}
        </p>
      )}
      <div className={css.shopActions}>
        <Link to="/">
          <button
            className={css.backBtn}
            style={{ borderColor: theme.accent, color: theme.accent, background: 'rgba(255,255,255,0.9)' }}
            onClick={reset}
          >
            {t('ui.buttons.chooseWorld', 'לבחירת עולם →')}
          </button>
        </Link>
      </div>
    </div>
  )
}
