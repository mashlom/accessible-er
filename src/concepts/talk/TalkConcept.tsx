import { useLayoutEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { setI18nEnabled } from '../../hooks/useI18n'
import { Navigate } from '../nav'
import { TalkShell } from './components/TalkShell'
import { TalkPage } from './pages/TalkPage'
import { QrPage } from './pages/QrPage'

/**
 * Concept 3 — "Talk with Roni". Mounted at /talk by App.tsx.
 *
 * Almost everything happens on the index route: the conversation *is* the
 * app. The only extra routes are the two things a dialogue cannot be — a
 * card you hold up to staff, and printable signage.
 */
export default function TalkConcept() {
  // translations are on while the talk concept is open (the topics use the same words as the home tiles)
  useLayoutEffect(() => {
    setI18nEnabled(true)
    return () => setI18nEnabled(false)
  }, [])
  return (
    <Routes>
      <Route element={<TalkShell />}>
        <Route index element={<TalkPage />} />
        {/* staff-only page, deliberately not reachable from the conversation */}
        <Route path="settings" element={<QrPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
