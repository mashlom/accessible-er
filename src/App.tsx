import { Navigate, Route, Routes } from 'react-router-dom'
import { MenuPage } from './menu/MenuPage'
import { ConceptBase } from './concepts/nav'
import CalmConcept from './concepts/calm/CalmConcept'
import StoryConcept from './concepts/story/StoryConcept'

/**
 * Top level: a concept menu at `/`, and every UI concept mounted under
 * its own base path. See `src/concepts/registry.ts` for the catalogue and
 * CLAUDE.md for how to add a new concept.
 */
export default function App() {
  return (
    <Routes>
      <Route index element={<MenuPage />} />

      <Route
        path="/calm/*"
        element={
          <ConceptBase base="/calm">
            <CalmConcept />
          </ConceptBase>
        }
      />

      <Route
        path="/story/*"
        element={
          <ConceptBase base="/story">
            <StoryConcept />
          </ConceptBase>
        }
      />

      {/* Legacy links from before the concept menu pointed at the app root. */}
      <Route path="/settings" element={<Navigate to="/calm/settings" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
