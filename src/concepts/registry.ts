/**
 * The catalogue of UI concepts shown on the menu screen at `/`.
 *
 * This demo exists so the ER team can compare different UI/UX directions
 * over the *same* content (everything under `src/data`). Adding a concept
 * = a folder under `src/concepts/`, a `<Route>` in `App.tsx`, and an entry
 * here.
 */
export interface Concept {
  id: string
  /** route base, e.g. "/calm" — must match the route mounted in App.tsx */
  base: string
  name: string
  tagline: string
  description: string
  /** what characterises this direction, for the team's comparison */
  bullets: string[]
  emoji: string
  /** menu card colours */
  accent: string
  accentSoft: string
}

export const concepts: Concept[] = [
  {
    id: 'calm',
    base: '/calm',
    name: 'רגוע ומסודר',
    tagline: 'ממשק שקט, מידע ברור, עומס חושי נמוך',
    description:
      'הקונספט הראשון: כרטיסים נקיים, צבעים רכים, טקסט קצר. הכול מסודר ברשימות ובשלבים, עם דגש על הורה שצריך למצוא מידע מהר גם תחת לחץ.',
    bullets: [
      'ניווט בכרטיסיות מהדף הראשי',
      'טיפוגרפיה גדולה וניגודיות רכה',
      'רוני מלווה כדמות עדינה ברקע',
    ],
    emoji: '🧸',
    accent: '#3f8f8a',
    accentSoft: '#dcecea',
  },
  {
    id: 'story',
    base: '/story',
    name: 'המסע של רוני',
    tagline: 'עולם מצויר, דמויות, וחברה שמלווה בכל צעד',
    description:
      'הקונספט השני: אותו תוכן בדיוק, אבל כספר סיפורים. עולם מצויר עם שביל, תחנות ודמויות. רוני נוכח בכל מסך, מדבר בבועה, ואפשר ללחוץ עליו ולשחק איתו — כדי לתת לילד/ה תחושת שליטה.',
    bullets: [
      'איורים מלאים בכל מסך, לא רק אייקונים',
      'רוני נוכח תמיד, מגיב למגע ומשנה הבעות',
      'הפרוצדורות כספר מודפס־מסך, עמוד אחרי עמוד',
    ],
    emoji: '🌈',
    accent: '#e2685f',
    accentSoft: '#ffe6df',
  },
  {
    id: 'talk',
    base: '/talk',
    name: 'לדבר עם רוני',
    tagline: 'בלי תפריטים בכלל — שיחה אחת רציפה, ורוני על המסך כל הזמן',
    description:
      'הקונספט השלישי שובר את המבנה: אין דף בית, אין תפריט ואין ניווט בין מסכים. רוני שואל, אתם עונים בכפתורים גדולים, והמידע מגיע משפט אחר משפט. הוא תופס שליש מהמסך באופן קבוע, זז ומשנה הבעה לפי כל דבר שהוא אומר. הרקע כהה וחמים — במיון מגיעים גם באמצע הלילה.',
    bullets: [
      'מבנה שיחה במקום עץ ניווט',
      'רוני ענק וקבוע, מגיב לכל משפט ולמגע',
      'מידע במנות קטנות — משפט אחד בכל פעם',
      'ממשק כהה, עומס אור נמוך',
    ],
    emoji: '💬',
    accent: '#8a6ab5',
    accentSoft: '#ece4f7',
  },
]
