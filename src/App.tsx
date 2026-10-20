import { Navigate, Route, Routes } from 'react-router-dom'
import { ConceptBase } from './concepts/nav'
import StoryConcept from './concepts/story/StoryConcept'
import TalkConcept from './concepts/talk/TalkConcept'
import QuestConcept from './concepts/quest/QuestConcept'
import BookConcept from './concepts/book/BookConcept'
import { CareCardPage } from './standalone/CareCardPage'
import { CareCardViewPage } from './standalone/CareCardViewPage'
import { RequestsPage } from './standalone/RequestsPage'
import { StandaloneCardShell } from './components/StandaloneCardShell'

/**
 * Top level: the story home at `/`, and every UI concept mounted under
 * its own base path. See CLAUDE.md for how to add a new concept.
 */
export default function App() {
  return (
    <Routes>
      {/* the start of the site is the story home; the old concept menu address falls back to it */}
      <Route index element={<Navigate to="/story" replace />} />

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
      <Route path="/settings" element={<Navigate to="/story/settings" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
