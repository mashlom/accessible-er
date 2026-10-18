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
    text: 'מגיעים לבית החולים',
    sub: 'ליד הכניסה יש שולחן. שם רושמים את השם שלך, שואלים מה קרה ורושמים הכול. אפשר לענות בעצמך, ואפשר לתת להורים לענות.',
  },
  {
    id: 'wait-before-triage',
    emoji: '⏳',
    text: 'מחכים שיקראו לנו',
    sub: 'אפשר לשבת, להסתכל מסביב, או לנשום לאט.',
  },
  {
    id: 'triage',
    emoji: '🌡️',
    text: 'אחות מגיעה לבדוק',
    sub: 'מודדים לך חום, לחץ דם ודופק. זה לוקח כמה דקות ולא כואב.',
  },
  {
    id: 'wait-doctor',
    emoji: '🪑',
    text: 'ממתינים',
    sub: 'מחכים עד שהרופא פנוי. אפשר לשבת, לנשום, ולחכות בשקט.',
  },
  {
    id: 'doctor',
    emoji: '👩‍⚕️',
    text: 'בחדר הרופא/ה',
    sub: 'הרופא/ה שואל/ת שאלות ובודק/ת. גם את/ה יכול/ה לשאול משהו.',
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
    text: 'הולכים לבדיקות',
    sub: 'לפעמים צריך בדיקת דם או רנטגן. זה עוזר לרופא להבין מה קורה.',
  },
  {
    id: 'treatment',
    emoji: '💊',
    text: 'מקבלים טיפול',
    sub: 'לפעמים נותנים תרופה או עושים טיפול קטן. זה עוזר להרגיש טוב יותר.',
  },
  {
    id: 'consult',
    emoji: '🧑‍⚕️',
    text: 'רופא נוסף מגיע',
    sub: 'רופא נוסף צריך לבדוק אותך. הוא יגיד מה לעשות הלאה.',
  },
  {
    id: 'wait-results',
    emoji: '🕰️',
    text: 'ממתינים לתוצאות',
    sub: 'הבדיקות לוקחות זמן. ממתינים — ואז הרופא מספר מה גילו.',
  },
]

/** Where the family goes after the decision: the parent and the child choose it together (issue #10). */
export const dispositionPage: BookPage = {
  id: 'disposition',
  emoji: '🛏️',
  text: 'הולכים הביתה או נשארים?',
  sub: 'לפעמים חוזרים הביתה, ולפעמים נשארים בבית החולים כמה ימים. הרופא/ה מחליט/ה יחד איתכם.',
}

export const homePage: BookPage = {
  id: 'home',
  emoji: '🏠',
  text: 'חוזרים הביתה.',
  sub: 'גם בבית צריך זמן ומנוחה. אפשר לדבר על מה שעברנו.',
}

export const hospitalPage: BookPage = {
  id: 'hospital',
  emoji: '🏥',
  text: 'נשארים בבית החולים.',
  sub: 'כאן שומרים עלינו מקרוב, ותמיד יש מי שיהיה לידנו. אפשר לשאול כמה לילות.',
}

export const endPages: BookPage[] = [
  {
    id: 'decision',
    emoji: '💬',
    text: 'הרופא מסביר מה עכשיו',
    sub: 'לפעמים חוזרים הביתה. לפעמים צריך עוד בדיקות. בכל מקרה — מסבירים.',
  },
  {
    id: 'end',
    emoji: '⭐',
    text: 'עשינו את זה!',
    sub: 'הביקור בבית החולים הסתיים. אפשר להיות גאים.',
  },
]
