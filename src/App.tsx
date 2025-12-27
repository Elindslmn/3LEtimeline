import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminPage from './pages/AdminPage';

// Importa i dati iniziali (Assicurati di aver spostato la cartella data dentro src)
import defaultEventsData from './data/events.json';

const STORAGE_KEY = 'elind_events_v1';

// Definiamo il tipo per gli eventi per sicurezza
type EventItem = {
  id: string;
  year: number;
  title: string;
  date?: string;
  description?: string;
  media?: { type: 'image' | 'video'; src: string }[];
};

export default function App() {
  // 1. Inizializza lo stato degli eventi
  // Cerca prima nel localStorage (modifiche salvate), altrimenti usa il JSON di default
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Errore nel parsing del localStorage, uso default:', e);
      }
    }
    return defaultEventsData;
  });

  // 2. Stato per l'anno attivo (condiviso)
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [theme, setTheme] = useState('night-city');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);


  // 3. Calcola la lista degli anni unici presenti negli eventi
  const years = Array.from(new Set(events.map((e) => e.year))).sort((a, b) => a - b);

  // 4. Wrapper per salvare sia nello stato che nel localStorage quando l'admin modifica qualcosa
  const handleSetEvents = (newEvents: EventItem[]) => {
    setEvents(newEvents);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
  };

  useEffect(() => {
    if (activeYear === null && years.length > 0) {
      setActiveYear(years[0])
    }
  }, [activeYear, years])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = (clientY / window.innerHeight) * 2 - 1;
      document.body.style.setProperty('--parallax-x', `${-x * 10}px`);
      document.body.style.setProperty('--parallax-y', `${-y * 10}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="app-shell">
      <BrowserRouter>
        <div className="scroll-container">
          <Routes>
            {/* Rotta Principale: La Timeline Pubblica */}
            <Route 
              path="/" 
                        element={
                          <Home 
                            events={events} 
                            years={years} 
                            activeYear={activeYear} 
                            onSelectYear={setActiveYear}
                            theme={theme}
                            setTheme={setTheme}
                          />
                        } 
                      />
            {/* Rotta Admin: Il Pannello di Gestione */}
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
        </div>
      </BrowserRouter>
    </div>
  );
}