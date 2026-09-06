import { Route, Routes } from 'react-router-dom'
import { Navigate } from '../nav'
import { WorldSelectPage } from './pages/WorldSelectPage'
import { MapPage } from './pages/MapPage'
import { StagePage } from './pages/StagePage'
import { CelebratePage } from './pages/CelebratePage'
import { ProcedureSelectPage } from './pages/ProcedureSelectPage'
import { NightMapPage } from './pages/NightMapPage'

/** Concept 4 — "מסע עם מפה". Mounted at /quest by App.tsx. */
export default function QuestConcept() {
  return (
    <Routes>
      <Route index element={<WorldSelectPage />} />
      <Route path="map" element={<MapPage />} />
      <Route path="stage/:id" element={<StagePage />} />
      <Route path="procedures" element={<ProcedureSelectPage />} />
      <Route path="night-map" element={<NightMapPage />} />
      <Route path="celebrate" element={<CelebratePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
