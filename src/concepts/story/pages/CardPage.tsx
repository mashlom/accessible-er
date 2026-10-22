import { useNavigate } from 'react-router-dom'
import { Link } from '../../nav'
import { Scene } from '../components/kit'
import { useI18n } from '../../../hooks/useI18n'
import { CareCardForm } from '../../../components/careCard/CareCardForm'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/**
 * "My card" — the care card as the parent fills it in. The same form and the same
 * layout as the ocean world's card page (src/concepts/quest/pages/CardPage.tsx).
 */
export function CardPage() {
  const { t } = useI18n()
  const navigate = useNavigate()

  return (
    <Scene title={`🪪 ${t('ui.tiles.card.title')}`} subtitle={t('ui.labels.adult.cardSubtitle')}>
      <div className={styles.actions} style={{ marginBottom: 'var(--space-4)' }}>
        <button type="button" className={shell.ghostBtn} onClick={() => navigate(-1)}>
          {t('ui.buttons.back')}
        </button>
      </div>

      <CareCardForm
        colours={{ accent: '#087e8b', accentSoft: '#e5f2f7', accentText: '#ffffff' }}
        footer={({ empty, clear }) => (
          <div className={styles.actions}>
            <Link to="/card/view" className={shell.bigBtn} aria-disabled={empty} style={empty ? { pointerEvents: 'none', opacity: 0.5 } : undefined}>
              {t('ui.buttons.showCardNext')}
            </Link>
            {!empty && (
              <button type="button" className={shell.ghostBtn} onClick={clear}>
                {t('ui.buttons.clear')}
              </button>
            )}
          </div>
        )}
      />
    </Scene>
  )
}
