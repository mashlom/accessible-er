import { Route, Routes } from 'react-router-dom'
import { Navigate } from '../nav'
import { TalkShell } from './components/TalkShell'
import { TalkPage } from './pages/TalkPage'
import { CardViewPage } from './pages/CardViewPage'
import { QrPage } from './pages/QrPage'

/**
 * Concept 3 — "לדבר עם רוני". Mounted at /talk by App.tsx.
 *
 * Almost everything happens on the index route: the conversation *is* the
 * app. The only extra routes are the two things a dialogue cannot be — a
 * card you hold up to staff, and printable signage.
 */
export default function TalkConcept() {
  return (
    <Routes>
      <Route element={<TalkShell />}>
        <Route index element={<TalkPage />} />
        <Route path="card/view" element={<CardViewPage />} />
        {/* staff-only page, deliberately not reachable from the conversation */}
        <Route path="settings" element={<QrPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
