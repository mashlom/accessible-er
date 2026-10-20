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

export interface QuestTheme {
  id: string
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
  /** Short flavour text shown on procedure detail pages in this world */
  procedureNarratives?: Record<string, string>
  /** World-flavoured step-by-step story overriding the neutral steps from procedures.ts */
  procedureSteps?: Record<string, string[]>
  procedureVariants?: Record<string, { label: string; steps: string[] }[]>
  /** Lines shown in the child zone of CalmPage — themed calming message for the child */
  calmLines?: string[]
  /** Title and subtitle shown in the hero zone of CardPage — themed framing for the child */
  cardChildHero?: { title: string; subtitle: string }
  /** Title shown in the hero zone of DistractPage — themed framing for the child */
  distractTitle?: string
}

export const themes: QuestTheme[] = [
  {
    id: 'knight',
    emoji: '⚔️',
    doneEmoji: '🪙',
    shopImage: '/worlds/knight/shop.JPEG',
    bg: '/worlds/knight/castle_v.jpg',
    bgLandscape: '/worlds/knight/castle_h.jpeg',
    nightBg: '/worlds/knight/night_castle.JPEG',
    thumbnail: '/worlds/knight/castle.png',
    thumbnailOverlay: '/worlds/knight/knight.png',
    procedurePrompt: 'בקשו מהגברת היפה (האחות) לבחור את הפרוצדורות שהקוסם הגדול קבע',
    accent: '#7b4f28',
    accentSoft: '#f5e6d0',
    accentText: '#ffffff',
    completedColor: '#c9a84c',
    stages: {
      reception: {icon: '🏰',image: '/worlds/knight/tower.jpg' },
      'wait-before-triage': {icon: '🛡️',},
      triage: {icon: '⚔️',image: '/worlds/knight/tests.jpeg' },
      'wait-doctor': {icon: '🚪',image: '/worlds/knight/door.JPEG' },
      doctor: {icon: '🧙',image: '/worlds/knight/wizard.JPEG' },
      decision: {icon: '🏆',image: '/worlds/knight/celebrating.jpg' },
      // secret rooms
      tests: {icon: '🪄',image: '/worlds/knight/rentgen.jpeg' },
      treatment: {icon: '🔧',image: '/worlds/knight/procedures.jpeg' },
      consult: {icon: '📜',image: '/worlds/knight/wizard2.JPEG' },
      'wait-results': {icon: '🔮',image: '/worlds/knight/wait.JPEG' },
    },
  },
  {
    id: 'dino',
    emoji: '🦕',
    doneEmoji: '⭐',
    shopImage: '/worlds/knight/shop.JPEG',
    bg: '',
    thumbnail: '/worlds/dino/dino.jpeg',
    accent: '#4a7c3f',
    accentSoft: '#dcefd8',
    accentText: '#ffffff',
    completedColor: '#8bc34a',
    stages: {
      reception: {icon: '🌿',},
      'wait-before-triage': {icon: '🦕',},
      triage: {icon: '🔭',},
      'wait-doctor': {icon: '🏕️',},
      doctor: {icon: '🦖',},
      decision: {icon: '🌋',},
      tests: {icon: '🧪',},
      treatment: {icon: '🩹',},
      consult: {icon: '🗺️',},
      'wait-results': {icon: '⏳',},
    },
  },
  {
    id: 'fairy',
    doneEmoji: '⭐',
    shopImage: '/worlds/knight/shop.JPEG',
    emoji: '🧚',
    bg: '/worlds/fairy/6bf9b600-f83d-4d9e-90ce-4233e11f4b30.JPEG',
    accent: '#9c5ab5',
    accentSoft: '#f0e0f7',
    accentText: '#ffffff',
    completedColor: '#d4a8e8',
    stages: {
      reception: {icon: '🌸',},
      'wait-before-triage': {icon: '🦋',},
      triage: {icon: '✨',},
      'wait-doctor': {icon: '🌺',},
      doctor: {icon: '🧚',},
      decision: {icon: '🌟',},
      tests: {icon: '🔮',},
      treatment: {icon: '🪄',},
      consult: {icon: '🌈',},
      'wait-results': {icon: '💫',},
    },
  },
  {
    id: 'space',
    emoji: '🚀',
    doneEmoji: '⭐',
    shopImage: '/worlds/knight/shop.JPEG',
    bg: '/worlds/space/space.jpg',
    accent: '#1a3a6b',
    accentSoft: '#d0dcf5',
    accentText: '#ffffff',
    completedColor: '#5c8de8',
    stages: {
      reception: {icon: '🛸',},
      'wait-before-triage': {icon: '🧑‍🚀',},
      triage: {icon: '📡',},
      'wait-doctor': {icon: '🌍',},
      doctor: {icon: '👨‍🚀',},
      decision: {icon: '🌙',},
      tests: {icon: '🔭',},
      treatment: {icon: '🔧',},
      consult: {icon: '📻',},
      'wait-results': {icon: '💻',},
    },
  },
  {
    id: 'safari',
    doneEmoji: '⭐',
    shopImage: '/worlds/knight/shop.JPEG',
    emoji: '🦁',
    bg: '/worlds/safari/safari.JPEG',
    accent: '#b5720a',
    accentSoft: '#fcefd0',
    accentText: '#ffffff',
    completedColor: '#e8a825',
    stages: {
      reception: {icon: '⛺',},
      'wait-before-triage': {icon: '🌳',},
      triage: {icon: '🎒',},
      'wait-doctor': {icon: '🦁',},
      doctor: {icon: '🐘',},
      decision: {icon: '🌅',},
      tests: {icon: '🔬',},
      treatment: {icon: '🩹',},
      consult: {icon: '🦒',},
      'wait-results': {icon: '🕐',},
    },
  },
  {
    id: 'ocean',
    doneEmoji: '⭐',
    // the picture of the celebration and shop screens: the sea floor of the sheets
    shopImage: '/worlds/ocean/sheet-seabed.jpg',
    emoji: '🐠',
    bg: '/worlds/ocean/underwater.png',
    thumbnailOverlay: '/worlds/ocean/station-sub.png',
    // Shevi's colour tokens: primary action #087E8B, information areas #E5F2F7
    accent: '#087e8b',
    accentSoft: '#e5f2f7',
    accentText: '#ffffff',
    completedColor: '#25b8e8',
    stages: {
      reception: { icon: '⚓', image: '/worlds/ocean/station-house.png' },
      'wait-before-triage': { icon: '/worlds/ocean/station-sub.png' },
      triage: { icon: '🤿', heroImage: '/worlds/ocean/station-pod.png' },
      'wait-doctor': { icon: '🐟' },
      doctor: { icon: '🐙' },
      decision: { icon: '🌊' },
      tests: { icon: '📡' },
      treatment: { icon: '🔧' },
      consult: { icon: '📻' },
      'wait-results': { icon: '💾' },
    },
  },
  {
    id: 'dollhouse',
    emoji: '🏠',
    bg: '',
    thumbnail: '/worlds/dollhouse/dollhouse.png',
    accent: '#c2618f',
    accentSoft: '#fbe6ef',
    accentText: '#ffffff',
    completedColor: '#e0a8c4',
    stages: {
      reception: {icon: '📋',},
      'wait-before-triage': {icon: '🛋️',},
      triage: {icon: '🧸',},
      'wait-doctor': {icon: '🪑',},
      doctor: {icon: '🩺',},
      decision: {icon: '🏡',},
      tests: {icon: '🔬',},
      treatment: {icon: '💊',},
      consult: {icon: '🧑‍⚕️',},
      'wait-results': {icon: '🕰️',},
    },
  },
]

export function getTheme(id: string): QuestTheme {
  return themes.find((t) => t.id === id) ?? themes[0]
}
