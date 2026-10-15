import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { journeyStages } from '../../../data/journey'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, REQUIRED_STAGES } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { dotsAlong } from './oceanTrails'
import { OceanMapView, OCEAN_IMAGES, starsFor, type Pt, type Scene, type Slot, type ViewItem } from './OceanMapPage'

/** Picture shapes (width / height) of the stand-in station images */
function aspectOf(src: string): number {
  if (src.includes('station-pod')) return 287 / 185
  if (src.includes('station-sonar')) return 218 / 132
  if (src.includes('station-sub-lit')) return 255 / 209
  if (src.includes('station-sub')) return 227 / 169
  return 211 / 220 // house
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
 * Second stage, landscape: the first stage's landscape mirrored (the background, and the places of the stations,
 * taken in the opposite order): the path leads from the top right, down to the bottom right, to the top centre
 * and the centre left, and ends at the house, which stands as a pier at the water's edge on the left.
 */
function landscapeScene(images: string[]): Scene {
  const n = images.length - 1
  // The first stage's landscape arrangement, mirrored left to right: its five places are taken in the opposite
  // order, because here the path leads TO the house. Places (visible width, centre x, top of the picture) and
  // where each station's number stands (relative to the place):
  //   A top right (the captain's place), B bottom right, C top centre, D centre left; the house bottom left.
  const places = [
    { cx: 1640, top: 190, vis: 430, badge: [1685, 465] as Pt },
    { cx: 1500, top: 590, vis: 470, badge: [1500, 549] as Pt },
    { cx: 1050, top: 190, vis: 440, badge: [1050, 518] as Pt },
    { cx: 664, top: 465, vis: 428, badge: [664, 852] as Pt },
  ]
  // how much of a picture's width / how far below its top the visible part is (the pictures have margins)
  const fit = (img: string) =>
    img.includes('station-sub-lit') ? { frac: 0.969, lift: 0.02 } : img.includes('station-sub') ? { frac: 0.815, lift: 0.056 } : img.includes('station-sonar') ? { frac: 0.963, lift: 0.03 } : { frac: 0.916, lift: 0.068 }
  const slots: Slot[] = []
  for (let k = 0; k < n; k++) {
    const pl = places[k]
    const f = fit(images[k])
    const w = pl.vis / f.frac
    const h = w / aspectOf(images[k])
    slots.push({ x: pl.cx - w / 2, y: pl.top - f.lift * h, w, h, badge: pl.badge })
  }
  const fw = 493
  const fh = fw / aspectOf(images[n])
  // the first stage's house, mirrored across the scene: house on the left, pier pointing into the sea
  slots.push({ x: -67, y: 521, w: fw, h: fh, badge: [-67 + fw / 2, 560] })

  // trails: every number is joined to the next one by a curve that goes around the stations (the numbers cut
  // them at their edges); the last number is joined to the end of the pier
  const curves: ((from: Pt, to: Pt) => Pt[])[] = [
    (a, b) => dotsAlong(a, [1690, 540], [1620, 580], b), // 6 to 7: down from under the top right station
    (a, b) => dotsAlong(a, [1380, 520], [1200, 560], b), // 7 to 8: left, between the stations
    (a, b) => dotsAlong(a, [1020, 760], [840, 920], b), // 8 to 9: down the right side of the left station
  ]
  const lines: Pt[][] = []
  for (let k = 0; k < n - 1; k++) lines.push(curves[k](slots[k].badge, slots[k + 1].badge))
  if (n > 0) {
    // to the end of the pier
    const lb = slots[n - 1].badge
    const end: Pt = [430, 870]
    lines.push(dotsAlong(lb, [lb[0] - 70, lb[1] + 30], [end[0] + 90, end[1] + 10], end))
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
      '--badge': 42, '--badge-fs': 26, '--star': 56,
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
  // nothing was ordered (the choice was skipped or reset by going back to it): there is nothing left to finish
  const endingOpen = allOptionalsDone || visibleOptionals.length === 0
  items.push({
    id: 'decision',
    label: finale?.label ?? t('ui.buttons.happyEnd', 'סוף טוב'),
    status: endingOpen ? 'active' : 'locked',
    image: OCEAN_IMAGES.decision,
    // locked, it still opens (like the other stations) as a sheet with only the way back
    onOpen: () => navigate(conceptPath(endingOpen ? '/celebrate' : '/stage/decision')),
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
