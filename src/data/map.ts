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
    id: 'outside',
    name: 'המתנה בחוץ / באזור סמוך',
    emoji: '🌳',
    load: 'calm',
    note: 'אם מצב הילד/ה מאפשר ובתיאום עם הצוות, אפשר לצאת לאזור סמוך או החוצה — טוב למי שצריך תנועה או שקט. יש שם מקום לשבת ולזוז מעט. הצוות יקרא לכם כשמגיע התור — אין התראה בטלפון או באפליקציה.',
    next: 'חוזרים פנימה כשקוראים לנו',
  },
  {
    id: 'quiet-room',
    name: 'חדר מותאם (סנוזלן)',
    emoji: '🌙',
    load: 'calm',
    note: 'חדר טיפולים מותאם ושקט יותר, סמוך לעמדת הקבלה, עם פאנלים חושיים וגירויים מופחתים — אפשר לבצע בו גם טיפולים כמו עירוי או ניטור בסביבה רגועה. הצוות מפנה לשם ילדים שמתאים להם, לפי הצורך והפניוּת. אפשר לספר לצוות על הצרכים של הילד/ה.',
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
    load: 'medium',
    note: 'שירותים לשימוש המשפחות, וגם מקום לבדיקת שתן. לחלק מהילדים זה מרחב מציף — יש ריח, ולפעמים רעש חזק של ההדחה. אפשר להיכנס לרגע קצר ולצאת.',
  },
  {
    id: 'discharge',
    name: 'שחרור',
    emoji: '🏁',
    note: 'כאן מקבלים הנחיות סיום ומשתחררים הביתה.',
    next: 'הביתה, עם הנחיות להמשך 🏠',
    load: 'medium',
  },
]

export const loadLabels: Record<MapArea['load'], { label: string; color: string }> = {
  calm: { label: 'שקט', color: 'var(--c-calm)' },
  medium: { label: 'בינוני', color: 'var(--c-medium)' },
  busy: { label: 'עמוס', color: 'var(--c-alert)' },
}
