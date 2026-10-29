import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConceptPath } from '../../nav'
import { parentJourney } from '../../../data/parent'
import { useQuestTheme } from '../useQuestTheme'
import { useQuestProgress, REQUIRED_STAGES } from '../useQuestProgress'
import { useI18n } from '../../../hooks/useI18n'
import { dotsAlong } from './trails'
import { WorldMapView, stationPicture, starsFor, type ViewItem } from './WorldMapPage'
import type { Pt, Scene, Slot, WorldDesign } from '../themes'

/** A picture's shape on the second map (width / height, and its visible part): from the world's images list */
function shapeOf(design: WorldDesign, src: string) {
  const im = design.images[src]
  return { aspect: im?.aspect ?? 1, visible: im?.visible ?? 1, lift: im?.lift ?? 0 }
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
function portraitScene(design: WorldDesign, images: string[], screenH: number): Scene {
  const spec = design.nightMap.portrait
  const aspectOf = (src: string) => shapeOf(design, src).aspect
  const n = images.length - 1
  const w = n <= 2 ? 250 : n === 3 ? 215 : 185
  const fw = spec.finaleWidth
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
  slots.push({ x: fx, y: fy, w: fw, h: fh, badge: [fx + fw / 2, fy - 6], flip: spec.finaleFlip !== false })

  // the house stands at the very edge of the land: at the right edge the shore meets the foot of the
  // house, while the pier to its left (where the shore runs lower) reaches over the water
  const shift = spec.shoreY - (fy + fh * 0.96)

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
      ...spec.vars,
      // the background is moved so the shore passes under the ending, and the gradient at its top goes with it
      '--bg-y': -shift,
      '--grad-y': -shift,
    },
  }
}

/**
 * Second stage, landscape: the first stage's landscape mirrored (the background, and the places of the stations,
 * taken in the opposite order): the path leads from the top right, down to the bottom right, to the top centre
 * and the centre left, and ends at the house, which stands as a pier at the water's edge on the left.
 */
function landscapeScene(design: WorldDesign, images: string[]): Scene {
  const spec = design.nightMap.landscape
  const n = images.length - 1
  // The first stage's landscape arrangement, mirrored left to right: its five places are taken in the opposite
  // order, because here the path leads TO the house. Places (visible width, centre x, top of the picture) and
  // where each station's number stands (relative to the place):
  //   A top right (the captain's place), B bottom right, C top centre, D centre left; the house bottom left.
  const places = spec.places
  const slots: Slot[] = []
  for (let k = 0; k < n; k++) {
    const pl = places[k]
    const f = shapeOf(design, images[k])
    const w = pl.visible / f.visible
    const h = w / f.aspect
    slots.push({ x: pl.cx - w / 2, y: pl.top - f.lift * h, w, h, badge: pl.badge })
  }
  // the ending: in landscape the first stage's start, mirrored across the scene
  slots.push({ ...spec.finale, h: spec.finale.w / shapeOf(design, images[n]).aspect })

  // trails: every number is joined to the next one by a curve that goes around the stations (the numbers cut
  // them at their edges); the last number is joined to the end of the ending's picture
  const curves = spec.curves.map(([c1, c2]) => (a: Pt, b: Pt) => dotsAlong(a, c1, c2, b))
  const lines: Pt[][] = []
  for (let k = 0; k < n - 1; k++) lines.push(curves[k](slots[k].badge, slots[k + 1].badge))
  if (n > 0) {
    // to the end of the pier
    const lb = slots[n - 1].badge
    const { end, c1, c2 } = spec.finaleTrail
    lines.push(dotsAlong(lb, [lb[0] + c1[0], lb[1] + c1[1]], [end[0] + c2[0], end[1] + c2[1]], end))
  }
  return {
    W: 1920,
    H: 1080,
    slots,
    lines,
    vars: spec.vars,
  }
}

/** A designed world's second stage: the stations prescribed by the captain, then the surfacing on land. */
export function WorldNightMapPage({ underSheet }: { underSheet?: boolean } = {}) {
  const { theme } = useQuestTheme()
  const design = theme.design!
  const { t, lang } = useI18n()
  const { visibleOptionals, allOptionalsDone, doneProcedures } = useQuestProgress()
  const screenH = useScreenUnits()
  const navigate = useNavigate()
  const conceptPath = useConceptPath()

  const journey = parentJourney(lang)
  const firstOpen = visibleOptionals.findIndex((s) => s.status !== 'done')

  const items: ViewItem[] = visibleOptionals.map((s, i) => {
    const skin = theme.stages[s.id]
    const data = journey.find((j) => j.id === s.id)
    return {
      id: s.id,
      label: skin?.label ?? data?.title ?? s.id,
      status: s.status === 'done' ? 'done' : i === firstOpen ? 'active' : 'locked',
      image: stationPicture(design, s.id),
      stars: starsFor(data?.procedureIds, s.id, doneProcedures),
      onOpen: () => navigate(conceptPath(`/stage/${s.id}`)),
    }
  })
  const finale = theme.stages['decision']
  // nothing was ordered (the choice was skipped or reset by going back to it): there is nothing left to finish
  const endingOpen = allOptionalsDone || visibleOptionals.length === 0
  items.push({
    id: 'decision',
    label: finale?.label ?? t('ui.buttons.happyEnd'),
    status: endingOpen ? 'active' : 'locked',
    image: stationPicture(design, 'decision'),
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
    <WorldMapView
      portrait={portraitScene(design, images, screenH)}
      landscape={landscapeScene(design, images)}
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
