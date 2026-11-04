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

  // the care card's parts, card-<part>
  'card-about': [ring(12, 8, 4), 'M4 21a8 8 0 0 1 16 0'],
  'card-sensitivities': ['M7.5 9.5a4.5 4.5 0 1 1 9 0c0 3.2-3 3.8-3 6.8a2.8 2.8 0 0 1-5.6.2', 'M10.5 10a1.5 1.5 0 0 1 3 0'],
  'card-calming': ['M12 20s-8-4.6-8-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 8 2.4C20 15.4 12 20 12 20z'],
  'card-escalators': ['M13 2.5L5 14h6l-1 7.5 8-11.5h-6z'],
  'card-hardMoments': ['M5 3v5a4 4 0 0 0 8 0V3', 'M9 12v2.5a5 5 0 0 0 10 0V12', ring(19, 10, 2)],
  'card-pain': ['M4 15L15 4a3.5 3.5 0 0 1 5 5L9 20a3.5 3.5 0 0 1-5-5z', 'M9.5 9.5l5 5'],
  'card-avoid': [ring(12, 12, 9), 'M5.6 5.6l12.8 12.8'],
  'card-asks': [
    'M7 12.5V7a1.5 1.5 0 0 1 3 0v4',
    'M10 11V4.5a1.5 1.5 0 0 1 3 0V11',
    'M13 11V5.5a1.5 1.5 0 0 1 3 0V11',
    'M16 11V8a1.5 1.5 0 0 1 3 0v7a6 6 0 0 1-6 6h-1.2a6 6 0 0 1-4.6-2.2L3.6 15.4a1.6 1.6 0 0 1 2.4-2.1L7 14.4',
  ],
  'card-else': ['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4'],
  'card-suggestions': ['M9 18h6', 'M10 21h4', 'M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z'],

  // the places on the ER map, area-<id>
  'area-entrance': ['M6 21V4h10v17', 'M4 21h16', 'M13 12.5v.5', 'M16 6l3 1v14'],
  'area-triage': ['M3 12h4l2-4 3 8 2-4h7'],
  'area-waiting': ['M7 4v9', 'M7 13h10v-2a2 2 0 0 0-2-2H7', 'M7 13v7', 'M17 13v7'],
  'area-doctor': ['M5 3v5a4 4 0 0 0 8 0V3', 'M9 12v2.5a5 5 0 0 0 10 0V12', ring(19, 10, 2)],
  'area-outside': ['M12 21v-6', 'M12 15c-4 0-6-2.5-6-5.5S8.5 3 12 3s6 3.5 6 6.5S16 15 12 15z', 'M9 21h6'],
  'area-quiet-room': ['M19 14.5A8 8 0 1 1 9.5 5a6.5 6.5 0 0 0 9.5 9.5z'],
  'area-treatment': ['M3 7v13', 'M21 20v-5H3', 'M3 15h18v-3a3 3 0 0 0-3-3h-7v6', ring(7, 12, 1.8)],
  'area-imaging': ['M3 8h4l2-3h6l2 3h4v11H3z', ring(12, 13.5, 3.5)],
  'area-ct': [ring(12, 12, 8), ring(12, 12, 3.5)],
  'area-restroom': [ring(7, 5, 1.8), 'M5 9h4l.5 6H8v5H6v-5H4.5z', ring(17, 5, 1.8), 'M15 9h4l1.5 7H19v4h-4v-4h-1.5z', 'M12 3v18'],

  // the sensory channels, sense-<key>
  'sense-sound': ['M4 9.5h3.5L12 5v14l-4.5-4.5H4z', 'M15.5 9a4 4 0 0 1 0 6', 'M18 6.5a7.5 7.5 0 0 1 0 11'],
  'sense-light': ['M9 18h6', 'M10 21h4', 'M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z'],
  'sense-smell': ['M12 4c-.5 4-3 7-3 10a3 3 0 0 0 3 3 3 3 0 0 0 3-3', 'M8.5 17.5a2.5 2.5 0 0 1-2-3', 'M15.5 17.5a2.5 2.5 0 0 0 2-3'],
  'sense-people': [ring(8, 8, 3), 'M3 20a5 5 0 0 1 10 0', ring(16.5, 9, 2.5), 'M15 20h6a4.5 4.5 0 0 0-6.5-4'],
  // how busy a place is: a face, calm to crowded
  'load-calm': [ring(12, 12, 9), 'M8.5 10.5h2', 'M13.5 10.5h2', 'M9 15a4 4 0 0 0 6 0'],
  'load-medium': [ring(12, 12, 9), 'M9 10v.5', 'M15 10v.5', 'M9 15h6'],
  'load-busy': [ring(12, 12, 9), 'M8.5 9l2 1.5-2 1.5', 'M15.5 9l-2 1.5 2 1.5', 'M9 16c1-1 2-1 3 0s2 1 3 0'],

  // the requests one can make of the staff, request-<n> in their order
  'request-0': ['M4 15v-3a8 8 0 0 1 16 0v3', 'M4 15h3v5H5a1 1 0 0 1-1-1z', 'M20 15h-3v5h2a1 1 0 0 0 1-1z'],
  'request-1': [ring(12, 8, 4), 'M4 21a8 8 0 0 1 16 0'],
  'request-2': ['M4 5h10a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H9l-3 2.5V13H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z', 'M14 21v-4.5a1.3 1.3 0 0 1 2.6 0V15a1.3 1.3 0 0 1 2.6 0v1a1.3 1.3 0 0 1 2.6 0v2.5a2.5 2.5 0 0 1-2.5 2.5z'],
  'request-3': ['M12 21v-7', 'M12 14L6 8', 'M12 14l6-6', 'M6 4v4h4', 'M18 4v4h-4'],
  'request-4': [ring(12, 12, 9), 'M12 7v5l3 2'],
  'request-5': ['M9 3h6v4H9z', 'M8 7h8v13a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z', 'M10.5 12h3', 'M12 10.5v3'],
  'request-6': [ring(12, 12, 4), 'M12 3v2', 'M12 19v2', 'M3 12h2', 'M19 12h2', 'M5.6 5.6l1.4 1.4', 'M17 17l1.4 1.4'],
  'request-7': ['M3 5h18v14H3z', ring(8.5, 10, 1.8), 'M3 17l5-4 4 3 3-2 6 4'],

  // the feedback: its faces and the puzzle of the diagnosis question
  'face-1': [ring(12, 12, 9), 'M9 10v.5', 'M15 10v.5', 'M8.5 16.5a4.5 4.5 0 0 1 7 0'],
  'face-2': [ring(12, 12, 9), 'M9 10v.5', 'M15 10v.5', 'M9 15a4 4 0 0 0 6 0'],
  'face-3': [ring(12, 12, 9), 'M8.5 10a1.5 1.5 0 0 1 3 0', 'M12.5 10a1.5 1.5 0 0 1 3 0', 'M7.5 13.5h9a4.5 4.5 0 0 1-9 0z'],
  puzzle: ['M4 8h4a2 2 0 1 1 4 0h4v4a2 2 0 1 1 0 4v4h-4a2 2 0 1 0-4 0H4v-4a2 2 0 1 0 0-4z'],

  // what helps when it's hard, tip-<id>
  'tip-fewer-words': ['M4 5h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3.5V15H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z', 'M7 10h6'],
  'tip-more-space': ['M3 12h18', 'M6 9l-3 3 3 3', 'M18 9l3 3-3 3', 'M12 4v4', 'M12 16v4'],
  'tip-less-stimuli': ['M4 9.5h3.5L12 5v14l-4.5-4.5H4z', 'M16 9.5l5 5', 'M21 9.5l-5 5'],
  'tip-pause': [ring(12, 12, 9), 'M10 9v6', 'M14 9v6'],
  'tip-familiar': [ring(12, 13, 6), ring(7.5, 6.5, 2.2), ring(16.5, 6.5, 2.2), 'M10.5 12v.5', 'M13.5 12v.5', 'M10.5 15.5a2 2 0 0 0 3 0'],
  'tip-mediate': [ring(6, 7, 2.5), 'M2 17a4 4 0 0 1 8 0', ring(18, 7, 2.5), 'M14 17a4 4 0 0 1 8 0', 'M10 12h4'],

  // going home and staying in the hospital: the blocks' icons, end-<kind>-<n>
  'end-discharge-0': ['M9 3h6v3H9z', 'M7.5 4.5H5V21h14V4.5h-2.5', 'M8.5 11h7', 'M8.5 15h5'],
  'end-discharge-1': ['M6 21V4h10v17', 'M4 21h16', 'M13 12.5v.5', 'M16 6l3 1v14'],
  'end-discharge-2': ['M4 11l8-7 8 7M6 10v9h4v-5h4v5h4v-9'],
  'end-discharge-3': ['M3 9h18v11H3z', 'M8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3', 'M3 14h18', 'M11 13v2h2v-2'],
  'end-discharge-4': ['M5 3v5a4 4 0 0 0 8 0V3', 'M9 12v2.5a5 5 0 0 0 10 0V12', ring(19, 10, 2)],
  'end-admission-0': ['M5 21V5h14v16', 'M3 21h18', 'M12 8v6', 'M9 11h6'],
  'end-admission-1': ['M6 21V4h10v17', 'M4 21h16', 'M13 12.5v.5', 'M16 6l3 1v14'],
  'end-admission-2': ['M3 7v13', 'M21 20v-5H3', 'M3 15h18v-3a3 3 0 0 0-3-3h-7v6', ring(7, 12, 1.8)],
  'end-admission-3': ['M12 20s-8-4.6-8-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 8 2.4C20 15.4 12 20 12 20z'],
  'end-admission-4': ['M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z'],

  // the home's tile for staying in the hospital: a bed

  // a procedure page's "what actually happens": an eye
  'proc-what': ['M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z', ring(12, 12, 3)],

  // why we came today, reason-<id>
  'reason-fever': ['M10 4.5a2 2 0 0 1 4 0v9.8a4 4 0 1 1-4 0z', 'M12 9v7.5'],
  'reason-abdominal': ['M8 3c-1.5 3-1.5 5 0 7-2 2-3 4.5-3 7a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4c0-2.5-1-5-3-7 1.5-2 1.5-4 0-7', ring(12, 15, 1)],
  'reason-limb-injury': ['M6 6.5a2 2 0 1 1 3.2-1.6l5.9 5.9a2 2 0 1 1 1.6 3.2 2 2 0 1 1-3.2 1.6l-5.9-5.9A2 2 0 1 1 6 6.5z'],
  'reason-cut': ['M4 15L15 4a3.5 3.5 0 0 1 5 5L9 20a3.5 3.5 0 0 1-5-5z', 'M9.5 9.5l5 5'],
  'reason-other': [ring(12, 12, 9), 'M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14', 'M12 17v.5'],

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
  'card-communication': 'talk.svg',
  // Shevi's bed: the stay in a ward on the parent's pages
  'tile-admission': 'bed.svg',
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
