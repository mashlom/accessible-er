export interface BookPage {
  id: string
  emoji: string
  text: string
  sub?: string
  /** If true, this page renders the parent procedure-select UI */
  isParentSelect?: boolean
}

export const basePages: BookPage[] = [
  {
    id: 'arrival',
    emoji: '🚗',
    text: 'מגיעים לבית החולים.',
    sub: 'ליד הכניסה יש שולחן. שם רושמים את השם ושואלים כמה שאלות קצרות.',
  },
  {
    id: 'reception',
    emoji: '📋',
    text: 'מישהו מקבל אתכם.',
    sub: 'שואלים מה קרה ורושמים הכול. אפשר לספר בעצמכם, ואפשר שההורה יספר.',
  },
  {
    id: 'triage',
    emoji: '🌡️',
    text: 'אחות מגיעה לבדוק.',
    sub: 'מודדים חום, לחץ דם ודופק. זה לוקח כמה דקות ולא כואב.',
  },
  {
    id: 'wait-doctor',
    emoji: '🪑',
    text: 'ממתינים.',
    sub: 'מחכים עד שהרופא פנוי. אפשר לשבת, לנשום, ולחכות בשקט.',
  },
  {
    id: 'doctor',
    emoji: '👩‍⚕️',
    text: 'הרופא נכנס ואומר שלום.',
    sub: 'שואלים שאלות ובודקים בעדינות. אפשר לשאול כל דבר.',
  },
]

export const parentSelectPage: BookPage = {
  id: 'parent-select',
  emoji: '📋',
  text: '',
  isParentSelect: true,
}

export const procedureOptions: BookPage[] = [
  {
    id: 'tests',
    emoji: '🔬',
    text: 'הולכים לבדיקות.',
    sub: 'לפעמים צריך בדיקת דם או רנטגן. זה עוזר לרופא להבין מה קורה.',
  },
  {
    id: 'treatment',
    emoji: '💊',
    text: 'מקבלים טיפול.',
    sub: 'לפעמים נותנים תרופה או עושים טיפול קטן. זה עוזר להרגיש טוב יותר.',
  },
  {
    id: 'consult',
    emoji: '🧑‍⚕️',
    text: 'רופא נוסף מגיע.',
    sub: 'לפעמים רופא מומחה בא לבדוק גם הוא. עוד זוג עיניים לעזור.',
  },
  {
    id: 'wait-results',
    emoji: '🕰️',
    text: 'ממתינים לתוצאות.',
    sub: 'הבדיקות לוקחות זמן. ממתינים — ואז הרופא מספר מה גילו.',
  },
]

export const endPages: BookPage[] = [
  {
    id: 'decision',
    emoji: '💬',
    text: 'הרופא מסביר מה עכשיו.',
    sub: 'לפעמים חוזרים הביתה. לפעמים צריך עוד בדיקות. בכל מקרה — מסבירים.',
  },
  {
    id: 'end',
    emoji: '⭐',
    text: 'עשינו את זה!',
    sub: 'הביקור בבית החולים הסתיים. אפשר להיות גאים.',
  },
]
