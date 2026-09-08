import { Link } from '../../nav'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import css from '../quest.module.css'

export function ShopPage() {
  const { theme } = useQuestTheme()
  const { reset } = useQuestProgress()

  return (
    <div className={css.shopPage} style={{ background: '#000' }}>
      {theme.shopImage && (
        <img src={theme.shopImage} alt="" className={css.shopImg} />
      )}
      <div className={css.shopActions}>
        <Link to="/">
          <button
            className={css.backBtn}
            style={{ borderColor: theme.accent, color: theme.accent, background: 'rgba(255,255,255,0.9)' }}
            onClick={reset}
          >
            לבחירת עולם →
          </button>
        </Link>
      </div>
    </div>
  )
}
