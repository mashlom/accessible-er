import type { MapArea } from './types'

/**
 * Simple orientation map of a standard paediatric ER (module 2),
 * with a "sensory load" layer so a parent knows where it is calmer,
 * where it is busier, and what happens in each area.
 */
export const mapAreas: MapArea[] = [
  {
    id: 'entrance',
    name: 'כניסה וקבלה',
    emoji: '🚪',
    load: 'medium',
    note: 'הכניסה למלר״ד ודלפק המזכירות. כאן פותחים תיק ונרשמים.',
    next: 'טריאז׳ — ממש בסמוך',
  },
  {
    id: 'triage',
    name: 'עמדת טריאז׳',
    emoji: '🩺',
    load: 'medium',
    note: 'כאן אחות מודדת ובודקת מצב ראשוני. סמוך לכניסה.',
    next: 'חדר ההמתנה, עד שקוראים לרופא/ה',
  },
  {
    id: 'waiting',
    name: 'חדר המתנה',
    emoji: '🪑',
    load: 'busy',
    note: 'אזור ישיבה להמתנה. לרוב האזור הכי עמוס ורועש. אפשר לבקש פינה שקטה יותר.',
    next: 'חדר בדיקה, כשמגיע התור',
  },
  {
    id: 'quiet-room',
    name: 'חדר טיפולים שקט / סנוזלן',
    emoji: '🌙',
    load: 'calm',
    note: 'מרחב מותאם, שקט יותר, עם גירויים מופחתים. אפשר לבקש מהצוות אם פנוי.',
    next: 'חוזרים לשלב שבו היינו — רגועים יותר',
  },
  {
    id: 'treatment',
    name: 'חדרי בדיקה וטיפול',
    emoji: '🛏️',
    load: 'medium',
    note: 'כאן בודק הרופא/ה ומבצעים טיפולים. לרוב חדר סגור ושקט יחסית.',
    next: 'בדיקות נוספות, המתנה לתוצאות או שחרור',
  },
  {
    id: 'imaging',
    name: 'חדרי דימות (צילום / CT)',
    emoji: '📷',
    load: 'medium',
    note: 'כאן מצלמים רנטגן, אולטרסאונד או CT. המכונות גדולות ולפעמים רועשות.',
    next: 'חוזרים להמתין לתוצאות',
  },
  {
    id: 'restroom',
    name: 'שירותים',
    emoji: '🚻',
    load: 'calm',
    note: 'שירותים לשימוש המשפחות. גם מקום לבדיקת שתן.',
  },
  {
    id: 'discharge',
    name: 'שחרור',
    emoji: '🏁',
    note: 'כאן מקבלים הנחיות סיום ומשתחררים הביתה.',
    next: 'הביתה, עם הנחיות להמשך 🏠',
    load: 'calm',
  },
]

export const loadLabels: Record<MapArea['load'], { label: string; color: string }> = {
  calm: { label: 'שקט', color: 'var(--c-calm)' },
  medium: { label: 'בינוני', color: 'var(--c-medium)' },
  busy: { label: 'עמוס', color: 'var(--c-alert)' },
}
