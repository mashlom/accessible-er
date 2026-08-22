import { useCallback, useState } from 'react'

/**
 * The child's chosen companion avatar. Deliberately kept in
 * sessionStorage (not localStorage): it lives only for the current
 * session and is wiped when the tab/browser closes. A photo never
 * leaves the device — nothing is uploaded or persisted to a server.
 */
/**
 * The avatar represents the CHILD ("me") — the figure that travels the
 * journey. (Roni is a separate guide, not this.) It is an emoji figure by
 * default, or the child's own photo.
 */
export type Avatar =
  | { kind: 'emoji'; value: string }
  | { kind: 'photo'; value: string } // a downscaled data: URL

const KEY = 'avatar'
const DEFAULT: Avatar = { kind: 'emoji', value: '🙂' }

/** Neutral "me" default first, then friendly figures to choose from. */
export const avatarEmojis = ['🙂', '🧒', '🦁', '🐰', '🦊', '🚀']

function read(): Avatar {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return DEFAULT
    const parsed = JSON.parse(raw) as Avatar
    if (parsed?.kind === 'emoji' || parsed?.kind === 'photo') return parsed
    return DEFAULT
  } catch {
    return DEFAULT
  }
}

export function useSessionAvatar(): [Avatar, (a: Avatar) => void, () => void] {
  const [avatar, setAvatar] = useState<Avatar>(read)

  const set = useCallback((a: Avatar) => {
    setAvatar(a)
    try {
      sessionStorage.setItem(KEY, JSON.stringify(a))
    } catch {
      /* storage unavailable — keep it in memory for this view */
    }
  }, [])

  const reset = useCallback(() => {
    setAvatar(DEFAULT)
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
  }, [])

  return [avatar, set, reset]
}

/**
 * Read an image File, crop it to a centred square and downscale it, so
 * the stored data: URL stays small (well within sessionStorage limits)
 * and never touches the network.
 */
export function fileToAvatarDataUrl(file: File, size = 240): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error ?? new Error('read failed'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('image load failed'))
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('canvas unavailable'))
        const s = Math.min(img.width, img.height)
        const sx = (img.width - s) / 2
        const sy = (img.height - s) / 2
        ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}
