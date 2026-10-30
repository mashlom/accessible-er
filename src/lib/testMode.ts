/**
 * The team's test mode: ?test=true in the address (before the # or after the
 * screen's path). It shows what is not for families yet: the technical
 * 'text_name' language, the shop after the journey, and the books on the home.
 */
export function isTestMode(): boolean {
  const hashQuery = window.location.hash.split('?')[1] ?? ''
  return [window.location.search, hashQuery].some((q) => new URLSearchParams(q).get('test') === 'true')
}
