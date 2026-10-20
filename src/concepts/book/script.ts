export interface BookPage {
  id: string
  emoji: string
  /** If true, this page renders the parent procedure-select UI */
  isParentSelect?: boolean
}

export const basePages: BookPage[] = [
  {
    id: 'arrival',
    emoji: '🚗',
  },
  {
    id: 'wait-before-triage',
    emoji: '⏳',
  },
  {
    id: 'triage',
    emoji: '🌡️',
  },
  {
    id: 'wait-doctor',
    emoji: '🪑',
  },
  {
    id: 'doctor',
    emoji: '👩‍⚕️',
  },
]

export const parentSelectPage: BookPage = {
  id: 'parent-select',
  emoji: '📋',
  isParentSelect: true,
}

export const procedureOptions: BookPage[] = [
  {
    id: 'tests',
    emoji: '🔬',
  },
  {
    id: 'treatment',
    emoji: '💊',
  },
  {
    id: 'consult',
    emoji: '🧑‍⚕️',
  },
  {
    id: 'wait-results',
    emoji: '🕰️',
  },
]

/** Where the family goes after the decision: the parent and the child choose it together (issue #10). */
export const dispositionPage: BookPage = {
  id: 'disposition',
  emoji: '🛏️',
}

export const homePage: BookPage = {
  id: 'home',
  emoji: '🏠',
}

export const hospitalPage: BookPage = {
  id: 'hospital',
  emoji: '🏥',
}

export const endPages: BookPage[] = [
  {
    id: 'decision',
    emoji: '💬',
  },
  {
    id: 'end',
    emoji: '⭐',
  },
]
