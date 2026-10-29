/**
 * The addresses of the browser history entries this tab has visited, by their place in the history
 * (react-router keeps that place in history.state.idx). With it, a "back to the map" button can tell
 * whether the map is the entry just before this one: then it really goes back (the browser's back
 * button and the app's button agree), instead of adding the map again on top of the history.
 * Kept in sessionStorage, so a reload in the middle of the visit still knows the way back.
 */
const KEY = 'history-trail'

let trail: string[] = (() => {
  try {
    const v = JSON.parse(sessionStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
})()

/** This entry's place in the history (0 on the first page of the tab) */
export function historyIndex(): number {
  const idx = (window.history.state as { idx?: number } | null)?.idx
  return typeof idx === 'number' ? idx : 0
}

export function recordLocation(path: string, type: 'PUSH' | 'REPLACE' | 'POP') {
  const idx = historyIndex()
  // a new entry drops the ones that were ahead of it (they can no longer be reached with "forward")
  if (type === 'PUSH') trail = trail.slice(0, idx)
  trail[idx] = path
  try { sessionStorage.setItem(KEY, JSON.stringify(trail)) } catch {}
}

/** The address of the entry before this one, if this tab visited it */
export function previousPath(): string | undefined {
  const idx = historyIndex()
  return idx > 0 ? trail[idx - 1] : undefined
}

/** How many entries back the nearest earlier entry that matches is (0: none) */
export function stepsBackTo(match: (path: string) => boolean): number {
  const idx = historyIndex()
  for (let i = idx - 1; i >= 0; i--) if (trail[i] && match(trail[i])) return idx - i
  return 0
}
