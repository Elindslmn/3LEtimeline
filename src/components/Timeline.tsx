import React, {useEffect, useMemo, useState} from 'react'

type EventItem = {
  id: string
  year: number
  title: string
  date?: string
  description?: string
  media?: { type: 'image' | 'video'; src: string }[]
}

const makeSignal = (seed: string) => {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000000
  }
  const hex = hash.toString(16).padStart(6, '0')
  return `SYNC-${hex.toUpperCase()}`
}

export default function Timeline({events}: {events: EventItem[]}) {
  const {years, eventsByYear} = useMemo(() => {
    if (events.length === 0) {
      return {years: [] as number[], eventsByYear: new Map<number, EventItem[]>()}
    }
    const minYear = Math.min(...events.map(e => e.year))
    const maxYear = Math.max(...events.map(e => e.year))
    const yearList = Array.from({length: maxYear - minYear + 1}, (_, i) => minYear + i)
    const grouped = events.reduce((map, ev) => {
      const bucket = map.get(ev.year) ?? []
      bucket.push(ev)
      map.set(ev.year, bucket)
      return map
    }, new Map<number, EventItem[]>())
    return {years: yearList, eventsByYear: grouped}
  }, [events])

  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const hasYears = years.length > 0

  useEffect(() => {
    if (years.length === 0) return
    if (activeIndex >= years.length) {
      setActiveIndex(0)
    }
  }, [activeIndex, years.length])

  useEffect(() => {
    if (years.length === 0 || selectedIndex !== null) return
    const speeds = [1600, 2200, 2800, 1900]
    const delay = speeds[activeIndex % speeds.length]
    const timer = setTimeout(() => {
      setActiveIndex(prev => (prev + 1) % years.length)
    }, delay)
    return () => clearTimeout(timer)
  }, [activeIndex, selectedIndex, years.length])

  return (
    <div className="helix-shell">
      <div className="helix-grid" />
      <div className="helix-strand helix-strand-left" />
      <div className="helix-strand helix-strand-right" />
      <div className="helix-fog" />
      <div className="helix-scanlines" />
      <div className="helix-vignette" />
      <div className="helix-stage">
        <div className="helix-scene">
          <div className="helix-world">
            {years.map((year, index) => {
              const yearEvents = (eventsByYear.get(year) ?? []).slice().sort((a, b) => {
                if (a.date && b.date) return a.date.localeCompare(b.date)
                return a.title.localeCompare(b.title)
              })
              const diff = index - activeIndex
              if (Math.abs(diff) > 6) return null
              const angle = diff * 40
              const angleRad = (angle * Math.PI) / 180
              const radius = 260
              const spacing = 160
              const x = Math.cos(angleRad) * radius
              const y = diff * spacing
              const z = Math.sin(angleRad) * radius
              const scale = diff === 0 ? 1.12 : 0.8
              const opacity = Math.max(0.12, 1 - Math.abs(diff) * 0.15)
              const isSelected = selectedIndex === index
              const zoom = isSelected ? 1.18 : 1

              return (
                <div
                  key={year}
                  className="helix-node"
                  style={{
                    transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${angle}deg) scale(${scale * zoom})`,
                    opacity
                  }}
                  onClick={() => {
                    setActiveIndex(index)
                    setSelectedIndex(index)
                  }}
                >
                  <div className={`helix-card ${diff === 0 ? 'is-active' : ''} ${isSelected ? 'is-selected' : ''}`}>
                    <div className="helix-card-header">
                      <div>
                        <span className="helix-year">{year}</span>
                        <div className="helix-seq">SEQ. {year} // MEMORY START</div>
                      </div>
                      <span className="helix-status">{diff === 0 ? 'SYNCED' : 'LOCKED'}</span>
                    </div>
                    {yearEvents.length > 0 ? (
                      <div className="helix-events">
                        {yearEvents.map(ev => (
                          <div key={ev.id} className="helix-event">
                            <div className="helix-event-title">{ev.title}</div>
                            <div className="helix-event-signal">{makeSignal(`${ev.id}-${ev.year}`)}</div>
                            {ev.date && <div className="helix-event-date">{ev.date}</div>}
                            {ev.description && <p className="helix-event-desc">{ev.description}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="helix-empty">NO EVENTS</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="helix-controls">
        <button disabled={!hasYears} onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}>PREV</button>
        <button disabled={!hasYears} onClick={() => setActiveIndex(Math.min(years.length - 1, activeIndex + 1))}>NEXT</button>
      </div>
      {selectedIndex !== null && years[selectedIndex] !== undefined && (
        <div className="helix-overlay" onClick={() => setSelectedIndex(null)}>
          <div className="helix-overlay-panel" onClick={(e) => e.stopPropagation()}>
            <div className="helix-overlay-header">
              <div>
                <div className="helix-overlay-label">Animus Database Entry</div>
                <span className="helix-year">SEQ. {years[selectedIndex]} // MEMORY START</span>
              </div>
              <button className="helix-close" onClick={() => setSelectedIndex(null)}>CLOSE</button>
            </div>
            <div className="helix-overlay-body">
              {(eventsByYear.get(years[selectedIndex]) ?? []).map(ev => (
                <div key={ev.id} className="helix-event">
                  <div className="helix-event-title">{ev.title}</div>
                  <div className="helix-event-signal">{makeSignal(`${ev.id}-${ev.year}`)}</div>
                  {ev.date && <div className="helix-event-date">{ev.date}</div>}
                  {ev.description && <p className="helix-event-desc">{ev.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
