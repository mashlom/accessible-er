/**
 * Locks the page's scroll while a sheet is open. Sheets can be nested (the parent sheet opens over the
 * station sheet) and can unmount in any order, so the lock is counted: the page unlocks only when the
 * last sheet is gone, and always goes back to what it was before the first one opened.
 */
let count = 0
let original = ''

export function lockBodyScroll(): () => void {
  if (count === 0) original = document.body.style.overflow
  count++
  document.body.style.overflow = 'hidden'
  let released = false
  return () => {
    if (released) return
    released = true
    count--
    if (count === 0) document.body.style.overflow = original
  }
}
