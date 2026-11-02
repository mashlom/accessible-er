/**
 * Thin black line icons in Shevi's style (Figma "Mashlom.me"): the drop, the test tubes and the talk bubbles
 * are hers (public/icons/drop.svg, tubes.svg, talk.svg, as exported), the house is hers from the last sheet; the rest are drawn to match them — a 24-unit square,
 * a 1.5 line with round ends, no fill.
 */
const ring = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`

const PATHS: Record<string, string[]> = {
  // the parent's tiles
  trail: [ring(5, 19, 2), 'M7 19h5a3.5 3.5 0 0 0 0-7H9a3 3 0 0 1 0-6h8', 'M18 3v6', 'M18 3h3.5l-1 1.5 1 1.5H18'],
  'wait-times': [ring(12, 12, 9), 'M12 7v5l3 2'],
  show: ['M9 3h6v3H9z', 'M7.5 4.5H5V21h14V4.5h-2.5', 'M8.5 11h7', 'M8.5 15h5'],
  card: ['M3 5.5h18v13H3z', ring(8.5, 10.5, 1.8), 'M5.5 15.5c.8-1.8 5.2-1.8 6 0', 'M14 10h4.5', 'M14 14h3.5'],
  map: ['M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z', 'M9 4v14', 'M15 6v14'],
  calm: ['M12 20s-8-4.6-8-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 8 2.4C20 15.4 12 20 12 20z'],
  distract: [ring(9, 14, 5), ring(17, 7, 3), ring(18.5, 16.5, 2), 'M6.5 12.5a2.5 2.5 0 0 1 2-1.5'],
  // a raised hand: four fingers and the thumb
  requests: [
    'M7 12.5V7a1.5 1.5 0 0 1 3 0v4',
    'M10 11V4.5a1.5 1.5 0 0 1 3 0V11',
    'M13 11V5.5a1.5 1.5 0 0 1 3 0V11',
    'M16 11V8a1.5 1.5 0 0 1 3 0v7a6 6 0 0 1-6 6h-1.2a6 6 0 0 1-4.6-2.2L3.6 15.4a1.6 1.6 0 0 1 2.4-2.1L7 14.4',
  ],
  // Shevi's house, as on the last sheet's "going home" answer (quest ButtonIcon)
  'going-home': ['M4 11l8-7 8 7M6 10v9h4v-5h4v5h4v-9'],
  feedback: ['M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z'],

  // the stages of the visit (the trail), stage-<id>
  'stage-reception': ['M4 18h16', 'M5.5 18a6.5 6.5 0 0 1 13 0', 'M12 9.5V8', 'M10.5 8h3'],
  'stage-wait-before-triage': ['M7 4v9', 'M7 13h10v-2a2 2 0 0 0-2-2H7', 'M7 13v7', 'M17 13v7'],
  'stage-triage': ['M3 12h4l2-4 3 8 2-4h7'],
  'stage-wait-doctor': [ring(12, 12, 9), 'M12 7v5l3 2'],
  'stage-doctor': ['M5 3v5a4 4 0 0 0 8 0V3', 'M9 12v2.5a5 5 0 0 0 10 0V12', ring(19, 10, 2)],
  'stage-consult': [ring(8, 8, 3), 'M3 20a5 5 0 0 1 10 0', ring(16.5, 9, 2.5), 'M15 20h6a4.5 4.5 0 0 0-6.5-4'],
  'stage-wait-results': ['M7 3h10', 'M7 21h10', 'M8 3c0 5 8 5 8 9s-8 4-8 9', 'M16 3c0 5-8 5-8 9s8 4 8 9'],
  'stage-treatment': ['M8.5 15.5l7-7a3.5 3.5 0 1 1 5 5l-7 7a3.5 3.5 0 0 1-5-5z', 'M10.5 10.5l3 3'],
  'stage-decision': ['M12 3v18', 'M12 5h6l2 2-2 2h-6', 'M12 11H6l-2 2 2 2h6', 'M9 21h6'],

  // the procedures
  temperature: ['M10 4.5a2 2 0 0 1 4 0v9.8a4 4 0 1 1-4 0z', 'M12 9v7.5'],
  saturation: ['M3 9.5h11a4.5 4.5 0 0 1 0 9H3z', 'M3 9.5V7a2 2 0 0 1 2-2h6', 'M6 14h2l1-2 2 4 1-2h2'],
  'blood-pressure': [ring(12, 13, 8), 'M12 13l3.5-3.5', 'M8 8.5l.8.8', 'M16 8.5l-.8.8', 'M12 7v1'],
  'doctor-exam': ['M5 3v5a4 4 0 0 0 8 0V3', 'M9 12v2.5a5 5 0 0 0 10 0V12', ring(19, 10, 2)],
  xray: ['M6 6.5a2 2 0 1 1 3.2-1.6l5.9 5.9a2 2 0 1 1 1.6 3.2 2 2 0 1 1-3.2 1.6l-5.9-5.9A2 2 0 1 1 6 6.5z'],
  ultrasound: ['M4 14a8 8 0 0 1 16 0', 'M8 14a4 4 0 0 1 8 0', 'M12 14v6', 'M9 20h6'],
  ct: [ring(12, 12, 8), ring(12, 12, 3.5)],
  iv: ['M9 3h6v6a3 3 0 0 1-6 0V3z', 'M12 12v7', 'M10 21h4'],
  medication: ['M8.5 15.5l7-7a3.5 3.5 0 1 1 5 5l-7 7a3.5 3.5 0 0 1-5-5z', 'M10.5 10.5l3 3'],
  inhalation: ['M6 10.5C6 7.4 8.7 5 12 5s6 2.4 6 5.5V12c0 3.6-2.7 6-6 6s-6-2.4-6-6z', 'M9.5 12h5', 'M12 18v3'],
  stitches: ['M3 12h18', 'M7 8v8', 'M12 8v8', 'M17 8v8'],
  cast: ['M5 5h14v14H5z', 'M5 9.5h14', 'M5 14.5h14'],
  bandage: ['M4 15L15 4a3.5 3.5 0 0 1 5 5L9 20a3.5 3.5 0 0 1-5-5z', 'M9.5 9.5l5 5'],
  'waiting-results': ['M7 3h10', 'M7 21h10', 'M8 3c0 5 8 5 8 9s-8 4-8 9', 'M16 3c0 5-8 5-8 9s8 4 8 9'],
}

/** Shevi's own drawings, used as they were exported */
const FILES: Record<string, string> = {
  'blood-test': 'drop.svg',
  urine: 'tubes.svg',
  talk: 'talk.svg',
  // the red Star of David of Magen David Adom (staying in the hospital), as on the last sheet's answer
  admission: 'magen-david.svg',
  'stage-tests': 'tubes.svg',
}

export function hasShevisIcon(id: string): boolean {
  return id in PATHS || id in FILES
}

/** The id's line icon at the given size, or the emoji when there is none for it */
export function LineIcon({ id, emoji, size = 24 }: { id: string; emoji?: string; size?: number }) {
  const file = FILES[id]
  if (file) {
    return <img src={`${import.meta.env.BASE_URL}icons/${file}`} alt="" aria-hidden style={{ width: size, height: size, objectFit: 'contain' }} />
  }
  const paths = PATHS[id]
  if (!paths) return <>{emoji ?? null}</>
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}
