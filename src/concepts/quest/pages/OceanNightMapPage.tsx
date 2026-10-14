import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, REQUIRED_STAGES } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { OceanMapView, OCEAN_IMAGES, starsFor, type Pt, type Scene, type Slot, type ViewItem } from './OceanMapPage'

/** Picture shapes (width / height) of the stand-in station images */
function aspectOf(src: string): number {
  if (src.includes('station-pod')) return 287 / 185
  if (src.includes('station-sonar')) return 218 / 132
  if (src.includes('station-sub')) return 227 / 169
  return 211 / 220 // house
}

/** Dots about every 7 units along a cubic Bezier */
function dotsAlong(p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt[] {
  const n = Math.max(6, Math.round(Math.hypot(p3[0] - p0[0], p3[1] - p0[1]) / 7))
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n
    const u = 1 - t
    const f = (k: number) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]
    return [f(0), f(1)] as Pt
  })
}

/** S-shaped trail from a to b with vertical tangents */
const vertical = (a: Pt, b: Pt) => dotsAlong(a, [a[0], (a[1] + b[1]) / 2], [b[0], (a[1] + b[1]) / 2], b)
/** S-shaped trail from a to b with horizontal tangents */
const horizontal = (a: Pt, b: Pt) => dotsAlong(a, [(a[0] + b[0]) / 2, a[1]], [(a[0] + b[0]) / 2, b[1]], b)

