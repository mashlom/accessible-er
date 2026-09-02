import type { RoniMood } from './components/Roni'

export interface CompanionLine {
  text: string
  mood: RoniMood
}

/**
 * What Roni says on each screen. He is present everywhere in this concept,
 * so the line has to change with the place — otherwise he stops being a
 * companion and becomes decoration.
 *
 * Keys are the path inside the concept ('' = the concept's home screen).
 */
const lines: Record<string, CompanionLine> = {
  '': { text: 'שלום! אני רוני. נעבור את היום הזה יחד.', mood: 'wave' },
  reason: { text: 'ספרו לי למה באנו, ואראה את הדרך שלנו.', mood: 'curious' },
  trail: { text: 'כל תחנה היא עוד צעד קטן. לא ממהרים.', mood: 'happy' },
  show: { text: 'בואו נציץ מה עומד לקרות.', mood: 'curious' },
  map: { text: 'אראה לכם איפה רועש ואיפה אפשר לנוח.', mood: 'calm' },
  calm: { text: 'קשה עכשיו? ננשום יחד. אני נשאר כאן.', mood: 'hug' },
  distract: { text: 'תסתכלו לכאן. אני איתכם עד שזה נגמר.', mood: 'calm' },
  requests: { text: 'מותר לבקש! הנה מה שאפשר.', mood: 'happy' },
  card: { text: 'נכין כרטיס שמספר מה חשוב לדעת עליי.', mood: 'curious' },
  'card/view': { text: 'אפשר להראות את הכרטיס לצוות מהמסך.', mood: 'proud' },
  'going-home': { text: 'עוד מעט הביתה. ניקח את הזמן.', mood: 'sleepy' },
  message: { text: 'רוצים לבקש משהו או להגיד תודה?', mood: 'happy' },
  feedback: { text: 'איך היה לכם היום?', mood: 'proud' },
  settings: { text: 'הדף הזה לצוות — הקוד לשילוט.', mood: 'calm' },
}

export function lineFor(subPath: string): CompanionLine {
  if (lines[subPath]) return lines[subPath]
  // procedure story pages: /show/:id
  if (subPath.startsWith('show/')) {
    return { text: 'אני כאן לאורך כל הסיפור. אפשר לעצור בכל עמוד.', mood: 'calm' }
  }
  return lines[''] as CompanionLine
}

/** Said when the child taps Roni — a small dose of agency and play. */
export const tapLines: CompanionLine[] = [
  { text: 'היי! נגעתם בי 😊', mood: 'happy' },
  { text: 'אני כאן. לא הולך לשום מקום.', mood: 'hug' },
  { text: 'רוצים לנשום איתי? פנימה… והחוצה…', mood: 'calm' },
  { text: 'אתם עושים את זה מצוין!', mood: 'cheer' },
  { text: 'אפשר גם רק לשבת בשקט. גם זה בסדר.', mood: 'sleepy' },
  { text: 'מה נראה עכשיו? אני סקרן.', mood: 'curious' },
  { text: 'אני גאה בכם 🌟', mood: 'proud' },
  { text: 'שלום שלום! 👋', mood: 'wave' },
]
