import { createContext, useContext, useLayoutEffect, type ReactNode } from 'react'
import {
  Link as RouterLink,
  Navigate as RouterNavigate,
  useLocation,
  useNavigate,
  useNavigationType,
  type LinkProps,
  type NavigateProps,
} from 'react-router-dom'
import { previousPath, recordLocation, stepsBackTo } from '../lib/historyTrail'

/**
 * Concept-scoped navigation.
 *
 * Every UI concept is mounted under its own base path (`/calm`, `/story`, …)
 * so several concepts can live side by side behind the concept menu at `/`.
 * Concept pages keep writing app-absolute links (`to="/journey"`); the
 * wrappers here prefix them with the active concept's base, so concept code
 * stays portable and a concept can be re-mounted anywhere.
 */
const ConceptBaseContext = createContext('')

export function ConceptBase({ base, children }: { base: string; children: ReactNode }) {
  return <ConceptBaseContext.Provider value={base}>{children}</ConceptBaseContext.Provider>
}

export function useConceptBase(): string {
  return useContext(ConceptBaseContext)
}

/** The card is one page at the app's own address, reached from every concept: its links are never prefixed. */
const APP_PAGES = ['/card']

// the calm page is one page, at the story address, reached from every concept
const CANONICAL: Record<string, string> = { '/calm': '/story/calm' }

function resolve(base: string, to: string): string {
  if (CANONICAL[to]) return CANONICAL[to]
  if (!base || !to.startsWith('/')) return to
  if (APP_PAGES.some((p) => to === p || to.startsWith(p + '/'))) return to
  return to === '/' ? base : base + to
}

/** `path('/journey')` → `/calm/journey`. For links built outside JSX. */
export function useConceptPath(): (to: string) => string {
  const base = useConceptBase()
  return (to: string) => resolve(base, to)
}

export function Link({ to, ...rest }: LinkProps) {
  const base = useConceptBase()
  return <RouterLink to={typeof to === 'string' ? resolve(base, to) : to} {...rest} />
}

export function Navigate({ to, ...rest }: NavigateProps) {
  const base = useConceptBase()
  return <RouterNavigate to={typeof to === 'string' ? resolve(base, to) : to} {...rest} />
}

/** True when the current URL is the concept's own home screen. */
export function useIsConceptHome(): boolean {
  const base = useConceptBase()
  const { pathname } = useLocation()
  return pathname === base || pathname === `${base}/`
}

/** Keeps the history trail (src/lib/historyTrail.ts) up to date. Mounted once, in App. */
export function useHistoryTrail() {
  const { pathname, key } = useLocation()
  const type = useNavigationType()
  useLayoutEffect(() => {
    recordLocation(pathname, type)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}

/** One place, two addresses: a world's own address /quest/<world> is its map /quest/<world>/map */
function samePlace(a: string, b: string): boolean {
  const norm = (p: string) => p.split('?')[0].replace(/^(\/quest\/[^/]+)\/map$/, '$1').replace(/(.)\/$/, '$1')
  return norm(a) === norm(b)
}

/**
 * Leave this screen for `to` the way "back" should: when `to` is an earlier entry in the history, go back
 * to it (so the browser's back button won't reopen this screen or the ones between); otherwise replace this
 * entry with `to` (a sheet that was opened from a link or by reloading closes onto the map, and the
 * browser's back button then leaves the map as it would have).
 * `to` is written like a Link inside the concept (`/map`); `absolute` takes an app address as it is.
 */
export function useGoBackTo(): (to: string, opts?: { state?: unknown; absolute?: boolean }) => void {
  const navigate = useNavigate()
  const base = useConceptBase()
  return (to, opts) => {
    const target = opts?.absolute ? to : resolve(base, to)
    const steps = stepsBackTo((p) => samePlace(p, target))
    if (steps > 0) navigate(-steps)
    else navigate(target, { replace: true, state: opts?.state })
  }
}

/** The browser's back, or `fallback` (written like a Link) when this is the first page of the visit */
export function useBack(): (fallback: string) => void {
  const navigate = useNavigate()
  const base = useConceptBase()
  return (fallback) => {
    if (previousPath()) navigate(-1)
    else navigate(resolve(base, fallback), { replace: true })
  }
}
