import { Link } from '../../nav'
import { Roni } from '../../../components/Roni'
import { Note } from '../components/kit'
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
import { useI18n } from '../../../hooks/useI18n'
import parentUi from '../../../data/parent/ui.json'
import careI18n from '../../../data/i18n/careCard.json'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/**
 * The staff-facing side of the card: very short, very large, shown from
 * the screen or printed. Nothing is transmitted — the parent shows it.
 */
type CardViewTexts = {
  emptyTitle: string
  emptyHint: string
  fill: string
  hebrewNote: string
  suggestions: string
  fullList: string
  savePdf: string
  edit: string
  sendHint: string
}

export function CardViewPage() {
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  const [avatar] = useSessionAvatar()
  const { lang, dir } = useI18n()
  // the chrome around the card follows the parent's language; the card itself stays in Hebrew — the staff reads it
  const tx = (parentUi as unknown as Record<'he' | 'en' | 'ru', { cardView: CardViewTexts }>)[lang].cardView

  if (isCardEmpty(card)) {
    return (
      <div className={shell.page} dir={dir} lang={lang}>
        <div className={styles.emptyState}>
          <Roni size={120} mood="curious" float />
          <h1 className={shell.sceneTitle}>{tx.emptyTitle}</h1>
          <p style={{ color: 'var(--s-ink-soft)' }}>{tx.emptyHint}</p>
          <Link to="/card" className={shell.bigBtn}>
            {tx.fill}
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
    { emoji: '💬', label: 'תקשורת', value: join(...card.communication, c.communication) },
    { emoji: '⚠️', label: 'רגישויות', value: join(...card.sensitivities, c.sensitivities) },
    { emoji: '💛', label: 'עוזר לי', value: join(...card.calming, c.calming) },
    {
      emoji: '🚫',
      label: 'להימנע',
      value: join(...card.escalators, ...card.avoid, c.escalators, c.avoid),
    },
    { emoji: '🩺', label: 'קשה במיוחד', value: join(...card.hardMoments, c.hardMoments) },
    { emoji: '🤕', label: 'ככה נראה כאב', value: join(...card.pain, c.pain) },
    { emoji: '✏️', label: 'עוד', value: card.freeNote.trim() },
  ].filter((r) => r.value)

  const suggestionsIn = (careI18n as unknown as Record<string, { adaptationSuggestions?: Record<string, string> }>)[lang]?.adaptationSuggestions
  const suggestions = suggestedAdaptations(card, suggestionsIn)
  const name = card.nickname.trim()

  return (
    <div className={shell.page} dir={dir} lang={lang}>
      {/* the card itself is Hebrew and RTL — the staff reads it */}
      <div className={`${styles.idCard} print-area`} dir="rtl" lang="he">
        <div className={styles.idHead}>
          <span className={styles.idFace} aria-hidden>
            {avatar.kind === 'photo' ? <img src={avatar.value} alt="" /> : avatar.value}
          </span>
          <div>
            <div className={styles.idTitle}>
              חשוב לדעת על {name || 'הילד/ה'} שלי
            </div>
            {card.age.trim() && <div className={styles.idAge}>גיל {card.age.trim()}</div>}
            {lang !== 'he' && <div className={styles.idAge}>{tx.hebrewNote}</div>}
          </div>
        </div>
        <div className={styles.idRows}>
          {rows.map((row) => (
            <div key={row.label} className={styles.idRow}>
              <span className={styles.idRowLabel}>
                <span aria-hidden>{row.emoji}</span>
                {row.label}
              </span>
              <span className={styles.idRowValue}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className={`${styles.suggest} no-print`} style={{ marginTop: 'var(--space-4)' }}>
          <strong>{tx.suggestions}</strong>
          <ul className={styles.suggestList}>
            {suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <Link to="/requests" className={styles.crossLink} style={{ marginTop: 10 }}>
            {tx.fullList}
          </Link>
        </div>
      )}

      <div className={`${styles.actions} no-print`}>
        <button type="button" className={shell.bigBtn} onClick={() => window.print()}>
          {tx.savePdf}
        </button>
        <Link to="/card" className={shell.ghostBtn}>
          {tx.edit}
        </Link>
      </div>

      <div className="no-print" style={{ marginTop: 'var(--space-4)' }}>
        <Note>{tx.sendHint}</Note>
      </div>
    </div>
  )
}
