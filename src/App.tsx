import React, {useEffect, useMemo, useState} from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import sampleEvents from '../data/events.json'
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'
import AnimusScene from './components/AnimusScene'
import CustomCursor from './components/CustomCursor'

const STORAGE_KEY = 'elind_timeline_events_v1'

type ThemeName = 'brotherhood' | 'cyberpunk' | 'ratchet'

function AppRouterWrapper(){
  const [events, setEvents] = useState(sampleEvents)
  const [theme, setTheme] = useState<ThemeName>('brotherhood')
  const [activeYear, setActiveYear] = useState<number | null>(null)

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

  useEffect(() => {
    document.body.dataset.theme = theme
  }, [theme])

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

  return (
    <BrowserRouter>
      <div className="app-shell">
        <CustomCursor />
        <div className="ui-scanlines" />

        <header className="app-header">
          <div>
            <p className="app-subtitle">Animus Helix</p>
            <h1 className="app-title">Elind Timeline 1995-2025</h1>
          </div>
          <div className="app-header-right">
            <nav className="app-nav">
              <Link to="/">Home</Link>
              <a href="#about">About</a>
              <Link to="/admin">Login</Link>
            </nav>
            <div className="theme-switch">
              <span className="theme-label">Tema</span>
              <button
                type="button"
                className={theme === 'brotherhood' ? 'is-active' : ''}
                onClick={() => setTheme('brotherhood')}
              >
                AC
              </button>
              <button
                type="button"
                className={theme === 'cyberpunk' ? 'is-active' : ''}
                onClick={() => setTheme('cyberpunk')}
              >
                CP
              </button>
              <button
                type="button"
                className={theme === 'ratchet' ? 'is-active' : ''}
                onClick={() => setTheme('ratchet')}
              >
                R&C
              </button>
            </div>
          </div>
        </header>

        <div className="app-layout">
          <aside className="app-helix">
            <AnimusScene
              theme={theme}
              years={years}
              activeYear={activeYear}
              onSelectYear={handleSelectYear}
            />
          </aside>

          <main className="app-main">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    events={events}
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
      </div>
    </BrowserRouter>
  )
}

export default AppRouterWrapper
