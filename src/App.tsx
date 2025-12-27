import React, {useEffect, useMemo, useState} from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import sampleEvents from '../data/events.json'
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'
import Experience from './components/Experience'
import Overlay from './components/Overlay'
import CustomCursor from './components/CustomCursor'

const STORAGE_KEY = 'elind_timeline_events_v1'
const THEME_KEY = 'elind_timeline_theme_v1'

type ThemeName = 'white' | 'ratchet' | 'cyberpunk'

function AppShell(){
  const location = useLocation()
  const [events, setEvents] = useState(sampleEvents)
  const [activeYear, setActiveYear] = useState<number | null>(null)
  const [theme, setTheme] = useState<ThemeName>(() => {
    if (typeof window === 'undefined') return 'cyberpunk'
    const stored = window.localStorage.getItem(THEME_KEY) as ThemeName | null
    return stored ?? 'cyberpunk'
  })

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.dataset.theme = theme
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setEvents(JSON.parse(raw))
        return
      } catch (e) {
        console.warn('Invalid events in localStorage, falling back to sample')
      }
    }
    setEvents(sampleEvents)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }, [events])

  const years = useMemo(() => {
    if (events.length === 0) return [] as number[]
    const minYear = Math.min(...events.map(e => e.year))
    const maxYear = Math.max(...events.map(e => e.year))
    return Array.from({length: maxYear - minYear + 1}, (_, i) => minYear + i)
  }, [events])

  useEffect(() => {
    if (activeYear === null && years.length > 0) {
      setActiveYear(years[0])
    }
  }, [activeYear, years])

  const handleSelectYear = (year: number) => {
    setActiveYear(year)
    const target = document.getElementById(`year-${year}`)
    if (target) {
      target.scrollIntoView({behavior: 'smooth', block: 'start'})
    }
  }

  const isAdmin = location.pathname.startsWith('/admin')
  const scrollPages = isAdmin ? 2 : 3

  return (
    <div className="app-shell app-shell--canvas">
      <Canvas className="canvas-root" camera={{ position: [0, 0, 5], fov: 35 }}>
        <ScrollControls pages={scrollPages} damping={0.2}>
          <Experience />
          <Overlay>
            <CustomCursor />
            <header className="app-header">
              <div>
                <p className="app-subtitle">Animus Helix</p>
                <h1 className="app-title">Elind Timeline 1995-2025</h1>
              </div>
              <div className="app-header-right">
                <nav className="app-nav">
                  <Link to="/">Home</Link>
                  <a href="#about">About</a>
                  <a href="#timeline">Timeline</a>
                  <a href="#animus">Helix</a>
                  <Link to="/admin">Backoffice</Link>
                </nav>
                <div className="theme-switch">
                  <span className="theme-label">Theme</span>
                  <button
                    type="button"
                    className={`theme-button${theme === 'white' ? ' is-active' : ''}`}
                    onClick={() => setTheme('white')}
                    aria-pressed={theme === 'white'}
                  >
                    White
                  </button>
                  <button
                    type="button"
                    className={`theme-button${theme === 'ratchet' ? ' is-active' : ''}`}
                    onClick={() => setTheme('ratchet')}
                    aria-pressed={theme === 'ratchet'}
                  >
                    R&C
                  </button>
                  <button
                    type="button"
                    className={`theme-button${theme === 'cyberpunk' ? ' is-active' : ''}`}
                    onClick={() => setTheme('cyberpunk')}
                    aria-pressed={theme === 'cyberpunk'}
                  >
                    Cyber
                  </button>
                </div>
              </div>
            </header>

            <div className="app-layout">
              <main className="app-main">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Home
                        events={events}
                        years={years}
                        activeYear={activeYear}
                        onSelectYear={handleSelectYear}
                      />
                    }
                  />
                  <Route
                    path="/admin/*"
                    element={<AdminPage events={events} setEvents={setEvents} storageKey={STORAGE_KEY} />}
                  />
                </Routes>
              </main>
            </div>
          </Overlay>
        </ScrollControls>
      </Canvas>
    </div>
  )
}

export default function AppRouterWrapper() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
