import { Route, Routes } from 'react-router-dom'
import { Navigate } from '../nav'
import { StoryShell } from './components/StoryShell'
import { WorldPage } from './pages/WorldPage'
import { ReasonPage } from './pages/ReasonPage'
import { TrailPage } from './pages/TrailPage'
import { ShowPage } from './pages/ShowPage'
import { BookPage } from './pages/BookPage'
import { MapPage } from './pages/MapPage'
import { CalmPage } from '../quest/pages/CalmPage'
import { DistractPage } from './pages/DistractPage'
import { RequestsPage } from './pages/RequestsPage'
import { GoingHomePage } from './pages/GoingHomePage'
import { MessagePage } from './pages/MessagePage'
import { FeedbackPage } from './pages/FeedbackPage'
import { WaitTimesPage } from './pages/WaitTimesPage'
import { QrPage } from './pages/QrPage'
import styles from './story.module.css'

/** Concept 2 — "Roni's journey". Mounted at /story by App.tsx. */
export default function StoryConcept() {
  return (
    <Routes>
      <Route element={<StoryShell />}>
        <Route index element={<WorldPage />} />
        <Route path="reason" element={<ReasonPage />} />
        <Route path="trail" element={<TrailPage />} />
        <Route path="wait-times" element={<WaitTimesPage />} />
        <Route path="show" element={<ShowPage />} />
        <Route path="show/:id" element={<BookPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="calm" element={<div className={styles.column}><CalmPage /></div>} />
        <Route path="distract" element={<DistractPage />} />
        <Route path="requests" element={<RequestsPage />} />
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
