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
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-6xl mx-auto p-6">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Elind Timeline 1995–2025</h1>
            <nav>
              <Link to="/" className="mr-4 text-blue-600">Home</Link>
              <Link to="/admin" className="text-blue-600">Admin</Link>
            </nav>
          </header>

          <Routes>
            <Route path="/" element={<Home events={events} />} />
            <Route path="/admin/*" element={<AdminPage events={events} setEvents={setEvents} storageKey={STORAGE_KEY} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default AppRouterWrapper
