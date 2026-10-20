import { keyed } from '../../../lib/keyed'
import { Link } from '../../nav'
import { useI18n } from '../../../hooks/useI18n'
import parentUi from '../../../data/parent/ui.json'
import talkJson from '../../../data/parent/talk.json'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { useSessionAvatar } from '../../../hooks/useSessionAvatar'
import { DAY_MS } from '../../../lib/storage'
import { emptyCard, isCardEmpty, type CareCard } from '../../../data/careCard'
import { CareCardView, careCardHeading } from '../../../components/careCard/CareCardView'
import styles from '../talk.module.css'

type Lang = 'he' | 'en' | 'ru'

/** The card as the staff reads it: the same view as on every other screen, in the helper's frame. */
export function CardViewPage() {
  const { lang } = useI18n()
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  const [avatar] = useSessionAvatar()
  const talkTx = keyed((talkJson as unknown as Record<Lang, { cardView: { back: string; emptyText: string } }>)[lang], 'parent/talk').cardView
  const emptyTitle = keyed((parentUi as unknown as Record<Lang, { card: { empty: { title: string } } }>)[lang], 'parent/ui').card.empty.title

  if (isCardEmpty(card)) {
    return (
      <div id="main" className={styles.doc}>
        <div className={styles.docInner} style={{ textAlign: 'center' }}>
          <h1 className={styles.docTitle}>{emptyTitle}</h1>
          <p>{talkTx.emptyText}</p>
          <Link to="/" className={styles.docBtn}>
            {talkTx.back}
          </Link>
        </div>
      </div>
    )
  }

  const heading = careCardHeading(card, lang)

  return (
    <div id="main" className={styles.doc}>
      <div className={styles.docInner}>
        <div className={`${styles.idCard} print-area`}>
          <div className={styles.idHead}>
            <span className={styles.idFace} aria-hidden>
              {avatar.kind === 'photo' ? <img src={avatar.value} alt="" /> : avatar.value}
            </span>
            <div>
              <div className={styles.idTitle}>{heading.title}</div>
              {heading.age && <div>{heading.age}</div>}
            </div>
          </div>
          <CareCardView
            footer={({ print }) => (
              <div className="no-print" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button type="button" className={styles.docBtn} onClick={print}>
                  📄 {keyed((parentUi as unknown as Record<Lang, { cardView: { savePdf: string } }>)[lang], 'parent/ui').cardView.savePdf}
                </button>
                <Link to="/" className={`${styles.docBtn} ${styles.docBtnGhost}`}>
                  ↩️ {talkTx.back}
                </Link>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  )
}
