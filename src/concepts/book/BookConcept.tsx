import { useLayoutEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { setI18nEnabled } from '../../hooks/useI18n'
import { StoryPage } from './pages/StoryPage'

export default function BookConcept() {
  // the book has its own translations (data/i18n/book.json), so they are on while it is open
  useLayoutEffect(() => {
    setI18nEnabled(true)
    return () => setI18nEnabled(false)
  }, [])

  return (
    <Routes>
      <Route index element={<StoryPage />} />
    </Routes>
  )
}
