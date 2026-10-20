import { useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'

/**
 * The technical 'text_name' language: every text on the screen is replaced by
 * the key it comes from. One key → its name; the same text under several keys
 * (a duplicate) → all of them, each after a '!'; a text that is in no
 * translation file → no_key. Texts are matched against src/data in the
 * language underneath, so the page keeps working while the names are shown.
 */
import { KEY_LABEL, keyIndex, type KeyIndex as Index } from '../lib/keyIndex'

const LETTER = /\p{L}/u

function nameFor(text: string, index: Index): string | null {
  const trimmed = text.trim()
  // numbers, emoji and punctuation are not texts
  if (!LETTER.test(trimmed)) return null
  // already named by t() or by the data helpers
  if (KEY_LABEL.test(trimmed)) return null
  const keys = index.get(trimmed)
  if (!keys) return 'no_key'
  if (keys.length === 1) return keys[0]
  return `${keys.map((k) => `! ${k}`).join(' ')} ×${keys.length}`
}

export function KeysOverlay() {
  const { lang, keysOn } = useI18n()

  useEffect(() => {
    if (!keysOn) return
    const index = keyIndex(lang)
    const original = new WeakMap<Text, string>()
    const shown = new WeakMap<Text, string>()
    const touched = new Set<Text>()

    const apply = (node: Text) => {
      if (node.parentElement?.closest('[data-keys-skip]')) return
      const value = node.nodeValue ?? ''
      if (shown.get(node) === value) return
      const name = nameFor(value, index)
      if (name === null) return
      original.set(node, value)
      // keep the spaces around the text, so the line does not collapse
      const lead = value.match(/^\s*/)?.[0] ?? ''
      const trail = value.match(/\s*$/)?.[0] ?? ''
      const next = `${lead}${name}${trail}`
      shown.set(node, next)
      touched.add(node)
      node.nodeValue = next
    }
    const walk = (root: Node) => {
      const it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      for (let n = it.nextNode(); n; n = it.nextNode()) apply(n as Text)
    }

    walk(document.body)
    const observer = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === 'characterData') apply(r.target as Text)
        else r.addedNodes.forEach((n) => (n.nodeType === Node.TEXT_NODE ? apply(n as Text) : walk(n)))
      }
    })
    observer.observe(document.body, { subtree: true, childList: true, characterData: true })

    return () => {
      observer.disconnect()
      // back to the texts
      touched.forEach((node) => {
        if (node.nodeValue === shown.get(node)) node.nodeValue = original.get(node) ?? node.nodeValue
      })
    }
  }, [keysOn, lang])

  return null
}
