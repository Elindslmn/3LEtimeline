import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'
import defaultEventsData from './data/events.json'

const STORAGE_KEY = 'elind_events_v1'

type EventItem = {
  id: string
  year: number
  title: string
  date?: string
  description?: string
  media?: { type: 'image' | 'video'; src: string }[]
}

export default function App() {
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Errore nel parsing del localStorage, uso default:', e)
      }
    }
    return defaultEventsData
  })

  const [activeYear, setActiveYear] = useState<number | null>(null)

  const years = Array.from(new Set(events.map((e) => e.year))).sort((a, b) => a - b)

  const handleSetEvents = (newEvents: EventItem[]) => {
    setEvents(newEvents)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents))
  }

  useEffect(() => {
    if (activeYear === null && years.length > 0) {
      setActiveYear(years[0])
    }
  }, [activeYear, years])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              events={events}
              years={years}
              activeYear={activeYear}
              onSelectYear={setActiveYear}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminPage
              events={events}
              setEvents={handleSetEvents}
              storageKey={STORAGE_KEY}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
