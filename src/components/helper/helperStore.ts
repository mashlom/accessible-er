import { useSyncExternalStore } from 'react'

/**
 * Whether the helper (Roni's conversation) is open as a popup over the
 * current screen. A tiny store, so that any button in the app can open it.
 */
let isOpen = false
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function set(next: boolean) {
  if (isOpen === next) return
  isOpen = next
  listeners.forEach((l) => l())
}

export const openHelper = () => set(true)
export const closeHelper = () => set(false)

export function useHelperOpen(): boolean {
  return useSyncExternalStore(subscribe, () => isOpen)
}
