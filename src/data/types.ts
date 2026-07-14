export type Icon = string // emoji glyph, used as a calm, wordless cue

/** A reason-for-visit path. Tailors the "road ahead" shown to the family. */
export interface VisitPath {
  id: string
  label: string // e.g. "חום גבוה"
  emoji: Icon
  blurb: string // one calm sentence describing the typical route
  /** Ordered stops for this reason, referencing procedure ids where relevant. */
  route: RouteStop[]
}

export interface RouteStop {
  title: string
  /** procedure id from procedures.ts, if this stop maps to a known procedure */
  procedureId?: string
  optional?: boolean // "לפי הצורך"
}

/** A generic stage of any ER visit (module 3 in the spec). */
export interface JourneyStage {
  id: string
  title: string
  emoji: Icon
  /** status + meaning: not just "you are here" but what it means */
  meaning: string
  whatHappens: string
  /** what might be hard for the child at this stage */
  challenge: string
  /** legitimate things a parent can ask for here */
  canAsk: string[]
  /** invented, range-based estimate shown as guidance only */
  waitRange?: string
  /** whether waitRange is time spent waiting for this stage, or the stage's own duration. Defaults to 'wait'. */
  waitKind?: 'wait' | 'duration'
  /**
   * Procedures from procedures.ts that typically happen at this stage —
   * lets the parent open the child-facing preparation right when it is
   * relevant ("what's about to happen" + "how to explain it to the child").
   */
  procedureIds?: string[]
}

/** Visual preparation for a common procedure (module 4). */
export interface Procedure {
  id: string
  title: string
  emoji: Icon
  duration: string // e.g. "1–2 דקות"
  who: string // who performs it
  what: string // short explanation
  feel: string // what the child may feel/experience
  prepare: string // how the parent can prepare
  adaptations: string[] // adaptations that can be requested
  /** simple first-person steps the mascot narrates to the child */
  story: string[]
}

/** An area on the simple orientation map (module 2). */
export interface MapArea {
  id: string
  name: string
  emoji: Icon
  /** sensory/load hint — the "load map" layer the spec asks for */
  load: 'calm' | 'medium' | 'busy'
  note: string // what happens here / what to expect
  /** where one usually continues from here ("לאן עוברים אחרי כל שלב") */
  next?: string
}

/** Short parent guidance for moments of distress (module 5). */
export interface DistressTip {
  emoji: Icon
  title: string
  body: string
}

/** A legitimate request a parent can make of the staff (module: "what to ask"). */
export interface StaffRequest {
  emoji: Icon
  title: string
  detail: string
}
