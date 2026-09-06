import { Route, Routes } from 'react-router-dom'
import { StoryPage } from './pages/StoryPage'

export default function BookConcept() {
  return (
    <Routes>
      <Route index element={<StoryPage />} />
    </Routes>
  )
}
