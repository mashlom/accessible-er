import { Link } from '../../nav'
import { Scene, Bubble, Panel, ChipButton, Note } from '../components/kit'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { useI18n } from '../../../hooks/useI18n'
import homeTexts from '../../../data/parent/home.json'
import { DAY_MS } from '../../../lib/storage'
import {
  cardSections,
  CUSTOM_MAX,
  emptyCard,
  emptyCustom,
  isCardEmpty,
  type CardArrayField,
  type CareCard,
} from '../../../data/careCard'
import shell from '../story.module.css'
import styles from '../pages.module.css'

/**
 * "הכרטיס שלי" — the quick adaptations card, written in the child's voice
 * ("מה חשוב לדעת עליי"). Same data and same storage key as the calm
 * concept; only the framing and the chrome change.
 */
export function CardPage() {
  const [card, setCard, clearCard] = usePersistentState<CareCard>(
    'care-card',
    emptyCard,
    DAY_MS,
  )
  const { lang, dir, t } = useI18n()
  const tx = homeTexts[lang as 'he' | 'en' | 'ru'].cardPage ?? homeTexts.he.cardPage
  // the labels are translated; the values stored on the card stay in Hebrew, as the staff reads them
  const translatedSections = t('careCard.cardSections', cardSections)

  function toggle(key: CardArrayField, option: string) {
    const list = card[key]
    setCard({
      ...card,
      [key]: list.includes(option) ? list.filter((x) => x !== option) : [...list, option],
    })
  }

  function setCustom(key: CardArrayField, value: string) {
    setCard({ ...card, custom: { ...(card.custom ?? emptyCustom), [key]: value } })
  }

  const empty = isCardEmpty(card)

  return (
    <div dir={dir} lang={lang} style={{ textAlign: 'start' }}>
    <Scene title={tx.title} subtitle={tx.subtitle}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>{tx.bubble}</Bubble>
      </div>

      <div className={shell.stack}>
        <Panel title={tx.me} emoji="🧒">
          <div className={styles.twoUp}>
            <label className={styles.field}>
              {tx.nickname}
              <input
                className={styles.input}
                value={card.nickname}
                onChange={(e) => setCard({ ...card, nickname: e.target.value })}
                maxLength={30}
                placeholder={tx.nickPh}
              />
            </label>
            <label className={styles.field}>
              {tx.age}
              <input
                className={styles.input}
                value={card.age}
                onChange={(e) => setCard({ ...card, age: e.target.value })}
                maxLength={6}
                inputMode="numeric"
                placeholder={tx.agePh}
              />
            </label>
          </div>
        </Panel>

        {cardSections.map((section, si) => {
          const custom = card.custom?.[section.key] ?? ''
          const shown = translatedSections[si] ?? section
          return (
            <Panel key={section.key} title={shown.title} emoji={section.emoji}>
              <div className={shell.chipRow} role="group" aria-label={shown.title}>
                {section.options.map((option, oi) => (
                  <ChipButton
                    key={option}
                    on={card[section.key].includes(option)}
                    onClick={() => toggle(section.key, option)}
                  >
                    {shown.options[oi] ?? option}
                  </ChipButton>
                ))}
              </div>
              <label className={styles.field} style={{ marginTop: 'var(--space-3)' }}>
                <span className="visually-hidden">{tx.other.replace('{title}', shown.title)}</span>
                <input
                  className={styles.input}
                  value={custom}
                  onChange={(e) => setCustom(section.key, e.target.value)}
                  maxLength={CUSTOM_MAX}
                  placeholder={tx.otherPh}
                />
                {custom.length > 0 && (
                  <span className={styles.charCount}>
                    {custom.length}/{CUSTOM_MAX}
                  </span>
                )}
              </label>
            </Panel>
          )
        })}

        <Panel title={tx.freeTitle} emoji="✏️">
          <textarea
            className={styles.textarea}
            rows={3}
            value={card.freeNote}
            onChange={(e) => setCard({ ...card, freeNote: e.target.value })}
            placeholder={tx.freePh}
          />
        </Panel>

        <Note>{tx.note}</Note>
      </div>

      <div className={styles.actions}>
        <Link
          to="/card/view"
          className={shell.bigBtn}
          aria-disabled={empty}
          style={empty ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
        >
          {tx.show}
        </Link>
        {!empty && (
          <button type="button" className={shell.ghostBtn} onClick={clearCard}>
            {tx.clear}
          </button>
        )}
      </div>
    </Scene>
    </div>
  )
}
