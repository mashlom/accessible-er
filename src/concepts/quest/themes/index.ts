export interface StageTheme {
  label: string
  icon: string
  /** Short flavour description shown on the map pin */
  hint: string
  /** Optional image shown on the map strip (path relative to /public) */
  image?: string
  /** If set, shown as hero on the stage detail page instead of image */
  heroImage?: string
}

export interface QuestTheme {
  id: string
  name: string
  emoji: string
  /** Background image path for portrait orientation */
  bg: string
  /** Background image path for landscape orientation (falls back to bg) */
  bgLandscape?: string
  /** Background for the night/procedures map (falls back to bg) */
  nightBg?: string
  /** Thumbnail shown on world select card (falls back to bg) */
  thumbnail?: string
  /** Instruction text on the procedure select screen */
  procedurePrompt?: string
  /** CSS colour used for UI accents in this world */
  accent: string
  accentSoft: string
  /** Text colour on accent background */
  accentText: string
  /** Map pin colour for completed stages */
  completedColor: string
  /** Per-stage overrides — only required stages need entries */
  stages: Record<string, StageTheme>
}

export const themes: QuestTheme[] = [
  {
    id: 'knight',
    name: 'אביר בטירה',
    emoji: '⚔️',
    bg: '/worlds/knight/castle_v.jpg',
    bgLandscape: '/worlds/knight/castle_h.jpeg',
    nightBg: '/worlds/knight/night_castle.JPEG',
    thumbnail: '/worlds/knight/knight.jpeg',
    procedurePrompt: 'בקשו מהגברת היפה (האחות) לבחור את הפרוצדורות שהקוסם הגדול קבע',
    accent: '#7b4f28',
    accentSoft: '#f5e6d0',
    accentText: '#ffffff',
    completedColor: '#c9a84c',
    stages: {
      reception: { label: 'שער הטירה', icon: '🏰', hint: 'הגיבור/ת נרשמ/ת בספר הגיבורים', image: '/worlds/knight/tower.jpg' },
      triage: { label: 'בדיקת הכוחות', icon: '⚔️', hint: 'הרופא הצבאי בודק שאתה כשיר/ה למסע', image: '/worlds/knight/tests.jpeg' },
      'wait-doctor': { label: 'אולם האבירים', icon: '🐉', hint: 'ממתינים — והדרקון שומר על הסוד', image: '/worlds/knight/wait.JPEG' },
      doctor: { label: 'פגישה עם הקוסם הגדול', icon: '🧙', hint: 'הקוסם מחליט מהו הקסם הנכון', image: '/worlds/knight/wizard.JPEG' },
      decision: { label: 'טקס הניצחון', icon: '🏆', hint: 'קיבלתם גלילה — המסע הסתיים!', image: '/worlds/knight/celebrating.jpg' },
      // secret rooms
      tests: { label: 'מראת הקסמים', icon: '🪄', hint: 'המראה רואה מה שעיניים לא יכולות', image: '/worlds/knight/rentgen.jpeg' },
      treatment: { label: 'חדר הנשק', icon: '🔧', hint: 'הנפח מתקן מה שנשבר בקרב', image: '/worlds/knight/procedures.jpeg' },
      consult: { label: 'מועצת החכמים', icon: '📜', hint: 'חכם נוסף מצטרף לעזור', image: '/worlds/knight/wizard2.JPEG' },
      'wait-results': { label: 'המתנה לנבואה', icon: '🔮', hint: 'הגביש מעבד את התשובות', image: '/worlds/knight/door.JPEG' },
    },
  },
  {
    id: 'dino',
    name: 'דינוזאורים',
    emoji: '🦕',
    bg: '',
    accent: '#4a7c3f',
    accentSoft: '#dcefd8',
    accentText: '#ffffff',
    completedColor: '#8bc34a',
    stages: {
      reception: { label: 'כניסה לשמורה', icon: '🌿', hint: 'נרשמים בשמורת הדינוזאורים' },
      triage: { label: 'בדיקת חוקר', icon: '🔭', hint: 'החוקר בודק שאתה בריא/ה למסע' },
      'wait-doctor': { label: 'מחנה ההמתנה', icon: '🏕️', hint: 'נחים במחנה עד שהמדריך מוכן' },
      doctor: { label: 'פגישה עם המדריך הראשי', icon: '🦖', hint: 'המדריך מחליט איזה מסלול נעשה' },
      decision: { label: 'בריחה מהגעש!', icon: '🌋', hint: 'יצאנו בשלום — המסע הסתיים!' },
      tests: { label: 'מעבדת הממצאים', icon: '🧪', hint: 'בודקים את הדגימות שנמצאו' },
      treatment: { label: 'עמדת הטיפול', icon: '🩹', hint: 'מטפלים בפצע מהמסע' },
      consult: { label: 'מומחה השטח', icon: '🗺️', hint: 'מומחה נוסף מגיע לעזור' },
      'wait-results': { label: 'ממתינים לתוצאות הדגימות', icon: '⏳', hint: 'המעבדה עובדת' },
    },
  },
  {
    id: 'fairy',
    name: 'פיה בגן הקסמים',
    emoji: '🧚',
    bg: '/worlds/fairy/6bf9b600-f83d-4d9e-90ce-4233e11f4b30.JPEG',
    accent: '#9c5ab5',
    accentSoft: '#f0e0f7',
    accentText: '#ffffff',
    completedColor: '#d4a8e8',
    stages: {
      reception: { label: 'שער הגן', icon: '🌸', hint: 'נרשמים בגן הקסמים' },
      triage: { label: 'בדיקת הקסמים', icon: '✨', hint: 'הפיה הרפואית בודקת את הקסם שלך' },
      'wait-doctor': { label: 'פינת הפרחים', icon: '🌺', hint: 'יושבים בין הפרחים ומחכים' },
      doctor: { label: 'פגישה עם פיית הריפוי', icon: '🧚', hint: 'הפיה מחליטה איזה קסם תרפא' },
      decision: { label: 'פרח הניצחון', icon: '🌟', hint: 'קיבלתם פרח קסמים — נרפאתם!' },
      tests: { label: 'קסם הראייה', icon: '🔮', hint: 'הגביש מראה מה שבפנים' },
      treatment: { label: 'שרביט הריפוי', icon: '🪄', hint: 'הפיה מרפאה בשרביטה' },
      consult: { label: 'מועצת הפיות', icon: '🌈', hint: 'פיה נוספת מגיעה לעזור' },
      'wait-results': { label: 'ממתינים לקסם', icon: '💫', hint: 'הקסם בהכנה' },
    },
  },
  {
    id: 'space',
    name: 'אסטרונאוט בחלל',
    emoji: '🚀',
    bg: '/worlds/space/space.jpg',
    accent: '#1a3a6b',
    accentSoft: '#d0dcf5',
    accentText: '#ffffff',
    completedColor: '#5c8de8',
    stages: {
      reception: { label: 'כניסה לתחנה', icon: '🛸', hint: 'נרשמים בתחנת החלל' },
      triage: { label: 'בדיקות לפני המראה', icon: '📡', hint: 'הטכנאי בודק שאתה מוכן/ה לטיסה' },
      'wait-doctor': { label: 'חדר בקרה', icon: '🌍', hint: 'ממתינים לקברניט שיסיים תדרוך' },
      doctor: { label: 'פגישה עם הקברניט', icon: '👨‍🚀', hint: 'הקברניט קובע את מסלול הטיסה' },
      decision: { label: 'נחיתה מוצלחת!', icon: '🌙', hint: 'חזרנו לכדור הארץ בשלום!' },
      tests: { label: 'סורק החלל', icon: '🔭', hint: 'הסורק רואה מה שהעין לא רואה' },
      treatment: { label: 'תיקון התחנה', icon: '🔧', hint: 'הטכנאי מתקן את מה שצריך' },
      consult: { label: 'מרכז פיקוד', icon: '📻', hint: 'מומחה נוסף מצטרף לעזור' },
      'wait-results': { label: 'עיבוד נתונים', icon: '💻', hint: 'המחשב מנתח את הנתונים' },
    },
  },
  {
    id: 'safari',
    name: 'ספארי באפריקה',
    emoji: '🦁',
    bg: '/worlds/safari/safari.JPEG',
    accent: '#b5720a',
    accentSoft: '#fcefd0',
    accentText: '#ffffff',
    completedColor: '#e8a825',
    stages: {
      reception: { label: 'כניסה למחנה', icon: '⛺', hint: 'נרשמים במחנה הספארי' },
      triage: { label: 'בדיקת הציוד', icon: '🎒', hint: 'המדריך בודק שאתה מוכן/ה לצאת לשטח' },
      'wait-doctor': { label: 'ממתינים לאריה', icon: '🦁', hint: 'האריה עסוק — מחכים בסבלנות' },
      doctor: { label: 'פגישה עם ראש השבט', icon: '🐘', hint: 'הפיל הזקן מחליט מה עושים' },
      decision: { label: 'חזרה למחנה!', icon: '🌅', hint: 'השקיעה יפה — המסע הסתיים!' },
      tests: { label: 'מעבדת השטח', icon: '🔬', hint: 'בודקים את הדגימות מהשטח' },
      treatment: { label: 'עמדת הטיפול', icon: '🩹', hint: 'הרופא הווטרינר עוזר' },
      consult: { label: 'מומחה מהסוואנה', icon: '🦒', hint: 'מומחה נוסף מגיע' },
      'wait-results': { label: 'ממתינים לתוצאות', icon: '🕐', hint: 'הדגימות בבדיקה' },
    },
  },
  {
    id: 'ocean',
    name: 'הרפתקה תת-ימית',
    emoji: '🐠',
    bg: '/worlds/ocean/ocean.jpg',
    accent: '#0a6b8a',
    accentSoft: '#d0eef5',
    accentText: '#ffffff',
    completedColor: '#25b8e8',
    stages: {
      reception: { label: 'כניסה לצוללת', icon: '🚢', hint: 'נרשמים בבסיס התת-ימי' },
      triage: { label: 'בדיקות לצלילה', icon: '🤿', hint: 'הקצין בודק שאתה מוכן/ה לצלילה' },
      'wait-doctor': { label: 'ממתינים בתא', icon: '🐟', hint: 'דגים עוברים בחוץ, ממתינים לקברניט' },
      doctor: { label: 'פגישה עם קברניט הצוללת', icon: '🐙', hint: 'התמנון החכם מחליט מה לעשות' },
      decision: { label: 'עלייה לפני השטח!', icon: '🌊', hint: 'צפנו בעולם התת-ימי — חוזרים!' },
      tests: { label: 'סונאר הצוללת', icon: '📡', hint: 'הסונאר רואה דרך המים' },
      treatment: { label: 'תיקון הצוללת', icon: '🔧', hint: 'המהנדס מתקן את מה שצריך' },
      consult: { label: 'קשר עם הבסיס', icon: '📻', hint: 'מומחה מהבסיס מתחבר' },
      'wait-results': { label: 'עיבוד נתוני הסונאר', icon: '💾', hint: 'הסונאר מעבד נתונים' },
    },
  },
  {
    id: 'real',
    name: 'אני',
    emoji: '🏥',
    bg: '/worlds/real/real.jpg',
    accent: '#2c6e8a',
    accentSoft: '#deeef5',
    accentText: '#ffffff',
    completedColor: '#4caf80',
    stages: {
      reception: { label: 'קבלה במזכירות', icon: '📝', hint: 'פותחים תיק ביקור' },
      triage: { label: 'טריאז׳ ומדידות', icon: '🩺', hint: 'אחות מודדת ובודקת' },
      'wait-doctor': { label: 'המתנה לרופא/ה', icon: '⏳', hint: 'ממתינים בחדר ההמתנה' },
      doctor: { label: 'בדיקת רופא/ה', icon: '👩‍⚕️', hint: 'הרופא/ה בודק/ת ומחליט/ה' },
      decision: { label: 'שחרור או אשפוז', icon: '🏁', hint: 'סוף הביקור' },
      tests: { label: 'בדיקות', icon: '🔬', hint: 'בדיקות דם, רנטגן ועוד' },
      treatment: { label: 'טיפול', icon: '💊', hint: 'הטיפול שהוחלט עליו' },
      consult: { label: 'ייעוץ מומחה', icon: '🧑‍⚕️', hint: 'רופא מומחה מגיע לבדוק' },
      'wait-results': { label: 'המתנה לתוצאות', icon: '🕰️', hint: 'ממתינים לתשובות' },
    },
  },
]

export function getTheme(id: string): QuestTheme {
  return themes.find((t) => t.id === id) ?? themes[0]
}
