import { useI18n } from '../hooks/useI18n'
import { Link } from '../concepts/nav'
import { PageHeader } from './ui'
import { CareCardForm } from '../components/careCard/CareCardForm'
import styles from './CareCardPage.module.css'

/** The care card, as the parent fills it in from the home screen: the same form as on every other screen. */
export function CareCardPage() {
  const { t } = useI18n()

  return (
    <div className="container">
      <PageHeader
        eyebrow={t('ui.labels.adult.cardTitle')}
        title={t('ui.tiles.card.title')}
        subtitle={t('ui.labels.adult.cardSubtitle')}
      />

      <CareCardForm
        colours={{ accent: '#087e8b', accentSoft: '#e5f2f7', accentText: '#ffffff' }}
        footer={({ empty, clear }) => (
          <div className={styles.actions}>
            <Link to="/card/view" className={`${styles.showBtn} ${empty ? styles.showBtnDisabled : ''}`} aria-disabled={empty}>
              {t('ui.buttons.showCardNext').replace(' ←', '')}
            </Link>
            {!empty && (
              <button type="button" className={styles.clearBtn} onClick={clear}>
                {t('ui.buttons.clear')}
              </button>
            )}
          </div>
        )}
      />
    </div>
  )
}
