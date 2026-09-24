import { Navigate, Route, Routes } from 'react-router-dom'
import { MenuPage } from './menu/MenuPage'
import { ConceptBase } from './concepts/nav'
import CalmConcept from './concepts/calm/CalmConcept'
import StoryConcept from './concepts/story/StoryConcept'
import TalkConcept from './concepts/talk/TalkConcept'
import QuestConcept from './concepts/quest/QuestConcept'
import BookConcept from './concepts/book/BookConcept'
import { CareCardPage } from './concepts/calm/pages/CareCardPage'
import { CareCardViewPage } from './concepts/calm/pages/CareCardViewPage'
import { RequestsPage } from './concepts/calm/pages/RequestsPage'
import { StandaloneCardShell } from './components/StandaloneCardShell'

/**
 * Top level: a concept menu at `/`, and every UI concept mounted under
 * its own base path. See `src/concepts/registry.ts` for the catalogue and
 * CLAUDE.md for how to add a new concept.
 */
export default function App() {
  return (
    <Routes>
      <Route index element={<MenuPage />} />

      {/* Reachable before picking a concept — per Rotem's feedback (issue #8):
          the care card should be visible on the home screen, not buried
          inside a concept. Shares the same `care-card` localStorage key as
          every concept's own card screen. */}
      <Route
        path="/card"
        element={
          <StandaloneCardShell>
            <CareCardPage />
          </StandaloneCardShell>
        }
      />
      <Route
        path="/card/view"
        element={
          <StandaloneCardShell>
            <CareCardViewPage />
          </StandaloneCardShell>
        }
      />
      <Route
        path="/requests"
        element={
          <StandaloneCardShell>
            <RequestsPage />
          </StandaloneCardShell>
        }
      />

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

      <Route
        path="/talk/*"
        element={
          <ConceptBase base="/talk">
            <TalkConcept />
          </ConceptBase>
        }
      />

      <Route
        path="/quest/*"
        element={
          <ConceptBase base="/quest">
            <QuestConcept />
          </ConceptBase>
        }
      />

      <Route
        path="/book/*"
        element={
          <ConceptBase base="/book">
            <BookConcept />
          </ConceptBase>
        }
      />

      {/* Legacy links from before the concept menu pointed at the app root. */}
      <Route path="/settings" element={<Navigate to="/calm/settings" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
