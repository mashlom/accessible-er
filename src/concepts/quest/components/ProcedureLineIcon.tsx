/** Simple line icons for the procedures, drawn in the mockup's style (thin black strokes on a light circle). */
const PATHS: Record<string, string[]> = {
  temperature: ['M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0z', 'M12 9v7'],
  saturation: ['M3 12h4l2-5 3 10 2-5h7'],
  'blood-pressure': ['M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M12 13l3.5-3.5', 'M8 8.5l.8.8M16 8.5l-.8.8M12 7v1'],
  'blood-test': ['M12 3c3.2 4 6 7 6 10.2a6 6 0 1 1-12 0C6 10 8.8 7 12 3z'],
  urine: ['M8 3v11a3 3 0 0 0 6 0V3', 'M7 3h8', 'M17 6v9a2.5 2.5 0 0 0 5 0V6', 'M16 6h7'],
  xray: ['M6 6.5a2 2 0 1 1 3.2-1.6l5.9 5.9a2 2 0 1 1 1.6 3.2 2 2 0 1 1-3.2 1.6l-5.9-5.9A2 2 0 1 1 6 6.5z'],
  ultrasound: ['M4 14a8 8 0 0 1 16 0', 'M8 14a4 4 0 0 1 8 0', 'M12 14v6', 'M9 20h6'],
  ct: ['M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z'],
  iv: ['M9 3h6v6a3 3 0 0 1-6 0V3z', 'M12 12v7', 'M10 21h4'],
  medication: ['M8.5 15.5l7-7a3.5 3.5 0 1 1 5 5l-7 7a3.5 3.5 0 0 1-5-5z', 'M10.5 10.5l3 3'],
  inhalation: ['M4 10.5c0-3 3-5.5 8-5.5s8 2.5 8 5.5-3 8.5-8 8.5-8-5.5-8-8.5z', 'M9 12.5h6'],
  stitches: ['M3 12h18', 'M7 8v8', 'M12 8v8', 'M17 8v8'],
  cast: ['M5 5h14v14H5z', 'M5 9.5h14', 'M5 14.5h14'],
  bandage: ['M4 15L15 4a3.5 3.5 0 0 1 5 5L9 20a3.5 3.5 0 0 1-5-5z', 'M9.5 9.5l5 5'],
}

export function hasLineIcon(id: string): boolean {
  return id in PATHS
}

/** The procedure's line icon, or its emoji when no line icon is drawn for it. */
export function ProcedureLineIcon({ id, emoji }: { id: string; emoji?: string }) {
  const paths = PATHS[id]
  if (!paths) return <>{emoji ?? '?'}</>
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}
