import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'he' | 'en' | 'ru'

interface I18nContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

let translations: Record<Language, any> = { he: {}, en: {}, ru: {} }

export async function loadTranslations(filename: string) {
  try {
    const response = await fetch(`/src/data/i18n/${filename}.json`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    translations = data
    console.log(`✓ Loaded translations for ${filename}`, Object.keys(data))
  } catch (err) {
    console.warn(`Could not load translations for ${filename}:`, err)
    // Try fallback: import all as object
    try {
      const allTranslations = {
        he: (await import(`../data/i18n/${filename}.json`)).default.he,
        en: (await import(`../data/i18n/${filename}.json`)).default.en,
        ru: (await import(`../data/i18n/${filename}.json`)).default.ru,
      }
      translations = allTranslations
      console.log(`✓ Loaded translations via import for ${filename}`)
    } catch (fallbackErr) {
      console.error(`Failed to load ${filename} via both methods:`, fallbackErr)
    }
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
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