/** The screen's height in portrait-scene units (the scene is 412 wide and at most 560px wide) */
function useScreenUnits(): number {
  const get = () => (typeof window === 'undefined' ? 0 : Math.round((window.innerHeight * 412) / Math.min(window.innerWidth, 560)))
  const [h, setH] = useState(get)
  useEffect(() => {
    const on = () => setH(get())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return h
}

/**
 * Second stage, portrait: 0–4 stations in the sea, zigzagging down from the right, and the last one, a
 * house with a pier, on the right at the bottom, standing almost in the water (mirrored, so the pier
 * points into the sea). The old background (land at the bottom) is moved so the shore passes just under
 * the house: little sand, lots of sea. The map is at least as tall as the screen, so there is no empty
 * strip; any gap at the top is light water, like the picture's own top.
 */
/** Where the shore runs on the unshifted background (the sea is above this line) */
const shoreOrig = (x: number) => 653 + (412 - x) * 0.347

function portraitScene(images: string[], screenH: number): Scene {
  const n = images.length - 1
  const w = n <= 2 ? 250 : n === 3 ? 215 : 185
  const fw = 210
  const fh = fw / aspectOf(images[n])
  const hs = images.slice(0, n).map((img) => w / aspectOf(img))
  const hmax = Math.max(0, ...hs)
  // the stations are at least STEP apart vertically (more if the screen is taller)
  const STEP = 150
  const needed = 130 + hmax + Math.max(0, n - 1) * STEP + 80 + fh + 60
  const H = Math.max(820, screenH, Math.round(needed))
  // flush with the right edge: the picture's cut side (12% in, on the right once mirrored) is at the edge
  const fx = 412 - fw * 0.88
  const fy = H - fh - 60
  // room for the sea stations: from just under the title down to a bit above the house
  const top = 130
  const avail = fy - 80 - top

  const slots: Slot[] = []
  for (let k = 0; k < n; k++) {
    const h = hs[k]
    const y = n === 1 ? top + (avail - h) / 2 : top + k * ((avail - hmax) / (n - 1))
    // the last station is on the left, so the house on the right has the shore to itself
    const left = (n - 1 - k) % 2 === 0
    const x = n === 1 ? 20 : left ? -20 : 412 - w + 20
    slots.push({ x, y, w, h, badge: [x + w / 2, y - 6] })
  }
  slots.push({ x: fx, y: fy, w: fw, h: fh, badge: [fx + fw / 2, fy - 6], flip: true })

  // the house stands at the very edge of the land: at the right edge the shore meets the foot of the
  // house, while the pier to its left (where the shore runs lower) reaches over the water
  const shift = shoreOrig(412) - (fy + fh * 0.96)

  const dots: Pt[][] = []
  for (let k = 0; k < slots.length - 1; k++) {
    const a = slots[k]
    const b = slots[k + 1]
    if (k + 1 < n) {
      // sea to sea: the stations sit in two columns, so the trail hops across the gap to the next number
      const fromLeft = a.x + a.w / 2 < 206
      dots.push(horizontal(
        [fromLeft ? a.x + a.w * 0.9 : a.x + a.w * 0.1, a.y + a.h * 0.55],
        [b.x + b.w / 2 + (fromLeft ? -20 : 20), b.y - 6],
      ))
    } else {
      dots.push(vertical([a.x + a.w / 2, a.y + a.h * 0.92], [b.x + b.w / 2, b.y - 34]))
    }
  }
  return {
    W: 412,
    H,
    slots,
    dots,
    vars: {
      '--bg-x': 0, '--bg-y': -shift, '--bg-w': 412, '--bg-h': 939,
      '--title-x': 64.5, '--title-y': 44.5, '--title-w': 283, '--title-h': 50, '--title-fs': 21,
      '--badge': 24, '--badge-fs': 15, '--star': 30, '--title-bg': 'rgba(18, 56, 74, 0.35)',
      // The picture's top is light water: cover it with the deep teal of the first stage's map and let the
      // same teal fill any gap above the picture, so the top is never light blue
      '--grad-y': -shift, '--grad-h': 520,
      '--map-bg': '#207082',
    },
  }
}

/**
 * Second stage, landscape: the first stage's landscape background mirrored, so the little bit of sand
 * is in the bottom left corner. The sea stations zigzag from right to left, as the first stage does,
 * and the path ends at the house, which stands as a pier at the water's edge on the left.
 */
function landscapeScene(images: string[]): Scene {
  const n = images.length - 1
  // like the first stage: the stations alternate low / high, going right to left, about 350–400 apart
  const w = n <= 2 ? 500 : n === 3 ? 470 : 430
  const first = 1560 // centre of the first station
  const last = 600 // the last one stays clear of the house and its pier
  const step = n <= 1 ? 0 : Math.min(400, (first - last) / (n - 1))
  const slots: Slot[] = []
  for (let k = 0; k < n; k++) {
    const h = w / aspectOf(images[k])
    const cx = n === 1 ? 1100 : first - k * step
    const low = k % 2 === 0 // the first station is low, then they alternate
    const x = cx - w / 2
    const y = low ? 800 - h : 170
    slots.push({ x, y, w, h, badge: [cx, y - 6] })
  }
  const fw = 493
  const fh = fw / aspectOf(images[n])
  // the first stage's house, mirrored across the scene: house on the left, pier pointing into the sea
  slots.push({ x: -67, y: 521, w: fw, h: fh, badge: [-67 + fw / 2, 515] })

  const lines: Pt[][] = []
  for (let k = 0; k < n - 1; k++) {
    const a = slots[k]
    const b = slots[k + 1]
    const low = k % 2 === 0
    // from the top of a low station / the bottom of a high one, up or down to the next station's number
    const start: Pt = [a.x + a.w * 0.45, low ? a.y + a.h * 0.05 : a.y + a.h * 0.95]
    const end: Pt = [b.badge[0] + 24, b.badge[1] + 2]
    lines.push(dotsAlong(
      start,
      [start[0], start[1] + (end[1] - start[1]) * 0.8],
      [start[0] + (end[0] - start[0]) * 0.3, end[1]],
      end,
    ))
  }
  if (n > 0) {
    // to the end of the pier
    const a = slots[n - 1]
    const lower = (n - 1) % 2 === 0
    const start: Pt = lower ? [a.x + a.w * 0.05, a.y + a.h * 0.6] : [a.x + a.w / 2, a.y + a.h * 0.95]
    const end: Pt = [430, 870]
    lines.push(
      lower
        ? dotsAlong(start, [start[0] - 100, start[1]], [end[0] + 140, end[1]], end)
        : dotsAlong(start, [start[0], start[1] + 140], [end[0] + 200, end[1] + 40], end),
    )
  }
  return {
    W: 1920,
    H: 1080,
    slots,
    lines,
    vars: {
      // the first stage's landscape background, mirrored
      '--bg-x': 0, '--bg-y': -1682, '--bg-w': 1920, '--bg-h': 4376, '--bg-sx': -1,
      '--map-bg': '#1f6f80',
      '--title-x': 1270, '--title-y': 94, '--title-w': 550, '--title-h': 97, '--title-fs': 41,
      '--badge': 60, '--badge-fs': 36, '--star': 56,
    },
  }
}

/** Ocean world, second stage: the stations prescribed by the captain, then the surfacing on land. */
export function OceanNightMapPage({ underSheet }: { underSheet?: boolean } = {}) {
  const { theme } = useQuestTheme()
  const { t } = useI18n()
  const { visibleOptionals, allOptionalsDone, doneProcedures } = useQuestProgress()
  const screenH = useScreenUnits()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()

  const journey = t('journey.journeyStages', journeyStages)
  const firstOpen = visibleOptionals.findIndex((s) => s.status !== 'done')

  const items: ViewItem[] = visibleOptionals.map((s, i) => {
    const skin = theme.stages[s.id]
    const data = journey.find((j) => j.id === s.id)
    return {
      id: s.id,
      label: skin?.label ?? data?.title ?? s.id,
      status: s.status === 'done' ? 'done' : i === firstOpen ? 'active' : 'locked',
      image: OCEAN_IMAGES[s.id],
      stars: starsFor(data?.procedureIds, s.id, doneProcedures),
      onOpen: () => navigate(conceptPath(`/stage/${s.id}`)),
    }
  })
  const finale = theme.stages['decision']
  items.push({
    id: 'decision',
    label: finale?.label ?? t('ui.buttons.happyEnd', 'סוף טוב'),
    status: allOptionalsDone ? 'active' : 'locked',
    image: OCEAN_IMAGES.decision,
    // the ending can be opened only when everything before it is done
    onOpen: allOptionalsDone ? () => navigate(conceptPath('/celebrate')) : undefined,
  })

  // the stars earned on the first stage, shown at the top right
  const starsTotal = REQUIRED_STAGES.reduce(
    (sum, id) => sum + starsFor(journey.find((j) => j.id === id)?.procedureIds, id, doneProcedures),
    0,
  )

  const images = items.map((it) => it.image)
  const done = visibleOptionals.filter((s) => s.status === 'done').length

  return (
    <OceanMapView
      portrait={portraitScene(images, screenH)}
      landscape={landscapeScene(images)}
      items={items}
      underSheet={underSheet}
      progress={{ done, total: visibleOptionals.length }}
      numbers
      noTitle
      starsTotal={starsTotal}
      firstNumber={6} // the numbers go on from the first stage's five stations
    />
  )
}
