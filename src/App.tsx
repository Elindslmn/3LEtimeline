import React, {useEffect, useState} from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import sampleEvents from '../data/events.json'
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'

const STORAGE_KEY = 'elind_timeline_events_v1'

function AppRouterWrapper(){
  const [events, setEvents] = useState(sampleEvents)

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

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <div>
            <p className="app-subtitle">Animus Helix</p>
            <h1 className="app-title">Elind Timeline 1995-2025</h1>
          </div>
          <nav className="app-nav">
            <Link to="/">Home</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home events={events} />} />
            <Route path="/admin/*" element={<AdminPage events={events} setEvents={setEvents} storageKey={STORAGE_KEY} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default AppRouterWrapper
