import { Link } from '../../nav'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress } from '../useQuestProgress'
import css from '../quest.module.css'

const dischargeBlocks = [
  { emoji: '📝', title: 'מה קורה עכשיו', body: 'הצוות מסכם איתכם את הביקור, נותן הנחיות להמשך, ולפעמים מרשם. אחר כך משתחררים הביתה.' },
  { emoji: '🚪', title: 'זה מעבר', body: 'אחרי ביקור ארוך ומעייף, גם עצם היציאה הביתה יכולה להרגיש כמו שינוי גדול. זה בסדר גמור.' },
  { emoji: '🏠', title: 'בבית', body: 'בבית אולי יהיה צורך בזמן, בשקט ובחזרה הדרגתית לשגרה. לפעמים התגובה למה שעברנו מגיעה רק אחר כך — וגם זה טבעי.' },
  { emoji: '🧰', title: 'ציוד או אביזרים לבית', body: 'לפעמים צריך בבית ציוד או אביזר קטן — למשל כיסוי אטום לגבס כדי להתקלח בלי להרטיב אותו. הצוות יסביר מה צריך ואיפה להשיג.' },
  { emoji: '🩺', title: 'מעקב אצל רופא/ת הילדים', body: 'חשוב להמשיך מעקב אצל רופא/ת הילדים בקהילה לפי ההמלצות — הם מכירים את הילד/ה וילוו אתכם גם אחרי הביקור.' },
]

export function CelebratePage() {
  const { theme } = useQuestTheme()
  const { reset, doneProcedures } = useQuestProgress()
  const celebrateSkin = theme.stages['decision']
  const doneCount = doneProcedures.size

  return (
    <div className={css.celebratePage} style={{ background: theme.accentSoft, alignItems: 'stretch', padding: 0 }}>
      {/* ── Child zone ── */}
      <div className={css.celebrateChildZone} style={{ background: theme.accentSoft }}>
        {theme.shopImage && (
          <img src={theme.shopImage} alt="" className={css.celebrateImg} />
        )}
        <div className={css.celebrateContent}>
          <p className={css.celebrateTitle} style={{ color: theme.accent }}>
            {celebrateSkin?.label ?? 'עשינו את זה! 🎉'}
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
              ? `צברת ${doneCount} ${doneCount === 1 ? 'מטבע' : 'מטבעות'} — ברוכים הבאים לחנות!`
              : (celebrateSkin?.hint ?? '')}
          </p>
        </div>
        <div className={css.stageBack} style={{ width: '100%', maxWidth: '400px' }}>
          <Link to="/shop" style={{ flex: 2, display: 'flex' }}>
            <button className={css.doneBtn} style={{ background: theme.accent, color: theme.accentText, flex: 1 }}>
              לחנות 🛍️
            </button>
          </Link>
          <Link to="/" style={{ flex: 1, display: 'flex' }}>
            <button
              className={css.backBtn}
              style={{ borderColor: theme.accent, color: theme.accent, flex: 1 }}
              onClick={reset}
            >
              לבחירת עולם →
            </button>
          </Link>
        </div>
      </div>

      {/* ── Parent zone ── */}
      <div className={css.celebrateParentZone}>
        <p className={css.parentZoneLabel}>לקראת שחרור הביתה</p>
        {dischargeBlocks.map((b, i) => (
          <section key={i} className={css.dischargeBlock}>
            <span className={css.dischargeEmoji} aria-hidden>{b.emoji}</span>
            <div>
              <h2 className={css.dischargeTitle}>{b.title}</h2>
              <p className={css.dischargeBody}>{b.body}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
