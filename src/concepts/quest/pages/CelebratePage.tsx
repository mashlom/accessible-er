import { useState } from 'react'
import { Link } from '../../nav'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { usePersistentState } from '../../../hooks/usePersistentState'
import { DAY_MS } from '../../../lib/storage'
import { emptyCard, isCardEmpty, type CareCard } from '../../../data/careCard'
import css from '../quest.module.css'

const dischargeBlocks = [
  { emoji: '📝', title: 'מה קורה עכשיו', body: 'הצוות מסכם איתכם את הביקור, נותן הנחיות להמשך, ולפעמים מרשם. אחר כך משתחררים הביתה.' },
  { emoji: '🚪', title: 'זה מעבר', body: 'אחרי ביקור ארוך ומעייף, גם עצם היציאה הביתה יכולה להרגיש כמו שינוי גדול. זה בסדר גמור.' },
  { emoji: '🏠', title: 'בבית', body: 'בבית אולי יהיה צורך בזמן, בשקט ובחזרה הדרגתית לשגרה. לפעמים התגובה למה שעברנו מגיעה רק אחר כך — וגם זה טבעי.' },
  { emoji: '🧰', title: 'ציוד או אביזרים לבית', body: 'לפעמים צריך בבית ציוד או אביזר קטן — למשל כיסוי אטום לגבס כדי להתקלח בלי להרטיב אותו. הצוות יסביר מה צריך ואיפה להשיג.' },
  { emoji: '🩺', title: 'מעקב אצל רופא/ת הילדים', body: 'חשוב להמשיך מעקב אצל רופא/ת הילדים בקהילה לפי ההמלצות — הם מכירים את הילד/ה וילוו אתכם גם אחרי הביקור.' },
]

const admissionBlocks = [
  { emoji: '🏥', title: 'מה קורה עכשיו', body: 'הצוות החליט להמשיך עם טיפול בבית חולים. הילד/ה יעבור למחלקת אשפוז, שם יהיה מעקב מקרוב והתאמה בהתאם לצרכים.' },
  { emoji: '🚪', title: 'המעבר למחלקה', body: 'המעבר עצמו יכול להיות עומס נוסף אחרי ביקור ארוך. חשוב לתן לילד/ה זמן, הסברים, והמשך את ההתאמות שעזרו בדרך.' },
  { emoji: '🛏️', title: 'בחדר האשפוז', body: 'בחדר יהיה חדר חדש, צוות חדש וסביבה לא מוכרת. אפשר לבקש להביא דברים אהובים של הילד/ה, ולהסביר לצוות המחלקה מה עזר בבדיקות.' },
  { emoji: '💙', title: 'תמיכה משפחתית', body: 'הורים יכולים להישאר קרוב, לספר לצוות על הילד/ה, ולהמשיך עם ההתאמות שהוכיחו שהן עוזרות. זו עבודת צוות.' },
  { emoji: '📞', title: 'חיבור עם צוות המחלקה', body: 'אנחנו מכינים דוח קצר לצוות המחלקה עם כל ההתאמות שעזרו. זה יעזור להם להמשיך את הטיפול בצורה הטובה ביותר לילד/ה.' },
]

