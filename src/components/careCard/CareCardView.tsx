import { keyed } from '../../lib/keyed'
import { usePersistentState } from '../../hooks/usePersistentState'
import { DAY_MS } from '../../lib/storage'
import careI18n from '../../data/i18n/careCard.json'
import i18nUi from '../../data/i18n/ui.json'
import { askTexts, emptyCard, emptyCustom, suggestedAdaptations, type CareCard } from '../../data/careCard'
import css from './CareCardView.module.css'

type Lang = 'he' | 'en' | 'ru'
type CardTexts = {
  viewTitle: string
  age: string
  suggestionsTitle: string
  rows: Record<string, string>
}

/** The title and the age line of the card, in the chosen language. */
export function careCardHeading(card: CareCard, lang: Lang) {
  const ui = keyed((i18nUi as unknown as Record<Lang, { card: CardTexts; tiles: { card: { title: string } } }>)[lang], 'i18n/ui')
  const tx = ui.card
  const name = card.nickname.trim()
  return {
    // without a name the card has the same title as its tile
    title: name ? tx.viewTitle.replace('{name}', name) : ui.tiles.card.title,
    age: card.age.trim() ? tx.age.replace('{age}', card.age.trim()) : '',
  }
}

/**
 * The care card as it is shown and printed. The same on every screen: the
 * labels follow the language, the values and the requests stay in Hebrew (the staff reads them).
 */
/** The requests the card suggests, in the language of the card (Hebrew): the staff reads them. */
export function suggestionsFor(card: CareCard, lang: Lang): string[] {
  return suggestedAdaptations(card, { asks: askTexts(lang) }, (careI18n as unknown as { askFor: Record<string, string[]> }).askFor)
}

/** Extra classes for the parts of the card, for a screen that shows it its own way. */
export type CareCardViewClasses = Partial<Record<'rows' | 'row' | 'label' | 'value', string>>

export function CareCardView({ classes = {} }: { classes?: CareCardViewClasses }) {
  const cls = (part: keyof CareCardViewClasses) => [css[part], classes[part]].filter(Boolean).join(' ')
  const lang: Lang = 'he'
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  // the labels of the card are Hebrew, like its values (the note on screen says so)
  const heRows = keyed((i18nUi as unknown as Record<'he', { card: { rows: Record<string, string> } }>).he, 'i18n/ui').card.rows
  const heAsks = askTexts('he')
  const c = card.custom ?? emptyCustom
  const join = (...parts: (string | undefined)[]) => parts.map((p) => (p ?? '').trim()).filter(Boolean).join(' · ')

  const rows = [
    { emoji: '💬', label: heRows.communication, value: join(...card.communication, c.communication) },
    { emoji: '⚠️', label: heRows.sensitivities, value: join(...card.sensitivities, c.sensitivities) },
    { emoji: '💛', label: heRows.calming, value: join(...card.calming, c.calming) },
    { emoji: '🚫', label: heRows.avoid, value: join(...card.escalators, ...card.avoid, c.escalators, c.avoid) },
    { emoji: '🩺', label: heRows.hardMoments, value: join(...card.hardMoments, c.hardMoments) },
    { emoji: '🤕', label: heRows.pain, value: join(...card.pain, c.pain) },
    { emoji: '✏️', label: heRows.freeNote, value: card.freeNote.trim() },
  ].filter((r) => r.value)

  const suggestions = suggestionsFor(card, lang)

  return (
    <>
      <div className={cls('rows')}>
        {rows.map((row) => (
          <div key={row.label} className={cls('row')}>
            <span className={cls('label')}>
              <span aria-hidden>{row.emoji}</span> {row.label}
            </span>
            <span className={cls('value')}>{row.value}</span>
          </div>
        ))}
      </div>

      {(card.asks ?? []).length > 0 && (
        <section>
          <h2>{heAsks.title}</h2>
          <ul style={{ paddingInlineStart: '1.2em', lineHeight: 1.7 }}>
            {(card.asks ?? []).map((id) => <li key={id}>{heAsks[id]}</li>)}
          </ul>
        </section>
      )}

      {suggestions.length > 0 && (
        <section className="app-no-print">
          <ul style={{ paddingInlineStart: '1.2em', lineHeight: 1.7 }}>
            {suggestions.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>
      )}

    </>
  )
}
