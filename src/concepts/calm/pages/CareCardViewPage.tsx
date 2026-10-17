import { Link } from '../../nav'
import { Mascot } from '../components/Mascot'
import { Note } from '../components/ui'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { useI18n } from '../../../hooks/useI18n'
import parentUi from '../../../data/parent/ui.json'
import { DAY_MS } from '../../../lib/storage'
import {
  emptyCard,
  emptyCustom,
  isCardEmpty,
  suggestedAdaptations,
  type CareCard,
} from '../../../data/careCard'
import styles from './CareCardViewPage.module.css'

interface Row {
  emoji: string
  label: string
  value: string
}

/**
 * The immediate staff-facing display (spec: "תצוגה מיידית לצוות") —
 * deliberately very short: a handful of high-contrast lines the parent
 * shows from the screen or prints. No transmission, ever.
 */
export function CareCardViewPage() {
  const { t, lang } = useI18n()
  // the card's words are the same as on the worlds' card page: src/data/parent/ui.json
  const cardText = (parentUi as unknown as Record<'he' | 'en' | 'ru', { card: { empty: { title: string; hint: string }; viewTitle: string; age: string; suggestionsTitle: string; rows: Record<string, string>; nameFallback: string } }>)[lang]?.card ?? (parentUi as unknown as Record<'he', { card: { empty: { title: string; hint: string }; viewTitle: string; age: string; suggestionsTitle: string; rows: Record<string, string>; nameFallback: string } }>).he.card
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)

  if (isCardEmpty(card)) {
    return (
      <div className="container">
        <div className={styles.empty}>
          <Mascot size={96} mood="calm" />
          <h1>{cardText.empty.title}</h1>
          <p>{cardText.empty.hint}</p>
          <Link to="/card" className={styles.emptyBtn}>
            {t('ui.careView.fill', 'למילוי הכרטיס')}
          </Link>
        </div>
      </div>
    )
  }

  const c = card.custom ?? emptyCustom
  const join = (...parts: string[]) =>
    parts.map((p) => p.trim()).filter(Boolean).join(' · ')

  const rows: Row[] = [
    { emoji: '💬', label: cardText.rows.communication, value: join(...card.communication, c.communication) },
    { emoji: '⚠️', label: cardText.rows.sensitivities, value: join(...card.sensitivities, c.sensitivities) },
    { emoji: '💛', label: cardText.rows.calming, value: join(...card.calming, c.calming) },
    {
      emoji: '🚫',
      label: cardText.rows.avoid,
      value: join(...card.escalators, ...card.avoid, c.escalators, c.avoid),
    },
    { emoji: '🩺', label: cardText.rows.hardMoments, value: join(...card.hardMoments, c.hardMoments) },
    { emoji: '🤕', label: cardText.rows.pain, value: join(...card.pain, c.pain) },
    { emoji: '✏️', label: cardText.rows.freeNote, value: card.freeNote.trim() },
  ].filter((r) => r.value)

  const suggestions = suggestedAdaptations(card)
  const name = card.nickname.trim()

  return (
    <div className="container">
      <div className={`${styles.card} print-area`}>
        <div className={styles.cardHead}>
          <span className={styles.cardHeadIcon} aria-hidden>
            🪪
          </span>
          <div>
            <div className={styles.cardTitle}>
              {cardText.viewTitle.replace('{name}', name || cardText.nameFallback)}
            </div>
            {card.age.trim() && <div className={styles.cardAge}>{cardText.age.replace('{age}', card.age.trim())}</div>}
          </div>
        </div>
        <div className={styles.rows}>
          {rows.map((row) => (
            <div key={row.label} className={styles.row}>
              <span className={styles.rowLabel}>
                <span aria-hidden>{row.emoji}</span>
                {row.label}
              </span>
              <span className={styles.rowValue}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className={`${styles.suggest} no-print`}>
          <div className={styles.suggestTitle}>
            <span aria-hidden>💡</span> {t('ui.careView.suggestions', 'לפי מה שסימנתם — התאמות שכדאי לבקש')}
          </div>
          <ul style={{ margin: 0, paddingInlineStart: '1.2em', lineHeight: 1.7 }}>
            {suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div style={{ marginTop: 'var(--space-2)' }}>
            <Link to="/requests" style={{ textDecoration: 'underline', fontWeight: 600 }}>
              {t('ui.careView.fullList', 'לרשימה המלאה של מה אפשר לבקש ←')}
            </Link>
          </div>
        </div>
      )}

      <div className={`${styles.controls} no-print`}>
        <button type="button" className={styles.pdfBtn} onClick={() => window.print()}>
          {t('ui.careView.savePdf', '📄 שמירה כ־PDF לשליחה')}
        </button>
        <button type="button" className={styles.printBtn} onClick={() => window.print()}>
          {t('ui.careView.print', '🖨️ הדפסה')}
        </button>
        <Link to="/card" className={styles.editBtn}>
          {t('ui.careView.edit', '✏️ עריכת הכרטיס')}
        </Link>
      </div>

      <div className="no-print" style={{ marginTop: 'var(--space-3)' }}>
        <Note>
          {t('ui.careView.sendHint', 'לשליחה לצוות: לחצו על "שמירה כ־PDF", בחרו "שמירה כ־PDF" בחלון ההדפסה, ושִׁלחו את הקובץ למייל של המיון בעצמכם. הכרטיס נשמר במכשיר הזה בלבד ונמחק אחרי 24 שעות, ושום דבר לא נשלח אוטומטית.')}
        </Note>
      </div>
    </div>
  )
}
