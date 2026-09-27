import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'he' | 'en' | 'ru'

interface I18nContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

let translations: Record<Language, any> = { he: {}, en: {}, ru: {} }

export async function loadTranslations(theme: string) {
  try {
    const module = await import(`../data/i18n/${theme}.json`)
    translations = module.default
  } catch (err) {
    console.warn(`Could not load translations for theme ${theme}`, err)
  }
}

export function I18nProvider({ children, theme }: { children: ReactNode; theme: string }) {
  const [lang, setLang] = useState<Language>('he')

  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = translations[lang]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