export function CelebratePage() {
  const [outcome, setOutcome] = useState<'discharge' | 'admission' | null>(null)
  const [showCard, setShowCard] = useState(false)
  const { theme } = useQuestTheme()
  const { t, lang } = useI18n()
  const { reset, doneProcedures } = useQuestProgress()
  const [card] = usePersistentState<CareCard>('care-card', emptyCard, DAY_MS)
  const celebrateSkin = theme.stages['decision']
  const doneCount = doneProcedures.size
  const cardEmpty = isCardEmpty(card)

  return (
    <div className={css.celebratePage}>
      {/* ── Child zone ── */}
      <div className={css.celebrateChildZone} style={{ background: theme.accentSoft }}>
        {theme.shopImage && (
          <img src={theme.shopImage} alt="" className={css.celebrateImg} />
        )}
        <div className={css.celebrateContent}>
          <p className={css.celebrateTitle} style={{ color: theme.accent }}>
            {celebrateSkin?.label ?? t('ui.text.weDidIt', 'עשינו את זה! 🎉')}
          </p>
          {doneCount > 0 && (
            <p className={css.celebrateCoins}>
              {Array.from({ length: doneCount }, (_, i) => (
                <span key={i} className={css.coinCounterItem}>{theme.doneEmoji ?? '✓'}</span>
              ))}
            </p>
          )}
          <p className={css.celebrateHint}>
            {doneCount > 0
              ? (lang === 'he'
                ? `צברת ${doneCount} ${doneCount === 1 ? 'מטבע' : 'מטבעות'} — ברוכים הבאים לחנות!`
                : t(`ui.text.coins.${new Intl.PluralRules(lang).select(doneCount)}`, '').replace('{n}', String(doneCount)))
              : (celebrateSkin?.hint ?? '')}
          </p>
        </div>
        <div className={css.stageBack}>
          <Link to="/shop" style={{ flex: 2, display: 'flex' }}>
            <button className={css.doneBtn} style={{ background: theme.accent, color: theme.accentText, flex: 1 }}>
              {t('ui.buttons.toShop', 'לחנות 🛍️')}
            </button>
          </Link>
          <Link to="/" style={{ flex: 1, display: 'flex' }}>
            <button
              className={css.backBtn}
              style={{ borderColor: theme.accent, color: theme.accent, flex: 1 }}
              onClick={reset}
            >
              {t('ui.buttons.chooseWorld', 'לבחירת עולם →')}
            </button>
          </Link>
        </div>
      </div>

      {/* ── Parent zone ── */}
      <div className={css.stageBody}>
        {!outcome && (
          <div className={css.outcomeChoice}>
            <p className={css.outcomeLabel}>{t('ui.text.outcomeLabel', 'מה קורה כעת?')}</p>
            <div className={css.outcomeButtons}>
              <button
                className={css.outcomeBtn}
                onClick={() => setOutcome('discharge')}
                style={{ background: theme.accent, color: theme.accentText }}
              >
                {t('ui.buttons.discharge', '🏠 שחרור הביתה')}
              </button>
              <button
                className={css.outcomeBtn}
                onClick={() => setOutcome('admission')}
                style={{ background: theme.accent, color: theme.accentText }}
              >
                {t('ui.buttons.admission', '🏥 המשך אשפוז')}
              </button>
            </div>
          </div>
        )}

        {outcome && (
          <>
            <p className={css.parentZoneLabel}>
              {outcome === 'discharge' ? t('ui.text.towardsDischarge', 'לקראת שחרור הביתה') : t('ui.text.towardsAdmission', 'לקראת המשך אשפוז')}
            </p>

            {(outcome === 'discharge'
              ? t('ui.text.discharge', dischargeBlocks)
              : t('ui.text.admission', admissionBlocks)
            ).map((b, i) => (
              <section key={i}>
                <h2>{b.emoji} {b.title}</h2>
                <p>{b.body}</p>
              </section>
            ))}

            {outcome === 'admission' && (
              cardEmpty ? (
                <Link to="/card" className={css.calmLink}>
                  <button
                    className={css.doneBtn}
                    style={{ background: theme.accent, color: theme.accentText, width: '100%' }}
                  >
                    {t('ui.buttons.fillCard', '🪪 למילוי הכרטיס ←')}
                  </button>
                </Link>
              ) : (
                <button
                  className={css.calmLink}
                  onClick={() => setShowCard(true)}
                  style={{ background: theme.accent, color: theme.accentText }}
                >
                  {t('ui.buttons.showCard', '🪪 הצגת הכרטיס לצוות')}
                </button>
              )
            )}

            <button
              className={css.calmLink}
              onClick={() => setOutcome(null)}
              style={{ marginTop: '1rem', color: theme.accent, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {t('ui.buttons.changeChoice', '← שנה בחירה')}
            </button>

            <Link to="/feedback" className={css.calmLink}>
              {t('ui.buttons.feedback', '💬 איך היה לכם? ספרו לנו →')}
            </Link>
          </>
        )}
      </div>

      {showCard && !cardEmpty && (
        <div
          className={css.calmOverlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setShowCard(false)}
        >
          <div className={css.cardOverlayContent}>
            <div className={css.cardOverlayName}>{card.nickname.trim() || 'הילד/ה שלנו'}</div>
            {[
              { emoji: '💬', items: [...card.communication, card.custom?.communication].filter(Boolean) },
              { emoji: '⚠️', items: [...card.sensitivities, card.custom?.sensitivities].filter(Boolean) },
              { emoji: '💛', items: [...card.calming, card.custom?.calming].filter(Boolean) },
              { emoji: '🚫', items: [...card.escalators, ...card.avoid, card.custom?.escalators, card.custom?.avoid].filter(Boolean) },
              { emoji: '🩺', items: [...card.hardMoments, card.custom?.hardMoments].filter(Boolean) },
              { emoji: '🤕', items: [...card.pain, card.custom?.pain].filter(Boolean) },
            ]
              .filter((section) => section.items.length > 0)
              .map((section, i) => (
                <div key={i} className={css.cardOverlaySection}>
                  <div className={css.cardOverlayEmoji}>{section.emoji}</div>
                  <div className={css.cardOverlayItems}>
                    {section.items.map((item, j) => (
                      <div key={j} className={css.cardOverlayItem}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            {card.freeNote.trim() && (
              <div className={css.cardOverlaySection}>
                <div className={css.cardOverlayEmoji}>✏️</div>
                <div className={css.cardOverlayItems}>
                  <div className={css.cardOverlayItem}>{card.freeNote.trim()}</div>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            className={css.calmOverlayClose}
            onClick={() => setShowCard(false)}
          >
            {t('ui.buttons.close', 'סגירה')}
          </button>
        </div>
      )}
    </div>
  )
}
