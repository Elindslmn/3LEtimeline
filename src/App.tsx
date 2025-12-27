import React, {useEffect, useMemo, useState} from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import sampleEvents from '../data/events.json'
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'
import CustomCursor from './components/CustomCursor'

const STORAGE_KEY = 'elind_timeline_events_v1'

function AppShell(){
  const [events, setEvents] = useState(sampleEvents)
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
    <div className="app-shell">
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
            <Link to="/admin">Login</Link>
          </nav>
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
