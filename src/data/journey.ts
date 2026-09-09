import type { JourneyStage } from './types'

/**
 * The generic stages of an ER visit (module 3). Written in the spec's
 * "status + meaning + what you can ask" style, to reduce uncertainty
 * rather than only report a status. Wait ranges are invented demo
 * estimates and are shown as ranges only.
 */
export const journeyStages: JourneyStage[] = [
  {
    id: 'reception',
    title: 'קבלה במזכירות',
    emoji: '📝',
    meaning: 'זה השלב הראשון בביקור. אחרי כאן עוברים לטריאז׳.',
    whatHappens: 'המזכיר/ה שואל/ת פרטים ופותח/ת תיק ביקור. מקבלים לרוב צמיד זיהוי.',
    challenge: 'לפעמים יש תור והמתנה קצרה ליד דלפק. יכול להיות רועש.',
    canAsk: [
      'לשבת במקום שקט יותר בזמן ההמתנה',
      'לקבל הסבר קצר מה השלב הבא',
    ],
    waitRange: '5–15 דקות',
    sensory: { sound: 3, light: 3, smell: 1, people: 3 },
  },
  {
    id: 'triage',
    title: 'טריאז׳ ומדידות',
    emoji: '🩺',
    meaning: 'הטריאז׳ קובע סדר עדיפויות לפי דחיפות. אחרי כאן ממתינים לתור לרופא/ה.',
    whatHappens: 'אחות מודדת חום, דופק, לחץ דם וחמצן, ושואלת שאלות קצרות. שמים צמיד זיהוי אם עוד לא.',
    challenge: 'כמה מדידות במגע קרוב, זו אחר זו. מכשירים חדשים ותחושות חדשות.',
    canAsk: [
      'הסבר קצר לפני כל מדידה',
      'לבצע את המדידות אחת־אחת ובקצב שלנו',
      'להראות את המכשירים על ההורה קודם',
    ],
    waitRange: '10–20 דקות',
    waitKind: 'duration',
    procedureIds: ['temperature', 'saturation', 'blood-pressure'],
    sensory: { sound: 2, light: 3, smell: 1, people: 2 },
  },
  {
    id: 'wait-doctor',
    title: 'המתנה לרופא/ה',
    emoji: '⏳',
    meaning: 'עברתם טריאז׳ והמצב יציב. עכשיו ממתינים לתור לבדיקת רופא/ה.',
    whatHappens: 'ממתינים בחדר ההמתנה או בעמדה. אפשר להשתמש בזמן הזה להכנה לצעד הבא.',
    nextStagePrepare: 'אפשר לשחק "רופא" עם בובה לפני, ולהסביר שהרופא/ה רק מסתכל/ת ומקשיב/ה כדי לעזור.',
    challenge: 'ההמתנה עצמה ואי־הוודאות. סביבה עמוסה יכולה להציף.',
    canAsk: [
      'מרחב שקט יותר או פינת המתנה רגועה',
      'קיט חושי או אוזניות להפחתת רעש',
      'הערכת זמן משוערת (בטווחים)',
    ],
    waitRange: '30–90 דקות',
    sensory: { sound: 4, light: 4, smell: 2, people: 4 },
  },
  {
    id: 'doctor',
    title: 'בדיקת רופא/ה',
    emoji: '👩‍⚕️',
    meaning: 'זו הפגישה המרכזית בביקור. מכאן הדרך מתאימה אישית למצב של כל ילד/ה.',
    whatHappens: 'שיחה קצרה, בדיקה גופנית, והחלטה על בדיקות או טיפול לפי הצורך.',
    challenge: 'מגע של בדיקה גופנית, ואדם חדש שמתקרב. הרבה שאלות.',
    canAsk: [
      'שאדם אחד יוביל וידבר',
      'הסבר לפני כל נגיעה',
      'זמן עיבוד קצר בין שאלה לתשובה',
    ],
    waitRange: '10–20 דקות',
    waitKind: 'duration',
    procedureIds: ['doctor-exam'],
    sensory: { sound: 2, light: 3, smell: 1, people: 2 },
  },
  {
    id: 'tests',
    title: 'בדיקות (לפי הצורך)',
    emoji: '🔬',
    meaning: 'הרופא/ה החליט/ה שנדרש מידע נוסף. לא כולם עוברים את כל הבדיקות — רק מה שרלוונטי למצב.',
    whatHappens: 'מבצעים את הבדיקות שהוחלטו — דם, שתן, צילום, אולטרסאונד או אחרות. אפשר להכין את הילד/ה מראש לכל אחת.',
    challenge: 'מעבר בין מרחבים, מכשירים גדולים, המתנה בין בדיקות.',
    canAsk: [
      'הכנה חזותית לכל בדיקה מראש',
      'הפחתת גירויים במהלך הבדיקה',
      'שההורה יישאר קרוב',
    ],
    waitRange: 'משתנה לפי הבדיקה',
    waitKind: 'duration',
    procedureIds: ['blood-test', 'urine', 'xray', 'ultrasound', 'ct'],
    sensory: { sound: 3, light: 4, smell: 2, people: 2 },
  },
  {
    id: 'consult',
    title: 'ייעוץ מומחה (לפי הצורך)',
    emoji: '🧑‍⚕️',
    meaning:
      'לפעמים מזמינים רופא/ה מומחה — אורתופדיה, כירורגיה, אא״ג ועוד — לבדוק גם. לא לכולם צריך, וזה לא סימן שמשהו רע.',
    whatHappens:
      'רופא/ה נוסף/ת מגיע/ה, שואל/ת ובודק/ת, ולפעמים ממליץ/ה על בדיקה נוספת או טיפול.',
    challenge: 'עוד אדם חדש, עוד בדיקה, ולפעמים המתנה עד שהמומחה מגיע.',
    canAsk: [
      'לדעת לאיזה מומחה ממתינים ולמה',
      'שהמומחה יקבל מראש את מה שחשוב לדעת על הילד/ה',
      'שההסברים יינתנו שוב, בקצרה ובפשטות',
    ],
    waitRange: '20–60 דקות',
    sensory: { sound: 2, light: 3, smell: 1, people: 2 },
  },
  {
    id: 'wait-results',
    title: 'המתנה לתוצאות',
    emoji: '🕰️',
    meaning: 'הבדיקות בוצעו ועכשיו ממתינים לתשובות. זו לרוב ההמתנה הארוכה יותר.',
    whatHappens: 'התוצאות מגיעות בהדרגה. הרופא/ה יעדכן/תעדכן כשיהיה מידע.',
    challenge: 'המתנה ארוכה ולא צפויה. קל להרגיש "שכחו אותנו".',
    canAsk: [
      'עדכון ביניים על מה שכבר ידוע',
      'מרחב שקט להמתנה',
      'הערכת זמן משוערת לתוצאות',
    ],
    waitRange: '45–120 דקות',
    procedureIds: ['waiting-results'],
    sensory: { sound: 4, light: 3, smell: 2, people: 3 },
  },
  {
    id: 'treatment',
    title: 'טיפול במהלך הביקור',
    emoji: '💊',
    meaning: 'הרופא/ה החליט/ה על הטיפול הדרוש. כל טיפול ניתן להתאים לצרכי הילד/ה.',
    whatHappens: 'מבצעים את הטיפול שהוחלט — עירוי, תרופות, אינהלציה, גבס, חבישה או תפירה. לרוב אפשר לבקש התאמות שמקלות.',
    challenge: 'טיפולים שכוללים מגע, מחט או המתנה במקום אחד.',
    canAsk: [
      'משחה מאלחשת לפני דקירה',
      'הסחת דעת ואדם אחד שמוביל',
      'הכנה חזותית לפני כל טיפול',
    ],
    waitRange: 'משתנה לפי הטיפול',
    waitKind: 'duration',
    procedureIds: ['iv', 'medication', 'inhalation', 'stitches', 'cast', 'bandage'],
    sensory: { sound: 2, light: 3, smell: 2, people: 2 },
  },
  {
    id: 'decision',
    title: 'החלטה: שחרור או אשפוז',
    emoji: '🏁',
    meaning: 'הצוות מסכם. לרוב משתחררים הביתה עם הנחיות; לפעמים ממשיכים לאשפוז.',
    whatHappens: 'שיחת סיכום, הנחיות המשך, מרשמים אם צריך, והכנה ליציאה או למעבר למחלקה.',
    challenge: 'הרבה מידע בסוף ביקור ארוך ומעייף. מעבר למקום חדש אם מאשפזים.',
    canAsk: [
      'הנחיות כתובות או בתמונות',
      'סיכום קצר במשפטים פשוטים',
      'זמן להיפרד מהמרחב לפני מעבר',
    ],
  },
]

export function getStageIndex(id: string): number {
  return journeyStages.findIndex((s) => s.id === id)
}
