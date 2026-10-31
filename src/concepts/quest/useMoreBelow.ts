import { useCallback, useEffect, useRef } from 'react'

/**
 * Marks a scrolling element (a sheet) with data-more while some of its content is still below the visible part, so
 * the bottom block casts its shadow only then (not on a sheet whose content fits, nor at the end of the scroll).
 * Returns a ref callback to put on the element.
 */
export function useMoreBelow<T extends HTMLElement>() {
  const node = useRef<T | null>(null)
  const cleanup = useRef<() => void>(() => {})
  const ref = useCallback((el: T | null) => {
    cleanup.current()
    node.current = el
    if (!el) return
    const check = () => {
      const more = el.scrollTop + el.clientHeight < el.scrollHeight - 2
      if (more) el.setAttribute('data-more', '')
      else el.removeAttribute('data-more')
    }
    check()
    el.addEventListener('scroll', check, { passive: true })
    const ro = new ResizeObserver(check)
    ro.observe(el)
    for (const child of Array.from(el.children)) ro.observe(child)
    // pictures load after the first layout and make the content taller
    const imgs = Array.from(el.querySelectorAll('img'))
    imgs.forEach((im) => im.addEventListener('load', check))
    cleanup.current = () => {
      el.removeEventListener('scroll', check)
      ro.disconnect()
      imgs.forEach((im) => im.removeEventListener('load', check))
    }
  }, [])
  // (the listeners go when React calls the ref with null, as the element leaves)
  return ref
}

/** The same for the page itself (the shop scrolls the window): marks the <html> element */
export function useMoreBelowPage() {
  useEffect(() => {
    const root = document.documentElement
    const check = () => {
      const more = window.scrollY + window.innerHeight < root.scrollHeight - 2
      if (more) root.setAttribute('data-more', '')
      else root.removeAttribute('data-more')
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    const ro = new ResizeObserver(check)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
      ro.disconnect()
      root.removeAttribute('data-more')
    }
  }, [])
}
