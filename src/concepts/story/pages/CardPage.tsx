import { Link } from '../../nav'
import { Scene, Bubble, Panel, ChipButton, Note } from '../components/kit'
import { usePersistentState } from '../../../hooks/usePersistentState'
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
    <Scene
      title="הכרטיס שלי"
      subtitle="סמנו את מה שמתאים — פחות משתי דקות. בסוף יוצא כרטיס קצר וגדול, שאפשר להראות לצוות מהמסך או להדפיס."
    >
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>
          🔒 הכל נשמר <strong>במכשיר הזה בלבד</strong>, נמחק אחרי 24 שעות, ולא נשלח
          לשום מקום. מה שלא תראו בעצמכם — לא יגיע לצוות. אפשר למלא גם בלי שם.
        </Bubble>
      </div>

      <div className={shell.stack}>
        <Panel title="מי אני (לא חובה)" emoji="🧒">
          <div className={styles.twoUp}>
            <label className={styles.field}>
              כינוי / שם פרטי
              <input
                className={styles.input}
                value={card.nickname}
                onChange={(e) => setCard({ ...card, nickname: e.target.value })}
                maxLength={30}
                placeholder="לא חובה"
              />
            </label>
            <label className={styles.field}>
              גיל
              <input
                className={styles.input}
                value={card.age}
                onChange={(e) => setCard({ ...card, age: e.target.value })}
                maxLength={6}
                inputMode="numeric"
                placeholder="—"
              />
            </label>
          </div>
        </Panel>

        {cardSections.map((section) => {
          const custom = card.custom?.[section.key] ?? ''
          return (
            <Panel key={section.key} title={section.title} emoji={section.emoji}>
              <div className={shell.chipRow} role="group" aria-label={section.title}>
                {section.options.map((option) => (
                  <ChipButton
                    key={option}
                    on={card[section.key].includes(option)}
                    onClick={() => toggle(section.key, option)}
                  >
                    {option}
                  </ChipButton>
                ))}
              </div>
              <label className={styles.field} style={{ marginTop: 'var(--space-3)' }}>
                <span className="visually-hidden">אחר — {section.title}</span>
                <input
                  className={styles.input}
                  value={custom}
                  onChange={(e) => setCustom(section.key, e.target.value)}
                  maxLength={CUSTOM_MAX}
                  placeholder="אחר… (אפשר לכתוב בחופשי)"
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

        <Panel title="עוד משהו שעוזר לי? (לא חובה)" emoji="✏️">
          <textarea
            className={styles.textarea}
            rows={3}
            value={card.freeNote}
            onChange={(e) => setCard({ ...card, freeNote: e.target.value })}
            placeholder="למשל: אוהב שמספרים לי מה קורה בקול שקט; נרגעת עם הדובי הכחול…"
          />
        </Panel>

        <Note>
          מה שמסמנים כאן פותח גם הצעות להתאמות שכדאי לבקש — הן מופיעות מתחת לכרטיס
          עצמו.
        </Note>
      </div>

      <div className={styles.actions}>
        <Link
          to="/card/view"
          className={shell.bigBtn}
          aria-disabled={empty}
          style={empty ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
        >
          🪪 להראות את הכרטיס לצוות
        </Link>
        {!empty && (
          <button type="button" className={shell.ghostBtn} onClick={clearCard}>
            ניקוי הכרטיס
          </button>
        )}
      </div>
    </Scene>
  )
}
