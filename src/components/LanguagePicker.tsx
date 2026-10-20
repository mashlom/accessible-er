import { useEffect, useRef, useState } from 'react'
import { setKeysOn, useI18n } from '../hooks/useI18n'
import css from './LanguagePicker.module.css'

const languages = [
  { code: 'he' as const, flag: '🇮🇱', short: 'IL' },
  { code: 'en' as const, flag: '🇬🇧', short: 'EN' },
  { code: 'ru' as const, flag: '🇷🇺', short: 'RU' },
]

/** overlay: a small translucent pill with the country code, for use over a picture */
export function LanguagePicker({
  variant = 'default',
  align = 'end',
}: {
  variant?: 'default' | 'overlay'
  /** which edge of the trigger the menu opens from; use 'start' near the left edge of the screen */
  align?: 'start' | 'end'
}) {
  const { lang, setLang, t, keysOn } = useI18n()
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
        className={variant === 'overlay' ? `${css.trigger} ${css.overlay}` : css.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Language: ${t(`ui.language.${current.code}`)}`}
      >
        <span aria-hidden>{variant === 'overlay' ? current.short : current.flag}</span>
        <span className={css.caret} aria-hidden>▾</span>
      </button>

      {open && (
        <ul className={align === 'start' ? `${css.menu} ${css.menuStart}` : css.menu} role="menu">
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
                <span lang={l.code}>{t(`ui.language.${l.code}`)}</span>
              </button>
            </li>
          ))}
          {/* the technical switch: the texts are replaced by their keys (for the team, to see what is not translated) */}
          <li role="none">
            <button
              type="button"
              role="menuitemcheckbox"
              aria-checked={keysOn}
              className={`${css.item} ${keysOn ? css.active : ''}`}
              onClick={() => {
                setKeysOn(!keysOn)
                setOpen(false)
              }}
            >
              <span aria-hidden>🔧</span>
              <span>text_name</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
