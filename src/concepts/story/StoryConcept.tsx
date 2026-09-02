import { Route, Routes } from 'react-router-dom'
import { Navigate } from '../nav'
import { StoryShell } from './components/StoryShell'
import { WorldPage } from './pages/WorldPage'
import { ReasonPage } from './pages/ReasonPage'
import { TrailPage } from './pages/TrailPage'
import { ShowPage } from './pages/ShowPage'
import { BookPage } from './pages/BookPage'
import { MapPage } from './pages/MapPage'
import { CalmPage } from './pages/CalmPage'
import { DistractPage } from './pages/DistractPage'
import { RequestsPage } from './pages/RequestsPage'
import { CardPage } from './pages/CardPage'
import { CardViewPage } from './pages/CardViewPage'
import { GoingHomePage } from './pages/GoingHomePage'
import { MessagePage } from './pages/MessagePage'
import { FeedbackPage } from './pages/FeedbackPage'
import { QrPage } from './pages/QrPage'

/** Concept 2 — "המסע של רוני". Mounted at /story by App.tsx. */
export default function StoryConcept() {
  return (
    <Routes>
      <Route element={<StoryShell />}>
        <Route index element={<WorldPage />} />
        <Route path="reason" element={<ReasonPage />} />
        <Route path="trail" element={<TrailPage />} />
        <Route path="show" element={<ShowPage />} />
        <Route path="show/:id" element={<BookPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="calm" element={<CalmPage />} />
        <Route path="distract" element={<DistractPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="card" element={<CardPage />} />
        <Route path="card/view" element={<CardViewPage />} />
        <Route path="going-home" element={<GoingHomePage />} />
        <Route path="message" element={<MessagePage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        {/* staff-only page, deliberately not linked from the family UI */}
        <Route path="settings" element={<QrPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
