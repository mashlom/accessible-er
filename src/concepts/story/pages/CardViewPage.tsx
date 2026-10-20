import { Link } from '../../nav'
import { Roni } from '../../../components/Roni'
import { Note } from '../components/kit'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { useSessionAvatar } from '../../../hooks/useSessionAvatar'
import { DAY_MS } from '../../../lib/storage'
import { emptyCard, isCardEmpty, type CareCard } from '../../../data/careCard'
import { useI18n } from '../../../hooks/useI18n'
import { CareCardView, careCardHeading } from '../../../components/careCard/CareCardView'
import parentUi from '../../../data/parent/ui.json'
import shell from '../story.module.css'
import styles from '../pages.module.css'

type Lang = 'he' | 'en' | 'ru'

/** The card as the staff reads it: the same view as on every other screen, in this screen's frame. */
export function CardViewPage() {
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  const [avatar] = useSessionAvatar()
  const { lang, dir } = useI18n()
  const tx = (parentUi as unknown as Record<Lang, { cardView: Record<string, string> }>)[lang].cardView
  const emptyTexts = (parentUi as unknown as Record<Lang, { card: { empty: { title: string; hint: string } } }>)[lang].card.empty

  if (isCardEmpty(card)) {
    return (
      <div className={shell.page} dir={dir} lang={lang}>
        <div className={styles.emptyState}>
          <Roni size={120} mood="curious" float />
          <h1 className={shell.sceneTitle}>{emptyTexts.title}</h1>
          <p style={{ color: 'var(--s-ink-soft)' }}>{emptyTexts.hint}</p>
          <Link to="/card" className={shell.bigBtn}>
            {tx.fill}
          </Link>
        </div>
      </div>
    )
  }

  const heading = careCardHeading(card, lang)

  return (
    <div className={shell.page} dir={dir} lang={lang}>
      {/* the card itself is RTL — the staff reads it */}
      <div className={`${styles.idCard} print-area`} dir="rtl" lang="he">
        <div className={styles.idHead}>
          <span className={styles.idFace} aria-hidden>
            {avatar.kind === 'photo' ? <img src={avatar.value} alt="" /> : avatar.value}
          </span>
          <div>
            <div className={styles.idTitle}>{heading.title}</div>
            {heading.age && <div className={styles.idAge}>{heading.age}</div>}
          </div>
        </div>
      </div>

      <div className={`${styles.idCard} print-area`} dir="rtl" lang="he">
        <CareCardView
          footer={({ print }) => (
            <div className={`${styles.actions} no-print`}>
              <button type="button" className={shell.bigBtn} onClick={print}>
                {tx.savePdf}
              </button>
              <Link to="/card" className={shell.ghostBtn}>
                {tx.edit}
              </Link>
            </div>
          )}
        />
      </div>

      <div className="no-print" style={{ marginTop: 'var(--space-4)' }}>
        <Note>{tx.sendHint}</Note>
      </div>
    </div>
  )
}
