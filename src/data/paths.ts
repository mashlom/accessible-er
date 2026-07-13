import type { VisitPath } from './types'

/**
 * Reasons for the visit. Each tailors the "road ahead" (the likely
 * sequence of stops) shown to the family. Based on the common ER
 * routes in the spec. The route is illustrative — the real path is
 * always decided by the medical team.
 */
export const paths: VisitPath[] = [
  {
    id: 'fever',
    label: 'חום / מחלה',
    emoji: '🌡️',
    blurb: 'בדרך כלל: קבלה, טריאז׳, בדיקת רופא, ולפי הצורך בדיקת דם או צילום.',
    route: [
      { title: 'קבלה במזכירות' },
      { title: 'טריאז׳ ומדידות' },
      { title: 'בדיקת רופא/ה', procedureId: 'doctor-exam' },
      { title: 'בדיקת דם', procedureId: 'blood-test', optional: true },
      { title: 'צילום חזה', procedureId: 'xray', optional: true },
      { title: 'טיפול ושחרור או המשך בירור' },
    ],
  },
  {
    id: 'abdominal',
    label: 'כאבי בטן',
    emoji: '🤕',
    blurb: 'בדרך כלל: קבלה, טריאז׳, בדיקת רופא, ולפי הצורך בדיקות דם, אולטרסאונד או ייעוץ.',
    route: [
      { title: 'קבלה במזכירות' },
      { title: 'טריאז׳ ומדידות' },
      { title: 'בדיקת רופא/ה', procedureId: 'doctor-exam' },
      { title: 'בדיקת דם', procedureId: 'blood-test', optional: true },
      { title: 'בדיקת שתן', procedureId: 'urine', optional: true },
      { title: 'אולטרסאונד בטן', procedureId: 'ultrasound', optional: true },
      { title: 'CT בטן', procedureId: 'ct', optional: true },
      { title: 'ייעוץ מומחה', optional: true },
      { title: 'טיפול ושחרור או אשפוז' },
    ],
  },
  {
    id: 'limb-injury',
    label: 'חבלה ביד או ברגל',
    emoji: '🦴',
    blurb: 'בדרך כלל: קבלה, טריאז׳, בדיקת רופא, צילום, ולפי הצורך גבס או חבישה.',
    route: [
      { title: 'קבלה במזכירות' },
      { title: 'טריאז׳ ומדידות' },
      { title: 'בדיקת רופא/ה', procedureId: 'doctor-exam' },
      { title: 'צילום רנטגן', procedureId: 'xray' },
      { title: 'ייעוץ אורתופדי', optional: true },
      { title: 'גבס או סד', procedureId: 'cast', optional: true },
      { title: 'שחרור עם הנחיות' },
    ],
  },
  {
    id: 'cut',
    label: 'חתך או פציעה בעור',
    emoji: '🩹',
    blurb: 'בדרך כלל: קבלה, טריאז׳, בדיקת רופא, אלחוש, סגירת הפצע וחבישה.',
    route: [
      { title: 'קבלה במזכירות' },
      { title: 'טריאז׳ ומדידות' },
      { title: 'בדיקת רופא/ה', procedureId: 'doctor-exam' },
      { title: 'אלחוש מקומי', optional: true },
      { title: 'צילום', procedureId: 'xray', optional: true },
      { title: 'הדבקת פצע או תפירה', procedureId: 'stitches' },
      { title: 'חבישה והדרכה', procedureId: 'bandage' },
      { title: 'שחרור עם הנחיות' },
    ],
  },
  {
    id: 'other',
    label: 'סיבה אחרת / עדיין לא בטוחים',
    emoji: '💭',
    blurb: 'כל ביקור מתחיל אותו דבר: קבלה, טריאז׳ ובדיקת רופא. משם הצוות מתאים את ההמשך.',
    route: [
      { title: 'קבלה במזכירות' },
      { title: 'טריאז׳ ומדידות' },
      { title: 'בדיקת רופא/ה', procedureId: 'doctor-exam' },
      { title: 'בדיקות לפי הצורך', optional: true },
      { title: 'טיפול והחלטה על ההמשך' },
    ],
  },
]

export function getPath(id: string): VisitPath | undefined {
  return paths.find((p) => p.id === id)
}
