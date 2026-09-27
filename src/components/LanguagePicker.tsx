import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import css from './LanguagePicker.module.css'

const languages = [
  { code: 'he' as const, flag: '🇮🇱', name: 'עברית' },
  { code: 'en' as const, flag: '🇬🇧', name: 'English' },
  { code: 'ru' as const, flag: '🇷🇺', name: 'Русский' },
]

export function LanguagePicker() {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const current = languages.find((l) => l.code === lang) ?? languages[0]

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={css.picker} ref={rootRef}>
      <button
        type="button"
        className={css.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Language: ${current.name}`}
      >
        <span aria-hidden>{current.flag}</span>
        <span className={css.caret} aria-hidden>▾</span>
      </button>

      {open && (
        <ul className={css.menu} role="menu">
          {languages.map((l) => (
            <li key={l.code} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={l.code === lang}
                className={`${css.item} ${l.code === lang ? css.active : ''}`}
                onClick={() => {
                  setLang(l.code)
                  setOpen(false)
                }}
              >
                <span aria-hidden>{l.flag}</span>
                <span lang={l.code}>{l.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
