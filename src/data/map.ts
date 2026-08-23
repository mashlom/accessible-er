import type { MapArea, SensoryLevels } from './types'

/**
 * Simple orientation map of a standard paediatric ER (module 2),
 * with a "sensory load" layer so a parent knows where it is calmer,
 * where it is busier, and what happens in each area.
 *
 * The per-channel `sensory` levels (0–5) are a first estimate to be
 * reviewed with Rotem/Hagit (Keren/Rotem feedback, K5).
 */
export const mapAreas: MapArea[] = [
  {
    id: 'entrance',
    name: 'כניסה וקבלה',
    emoji: '🚪',
    load: 'medium',
    sensory: { sound: 3, light: 3, smell: 1, people: 3 },
    note: 'הכניסה למלר״ד ודלפק המזכירות. כאן פותחים תיק ונרשמים.',
    next: 'טריאז׳ — ממש בסמוך',
  },
  {
    id: 'triage',
    name: 'עמדת טריאז׳',
    emoji: '🩺',
    load: 'medium',
    sensory: { sound: 2, light: 3, smell: 1, people: 2 },
    note: 'כאן אחות מודדת ובודקת מצב ראשוני. סמוך לכניסה.',
    next: 'חדר ההמתנה, עד שקוראים לרופא/ה',
  },
  {
    id: 'waiting',
    name: 'חדר המתנה',
    emoji: '🪑',
    load: 'busy',
    sensory: { sound: 4, light: 3, smell: 1, people: 5 },
    note: 'אזור ישיבה להמתנה. לרוב האזור הכי עמוס ורועש. אפשר לבקש פינה שקטה יותר.',
    next: 'חדר בדיקה, כשמגיע התור',
  },
  {
    id: 'outside',
    name: 'המתנה בחוץ / באזור סמוך',
    emoji: '🌳',
    load: 'calm',
    sensory: { sound: 1, light: 2, smell: 1, people: 1 },
    note: 'אם מצב הילד/ה מאפשר ובתיאום עם הצוות, אפשר לצאת לאזור סמוך או החוצה — טוב למי שצריך תנועה או שקט. יש שם מקום לשבת ולזוז מעט. הצוות יקרא לכם כשמגיע התור — אין התראה בטלפון או באפליקציה.',
    next: 'חוזרים פנימה כשקוראים לנו',
  },
  {
    id: 'quiet-room',
    name: 'חדר מותאם (סנוזלן)',
    emoji: '🌙',
    load: 'calm',
    sensory: { sound: 1, light: 1, smell: 0, people: 1 },
    note: 'חדר טיפולים מותאם ושקט יותר, סמוך לעמדת הקבלה, עם פאנלים חושיים וגירויים מופחתים — אפשר לבצע בו גם טיפולים כמו עירוי או ניטור בסביבה רגועה. הצוות מפנה לשם ילדים שמתאים להם, לפי הצורך והפניוּת. אפשר לספר לצוות על הצרכים של הילד/ה.',
    next: 'חוזרים לשלב שבו היינו — רגועים יותר',
  },
  {
    id: 'treatment',
    name: 'חדרי בדיקה וטיפול',
    emoji: '🛏️',
    load: 'medium',
    sensory: { sound: 2, light: 3, smell: 2, people: 2 },
    note: 'כאן בודק הרופא/ה ומבצעים טיפולים. לרוב חדר סגור ושקט יחסית.',
    next: 'בדיקות נוספות, המתנה לתוצאות או שחרור',
  },
  {
    id: 'imaging',
    name: 'חדרי דימות (צילום / CT)',
    emoji: '📷',
    load: 'medium',
    sensory: { sound: 4, light: 2, smell: 1, people: 2 },
    note: 'כאן מצלמים רנטגן, אולטרסאונד או CT. המכונות גדולות ולפעמים רועשות.',
    next: 'חוזרים להמתין לתוצאות',
  },
  {
    id: 'restroom',
    name: 'שירותים',
    emoji: '🚻',
    load: 'medium',
    sensory: { sound: 3, light: 2, smell: 4, people: 2 },
    note: 'שירותים לשימוש המשפחות, וגם מקום לבדיקת שתן. לחלק מהילדים זה מרחב מציף — יש ריח, ולפעמים רעש חזק של ההדחה. אפשר להיכנס לרגע קצר ולצאת.',
  },
  {
    id: 'discharge',
    name: 'שחרור',
    emoji: '🏁',
    load: 'medium',
    sensory: { sound: 2, light: 3, smell: 1, people: 3 },
    note: 'כאן מקבלים הנחיות סיום ומשתחררים הביתה.',
    next: 'הביתה, עם הנחיות להמשך 🏠',
  },
]

export const loadLabels: Record<MapArea['load'], { label: string; color: string }> = {
  calm: { label: 'שקט', color: 'var(--c-calm)' },
  medium: { label: 'בינוני', color: 'var(--c-medium)' },
  busy: { label: 'עמוס', color: 'var(--c-alert)' },
}

/** Highest per-channel sensory level. */
export const SENSORY_MAX = 5

/** The sensory channels shown per area, in display order. */
export const sensoryChannels: {
  key: keyof SensoryLevels
  label: string
  emoji: string
}[] = [
  { key: 'sound', label: 'רעש', emoji: '🔊' },
  { key: 'light', label: 'אור', emoji: '💡' },
  { key: 'smell', label: 'ריח', emoji: '👃' },
  { key: 'people', label: 'אנשים', emoji: '👥' },
]

/**
 * Colour for a sensory level: green (little) → amber → red (a lot).
 * Hue goes from 130 (green) at 0 to 0 (red) at SENSORY_MAX.
 */
export function sensoryColor(level: number): string {
  const t = Math.max(0, Math.min(1, level / SENSORY_MAX))
  const hue = Math.round(130 * (1 - t))
  return `hsl(${hue} 68% 42%)`
}

/** Soft tint of the same hue, for the channel label behind dark text. */
export function sensoryColorSoft(level: number): string {
  const t = Math.max(0, Math.min(1, level / SENSORY_MAX))
  const hue = Math.round(130 * (1 - t))
  return `hsl(${hue} 60% 90%)`
}
