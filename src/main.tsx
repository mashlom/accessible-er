import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, useLocation } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter future={{ v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <App />
    </HashRouter>
  </StrictMode>,
)
