import { Route, Routes } from 'react-router-dom'
import { Navigate } from '../nav'
import { QuestShell } from './components/QuestShell'
import { WorldSelectPage } from './pages/WorldSelectPage'
import { WorldScope } from './components/WorldScope'
import { MapPage } from './pages/MapPage'
import { StagePage } from './pages/StagePage'
import { CelebratePage } from './pages/CelebratePage'
import { ProcedureSelectPage } from './pages/ProcedureSelectPage'
import { NightMapPage } from './pages/NightMapPage'
import { ProcedureDetailPage } from './pages/ProcedureDetailPage'
import { ShopPage } from './pages/ShopPage'
import { ReasonPage } from './pages/ReasonPage'
import { DistractPage } from './pages/DistractPage'
import { WaitTimesPage } from './pages/WaitTimesPage'
import { FeedbackPage } from '../story/pages/FeedbackPage'

/** The screens of one world, under /quest/<world>/…, so every link inside a world stays in that world. */
function WorldRoutes() {
  return (
    <Routes>
      <Route index element={<MapPage />} />
      <Route path="map" element={<MapPage />} />
      <Route path="stage/:id" element={<StagePage />} />
      <Route path="procedures" element={<ProcedureSelectPage />} />
      {/* the second stage's map (the stations the doctor ordered); its old address was night-map */}
      <Route path="second-map" element={<NightMapPage />} />
      <Route path="night-map" element={<Navigate to="/second-map" replace />} />
      <Route path="celebrate" element={<CelebratePage />} />
      <Route path="shop" element={<ShopPage />} />
      <Route path="procedure/:id" element={<ProcedureDetailPage />} />
      <Route path="reason" element={<ReasonPage />} />
      <Route path="wait-times" element={<WaitTimesPage />} />
      <Route path="distract" element={<DistractPage />} />
      <Route path="feedback" element={<FeedbackPage />} />
      {/* an address the world doesn't have: its map, not an empty screen */}
      <Route path="*" element={<Navigate to="/map" replace />} />
    </Routes>
  )
}

/** Concept 4 — "journey with a map". Mounted at /quest by App.tsx. */
export default function QuestConcept() {
  return (
    <Routes>
      <Route element={<QuestShell />}>
        <Route index element={<WorldSelectPage />} />
        {/* /quest/<world>/<screen>, e.g. /quest/dollhouse/wait-times; an address without a world goes to the chosen one */}
        <Route path=":worldId/*" element={<WorldScope />}>
          <Route path="*" element={<WorldRoutes />} />
        </Route>
      </Route>
    </Routes>
  )
}
