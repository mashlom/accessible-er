import { createContext, useContext, type ReactNode } from 'react'
import {
  Link as RouterLink,
  Navigate as RouterNavigate,
  useLocation,
  type LinkProps,
  type NavigateProps,
} from 'react-router-dom'

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

function resolve(base: string, to: string): string {
  if (!base || !to.startsWith('/')) return to
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
