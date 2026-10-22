import { keyed } from '../../../lib/keyed'
import { Link } from '../../nav'
import { Scene, Bubble } from '../components/kit'
import { useI18n } from '../../../hooks/useI18n'
import homeTexts from '../../../data/parent/home.json'
import { CareCardForm } from '../../../components/careCard/CareCardForm'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/**
 * "My card" — the care card as the parent fills it in. The same form as
 * on every other screen (src/components/careCard); this screen gives its frame.
 */
export function CardPage() {
  const { lang, dir, t } = useI18n()
  const tx = keyed(homeTexts[lang as 'he' | 'en' | 'ru'], 'parent/home').cardPage ?? keyed(homeTexts.he, 'parent/home').cardPage

  return (
    <div dir={dir} lang={lang} style={{ textAlign: 'start' }}>
      <Scene title={t('ui.tiles.card.title')} subtitle={t('ui.text.cardSubtitle')}>
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <Bubble>{tx.bubble}</Bubble>
        </div>

        <CareCardForm
          colours={{ accent: '#087e8b', accentSoft: '#e5f2f7', accentText: '#ffffff' }}
          footer={({ empty, clear }) => (
            <div className={styles.actions}>
              <Link to="/card/view" className={shell.bigBtn} aria-disabled={empty} style={empty ? { pointerEvents: 'none', opacity: 0.5 } : undefined}>
                {tx.show}
              </Link>
              {!empty && (
                <button type="button" className={shell.ghostBtn} onClick={clear}>
                  {tx.clear}
                </button>
              )}
            </div>
          )}
        />
      </Scene>
    </div>
  )
}
