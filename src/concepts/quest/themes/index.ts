/**
 * The worlds of the quest. Each world is a folder src/data/child/worlds/<world>/ with two files:
 *   world.json  — the look: colours, pictures, and (for a designed world) the map scenes and the sheets
 *   texts.json  — the words, in every language (read by useQuestTheme)
 * A new world is a new folder; no code changes. See src/data/child/worlds/README.md.
 */

export interface StageTheme {
  /** text fields are optional: a world may keep them in its child texts file instead */
  label?: string
  icon: string
  /** Short flavour description shown on the map pin */
  hint?: string
  /** Optional image shown on the map strip (path relative to /public) */
  image?: string
  /** If set, shown as hero on the stage detail page instead of image */
  heroImage?: string
}

export type Pt = [number, number]
/** Coordinates are in the scene's units: picture box (x, y, w, h) and the number badge's center */
export type Slot = { x: number; y: number; w: number; h: number; badge: Pt; flip?: boolean }
/** A trail: its points, or a cubic Bezier (four points) that is turned into points */
export type Trail = Pt[] | { bezier: [Pt, Pt, Pt, Pt] }

/** A map scene drawn in the units of its design frame (a portrait frame such as 412×939, a landscape one such as 1920×1080) */
export interface Scene {
  W: number
  H: number
  slots: Slot[]
  /** Dotted trails, one per station (trail i leaves station i) */
  dots?: Trail[]
  /** Dashed trails */
  lines?: Trail[]
  /** CSS variables in frame units: background box (--bg-x/y/w/h, --bg-rot, --bg-sx), title pill (--title-*),
   *  badge and star sizes (--badge, --badge-fs, --star), the top gradient (--grad-y/h), --map-bg, --title-bg */
  vars: Record<string, string | number>
}

/** How a station's picture stands on its sheet */
export type SheetPanel =
  /** on the sea-floor panel, with bubbles behind it */
  | 'bubbles'
  /** cut straight at one edge and pushed off the sheet's edge (mirrored on the landscape map) */
  | 'bleed'
  /** on the panel, no bubbles */
  | 'plain'
  /** a small golden symbol in the middle of the panel */
  | 'symbol'

export interface StationDesign {
  /** The picture on the map */
  map: string
  /** The picture on the station's sheet and on the choice sheet (falls back to map) */
  sheet?: string
  panel?: SheetPanel
}

export interface WorldDesign {
  assets: {
    /** The map's background picture (the scenes place it with --bg-*) */
    background: string
    /** The sheet's picture panel: a veil over a floor picture */
    sheetFade?: string
    sheetSeabed?: string
  }
  /** Design tokens. text/text2/action/page/card/mint/blue/coral/yellow for the sheets and the world's screens;
   *  water (behind the landscape map), waterTop (the gradient at the top of the map), waterLight (behind the
   *  portrait map); progress: the colours of the progress sticks, alternating */
  colors: Record<string, string> & { progress?: string[] }
  /** The pictures of each station (every required and optional stage, and 'decision' for the ending) */
  stations: Record<string, StationDesign>
  /** Shape of the station pictures used on the second map: width/height, and how much of the width is the
   *  visible object and how far below the top it starts (the pictures have margins) */
  images: Record<string, { aspect: number; visible?: number; lift?: number }>
  /** Bubbles behind a picture on its sheet: centre (x, y) and diameter in % of the panel */
  bubbles?: { x: number; y: number; d: number }[]
  /** The first map: the required stations, as drawn in the designer's frames */
  dayMap: { portrait: Scene; landscape: Scene }
  /** The second map: built from the stations the doctor ordered */
  nightMap: {
    portrait: {
      /** Where the shore meets the right edge on the background picture (the ending stands on it) */
      shoreY: number
      /** Width of the ending's picture */
      finaleWidth: number
      vars: Scene['vars']
    }
    landscape: {
      /** The places of the ordered stations, in order: visible width, centre x, top, and the number's place */
      places: { cx: number; top: number; visible: number; badge: Pt }[]
      /** Control points of the trails between consecutive places */
      curves: [Pt, Pt][]
      /** The ending's picture box (its height follows from the picture's shape) */
      finale: Omit<Slot, 'h'>
      /** The trail from the last station to the ending: its end, and the control points relative to start / end */
      finaleTrail: { end: Pt; c1: Pt; c2: Pt }
      vars: Scene['vars']
    }
  }
}

export interface QuestTheme {
  id: string
  /** Place on the world select screen */
  order?: number
  /** the world's name: from src/data/child/worlds/<world>/texts.json (this is only a fallback) */
  name?: string
  emoji: string
  /** Background image path for portrait orientation */
  bg: string
  /** Background image path for landscape orientation (falls back to bg) */
  bgLandscape?: string
  /** Background for the night/procedures map (falls back to bg) */
  nightBg?: string
  /** Thumbnail shown on world select card (falls back to bg) */
  thumbnail?: string
  /** If set, thumbnail is used as a cropped backdrop and this image is layered on top */
  thumbnailOverlay?: string
  /** Emoji shown on completed stages/procedures (default '✓') */
  doneEmoji?: string
  /** Image shown on the celebration/shop screen */
  shopImage?: string
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
  /** A designed world (the ocean's layout: drawn maps and sheets). Without it the world uses the simple screens. */
  design?: WorldDesign
  /** Short flavour text shown on procedure detail pages in this world */
  procedureNarratives?: Record<string, string>
  /** World-flavoured step-by-step story overriding the neutral steps from procedures.ts */
  procedureSteps?: Record<string, string[]>
  procedureVariants?: Record<string, { label: string; steps: string[] }[]>
  /** Lines shown in the child zone of CalmPage — themed calming message for the child */
  calmLines?: string[]
  /** Title shown in the hero zone of DistractPage — themed framing for the child */
  distractTitle?: string
  /** The world's own wording for the designed screens' buttons and titles (from its texts.json) */
  ui?: { done?: string; decision?: string; decisionTitle?: string; headline?: string }
}

const files = import.meta.glob<QuestTheme>('../../../data/child/worlds/*/world.json', { eager: true, import: 'default' })

export const themes: QuestTheme[] = Object.values(files).sort(
  (a, b) => (a.order ?? 99) - (b.order ?? 99) || a.id.localeCompare(b.id),
)

export function getTheme(id: string): QuestTheme {
  return themes.find((t) => t.id === id) ?? themes[0]
}

/** The design's pictures and colours as CSS variables (--w-*), read by the designed screens' styles in quest.module.css */
export function designVars(design: WorldDesign | undefined): React.CSSProperties {
  if (!design) return {}
  const vars: Record<string, string> = {}
  const url = (src?: string) => (src ? `url('${src}')` : 'none')
  vars['--w-background'] = url(design.assets.background)
  vars['--w-sheet-fade'] = url(design.assets.sheetFade)
  vars['--w-sheet-floor'] = url(design.assets.sheetSeabed)
  for (const [k, v] of Object.entries(design.colors)) {
    if (typeof v === 'string') vars[`--w-${k}`] = v
  }
  design.colors.progress?.forEach((c, i) => (vars[`--w-progress-${i + 1}`] = c))
  return vars as React.CSSProperties
}
