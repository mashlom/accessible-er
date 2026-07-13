/**
 * "כרטיס התאמות מהיר" (module 1 in the spec) — what the staff should
 * know about my child. Filled quickly by the parent (chips-first, so it
 * works even when arriving in a hurry), stored ONLY on this device with
 * a 1-day expiry, and shown to staff physically (screen or print).
 * Nothing is ever transmitted anywhere.
 */

export interface CareCard {
  /** optional nickname — the app works without any identifying detail */
  nickname: string
  age: string
  communication: string[]
  sensitivities: string[]
  calming: string[]
  escalators: string[]
  hardMoments: string[]
  pain: string[]
  avoid: string[]
  freeNote: string
}

export type CardArrayField =
  | 'communication'
  | 'sensitivities'
  | 'calming'
  | 'escalators'
  | 'hardMoments'
  | 'pain'
  | 'avoid'

export const emptyCard: CareCard = {
  nickname: '',
  age: '',
  communication: [],
  sensitivities: [],
  calming: [],
  escalators: [],
  hardMoments: [],
  pain: [],
  avoid: [],
  freeNote: '',
}

export interface CardSection {
  key: CardArrayField
  title: string
  emoji: string
  hint?: string
  options: string[]
}

export const cardSections: CardSection[] = [
  {
    key: 'communication',
    title: 'איך הילד/ה מתקשר/ת?',
    emoji: '💬',
    options: [
      'מדבר/ת',
      'מדבר/ת מעט',
      'לא ורבלי/ת',
      'תקשורת בתמונות (תת״ח)',
      'מבין/ה הוראות קצרות',
      'צריך/ה זמן תגובה',
    ],
  },
  {
    key: 'sensitivities',
    title: 'רגישויות חושיות',
    emoji: '⚠️',
    options: ['רעש', 'אור חזק', 'מגע', 'ריחות', 'הרבה אנשים', 'המתנה ממושכת'],
  },
  {
    key: 'calming',
    title: 'מה מרגיע אותו/ה?',
    emoji: '💛',
    options: [
      'חפץ מרגיע מהבית',
      'סרטון או מוזיקה',
      'חיבוק מההורה',
      'הסבר מראש',
      'ספירה יחד',
      'משחק',
    ],
  },
  {
    key: 'escalators',
    title: 'מה עלול להסלים מצוקה?',
    emoji: '⚡',
    options: [
      'מגע בלי הכנה',
      'רעש פתאומי',
      'הרבה אנשים מסביב',
      'אורות חזקים',
      'דיבור מהיר או צעקות',
      'הפתעות ושינויים',
    ],
  },
  {
    key: 'hardMoments',
    title: 'קשה במיוחד עם…',
    emoji: '🩺',
    options: [
      'מחטים ודקירות',
      'מדידת לחץ דם',
      'מגע בפנים או בראש',
      'שכיבה על מיטת בדיקה',
      'מכשירים על הגוף',
      'להישאר במקום אחד',
    ],
  },
  {
    key: 'pain',
    title: 'איך הוא/היא מבטא/ת כאב?',
    emoji: '🤕',
    options: [
      'אומר/ת במילים',
      'מצביע/ה על המקום',
      'בכי או צעקות',
      'נהיה/נהיית שקט/ה ומסתגר/ת',
      'תנועות גוף',
      'סולם פרצופים עוזר',
    ],
  },
  {
    key: 'avoid',
    title: 'חשוב לא לעשות',
    emoji: '🚫',
    options: [
      'לגעת בלי להסביר',
      'לדבר מעל הראש שלו/ה',
      'להחזיק בכוח',
      'למהר ולזרז',
      'הרבה הוראות בבת אחת',
      'לקחת את החפץ המרגיע',
    ],
  },
]

/**
 * Marking a sensitivity/trigger opens matching adaptation suggestions
 * (the spec's "סימון רגישות יאפשר לפתוח הצעות להתאמות מסוימות").
 */
const adaptationSuggestions: Record<string, string> = {
  רעש: 'אוזניות, אטמי אוזניים או מרחב שקט',
  'אור חזק': 'עמעום האור בחדר',
  מגע: 'הסבר קצר לפני כל נגיעה',
  'הרבה אנשים': 'פחות אנשי צוות בחדר — אחד מוביל ומדבר',
  'המתנה ממושכת': 'פינה שקטה או קיט חושי לזמן ההמתנה',
  'מחטים ודקירות': 'משחה מאלחשת וזמן הכנה לפני דקירה',
  'מגע בלי הכנה': 'הסבר קצר לפני כל נגיעה',
  'הרבה אנשים מסביב': 'פחות אנשי צוות בחדר — אחד מוביל ומדבר',
  'רעש פתאומי': 'סביבה שקטה ודלת סגורה',
  'אורות חזקים': 'עמעום האור בחדר',
  'להישאר במקום אחד': 'הפסקות קצרות ותנועה בין שלבים',
}

export function suggestedAdaptations(card: CareCard): string[] {
  const picked = [...card.sensitivities, ...card.escalators, ...card.hardMoments]
  return [...new Set(picked.map((p) => adaptationSuggestions[p]).filter(Boolean))]
}

export function isCardEmpty(card: CareCard): boolean {
  return (
    !card.nickname.trim() &&
    !card.freeNote.trim() &&
    cardSections.every((s) => card[s.key].length === 0)
  )
}
