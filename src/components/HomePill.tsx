import { useI18n } from '../hooks/useI18n'
import styles from './HomePill.module.css'

/** «דף הבית» with Shevi's house, as in the children's worlds, for the parents' pages (beside the language button) */
export function HomePill() {
  const { t } = useI18n()
  return (
    <a href="#/" className={styles.pill}>
      <svg viewBox="0 0 24 24" aria-hidden className={styles.icon}>
        <path d="M4 11l8-7 8 7M6 10v9h4v-5h4v5h4v-9" />
      </svg>
      {t('ui.shell.home')}
    </a>
  )
}
