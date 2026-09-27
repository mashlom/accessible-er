import { useI18n } from '../hooks/useI18n'
import css from './LanguagePicker.module.css'

const languages = [
  { code: 'he' as const, flag: '🇮🇱', name: 'עברית' },
  { code: 'en' as const, flag: '🇬🇧', name: 'English' },
  { code: 'ru' as const, flag: '🇷🇺', name: 'Русский' },
]

export function LanguagePicker() {
  const { lang, setLang } = useI18n()

  return (
    <div className={css.picker}>
      {languages.map((l) => (
        <button
          key={l.code}
          className={`${css.button} ${lang === l.code ? css.active : ''}`}
          onClick={() => setLang(l.code)}
          title={l.name}
          aria-label={`Switch to ${l.name}`}
        >
          {l.flag}
        </button>
      ))}
    </div>
  )
}
