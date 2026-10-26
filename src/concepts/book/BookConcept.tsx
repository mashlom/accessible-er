import { keyed } from '../../lib/keyed'
import { useLayoutEffect } from 'react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { setI18nEnabled, useI18n } from '../../hooks/useI18n'
import { useConceptPath } from '../nav'
import i18nUi from '../../data/i18n/ui.json'
import { LanguagePicker } from '../../components/LanguagePicker'
import { StoryPage } from './pages/StoryPage'
import { RealBookPage } from './pages/RealBookPage'
import { RoniBookPage } from './pages/RoniBookPage'
import css from './book.module.css'

/**
 * The Books shelf (issue #10): three books side by side, named by what each
 * one is — a picture book, a story with Roni, real photos — not by age.
 * Only the picture book exists today; the other two tabs hold their place.
 */
export default function BookConcept() {
  // the book has its own translations (data/child/book/book.json), so they are on while it is open
  useLayoutEffect(() => {
    setI18nEnabled(true)
    return () => setI18nEnabled(false)
  }, [])
  const { lang, dir } = useI18n()
  const path = useConceptPath()
  const navigate = useNavigate()
  const tabs = keyed((i18nUi as unknown as Record<'he' | 'en' | 'ru', { books: { tabs: Record<string, string> } }>)[lang], 'i18n/ui')
    .books.tabs

  return (
    <div className={css.shelf}>
      {/* the same top bar as the story pages: flag and language on the start side, back on the end side */}
      <header className={css.topbar}>
        {/* pinned RTL, like the other top bars, so it doesn't flip with the language */}
        <div className={css.topbarInner} dir="rtl">
          <button type="button" className={css.topBtn} onClick={() => navigate(-1)} aria-label="Back">
            <span aria-hidden>›</span>
          </button>
          <span aria-hidden />
          <div className={css.topGroup}>
            <LanguagePicker />
            <a href="#/" className={css.topFlag} aria-label="Home">
              <span aria-hidden>🏁</span>
            </a>
          </div>
        </div>
      </header>
      <nav className={css.tabs} dir={dir} lang={lang}>
        <NavLink end to={path('/')} className={({ isActive }) => (isActive ? `${css.tab} ${css.tabOn}` : css.tab)}>
          {tabs.picture}
        </NavLink>
        <NavLink to={path('/story')} className={({ isActive }) => (isActive ? `${css.tab} ${css.tabOn}` : css.tab)}>
          {tabs.roni}
        </NavLink>
        <NavLink to={path('/real')} className={({ isActive }) => (isActive ? `${css.tab} ${css.tabOn}` : css.tab)}>
          {tabs.real}
        </NavLink>
      </nav>
      <Routes>
        <Route index element={<StoryPage />} />
        <Route path="story" element={<RoniBookPage />} />
        <Route path="real" element={<RealBookPage />} />
      </Routes>
    </div>
  )
}
