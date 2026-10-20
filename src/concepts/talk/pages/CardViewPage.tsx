import { Link } from '../../nav'
import { useI18n } from '../../../hooks/useI18n'
import parentUi from '../../../data/parent/ui.json'
import talkJson from '../../../data/parent/talk.json'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { useSessionAvatar } from '../../../hooks/useSessionAvatar'
import { DAY_MS } from '../../../lib/storage'
import {
  emptyCard,
  emptyCustom,
  isCardEmpty,
  suggestedAdaptations,
  type CareCard,
} from '../../../data/careCard'
import styles from '../talk.module.css'

/**
 * The one screen in concept 3 that is not a conversation: the card the
 * parent physically holds up to staff. It needs to be big, still, printable
 * and on a light ground, so it steps out of the dusk theme on purpose.
 */
type CardTexts = { viewTitle: string; viewTitleNoName: string; age: string; nameFallback: string; rows: Record<string, string> }

export function CardViewPage() {
  const { lang } = useI18n()
  const cardTx = (parentUi as unknown as Record<'he' | 'en' | 'ru', { card: CardTexts }>)[lang].card
  // the card's labels are Hebrew, like its values: the staff reads the card in Hebrew (the note says so)
  const heRows = (parentUi as unknown as Record<'he', { card: { rows: Record<string, string> } }>).he.card.rows
  const cardViewTx = (parentUi as unknown as Record<'he' | 'en' | 'ru', { cardView: { emptyTitle: string } }>)[lang].cardView
  const talkTx = (talkJson as unknown as Record<'he' | 'en' | 'ru', { cardView: { back: string; emptyText: string } }>)[lang].cardView
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  const [avatar] = useSessionAvatar()

  if (isCardEmpty(card)) {
    return (
      <div id="main" className={styles.doc}>
        <div className={styles.docInner} style={{ textAlign: 'center' }}>
          <h1 className={styles.docTitle}>{cardViewTx.emptyTitle}</h1>
          <p>{talkTx.emptyText}</p>
          <Link to="/" className={styles.docBtn}>
            {talkTx.back}
          </Link>
        </div>
      </div>
    )
  }

  const c = card.custom ?? emptyCustom
  const join = (...parts: string[]) =>
    parts
      .map((p) => p.trim())
      .filter(Boolean)
      .join(' · ')

  const rows = [
    { emoji: '💬', label: heRows.communication, value: join(...card.communication, c.communication) },
    { emoji: '⚠️', label: heRows.sensitivities, value: join(...card.sensitivities, c.sensitivities) },
    { emoji: '💛', label: heRows.calming, value: join(...card.calming, c.calming) },
    {
      emoji: '🚫',
      label: heRows.avoid,
      value: join(...card.escalators, ...card.avoid, c.escalators, c.avoid),
    },
    { emoji: '🩺', label: heRows.hardMoments, value: join(...card.hardMoments, c.hardMoments) },
    { emoji: '🤕', label: heRows.pain, value: join(...card.pain, c.pain) },
    { emoji: '✏️', label: heRows.freeNote, value: card.freeNote.trim() },
  ].filter((r) => r.value)

  const suggestions = suggestedAdaptations(card)
  const name = card.nickname.trim()

  return (
    <div id="main" className={styles.doc}>
      <div className={styles.docInner}>
        <div className={`${styles.idCard} print-area`}>
          <div className={styles.idHead}>
            <span className={styles.idFace} aria-hidden>
              {avatar.kind === 'photo' ? <img src={avatar.value} alt="" /> : avatar.value}
            </span>
            <div>
              <div className={styles.idTitle}>
                {name ? cardTx.viewTitle.replace('{name}', name) : cardTx.viewTitleNoName}
              </div>
              {card.age.trim() && <div>{cardTx.age.replace('{age}', card.age.trim())}</div>}
            </div>
          </div>
          {rows.map((row) => (
            <div key={row.label} className={styles.idRow}>
              <span className={styles.idRowLabel}>
                <span aria-hidden>{row.emoji} </span>
                {row.label}
              </span>
              <span className={styles.idRowValue}>{row.value}</span>
            </div>
          ))}
        </div>

        {suggestions.length > 0 && (
          <div className={`${styles.docNote} no-print`}>
            <strong>💡 לפי מה שסימנתם — התאמות שכדאי לבקש</strong>
            <ul style={{ margin: '6px 0 0', paddingInlineStart: '1.1em', lineHeight: 1.8 }}>
              {suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        <div
          className="no-print"
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button type="button" className={styles.docBtn} onClick={() => window.print()}>
            📄 שמירה כ־PDF / הדפסה
          </button>
          <Link to="/" className={`${styles.docBtn} ${styles.docBtnGhost}`}>
            ↩️ {talkTx.back}
          </Link>
        </div>

        <div className={`${styles.docNote} no-print`}>
          הכרטיס נשמר במכשיר הזה בלבד, נמחק אחרי 24 שעות, ושום דבר לא נשלח אוטומטית.
          מה שלא תראו בעצמכם — לא יגיע לצוות.
        </div>
      </div>
    </div>
  )
}
