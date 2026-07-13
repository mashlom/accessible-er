import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { ReasonPage } from './pages/ReasonPage'
import { JourneyPage } from './pages/JourneyPage'
import { ProceduresPage } from './pages/ProceduresPage'
import { ProcedureDetailPage } from './pages/ProcedureDetailPage'
import { MapPage } from './pages/MapPage'
import { CalmPage } from './pages/CalmPage'
import { RequestsPage } from './pages/RequestsPage'
import { FeedbackPage } from './pages/FeedbackPage'
import { CareCardPage } from './pages/CareCardPage'
import { CareCardViewPage } from './pages/CareCardViewPage'
import { QrPage } from './pages/QrPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="reason" element={<ReasonPage />} />
        <Route path="journey" element={<JourneyPage />} />
        <Route path="procedures" element={<ProceduresPage />} />
        <Route path="procedures/:id" element={<ProcedureDetailPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="calm" element={<CalmPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="card" element={<CareCardPage />} />
        <Route path="card/view" element={<CareCardViewPage />} />
        {/* staff-only page, deliberately not linked from the parent UI */}
        <Route path="settings" element={<QrPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
