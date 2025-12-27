import React, {useEffect, useMemo, useState} from 'react'

type EventItem = {
  id: string
  year: number
  title: string
  date?: string
  description?: string
  media?: { type: 'image' | 'video'; src: string }[]
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
  const hasYears = years.length > 0

  useEffect(() => {
    if (years.length === 0) return
    if (activeIndex >= years.length) {
      setActiveIndex(0)
    }
  }, [activeIndex, years.length])

  useEffect(() => {
    if (years.length === 0) return
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % years.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [years.length])

  return (
    <div className="helix-shell">
      <div className="helix-grid" />
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
              const radius = 180
              const spacing = 140
              const x = Math.cos(angleRad) * radius
              const y = diff * spacing
              const z = Math.sin(angleRad) * radius
              const scale = diff === 0 ? 1.08 : 0.82
              const opacity = Math.max(0.12, 1 - Math.abs(diff) * 0.15)

              return (
                <div
                  key={year}
                  className="helix-node"
                  style={{
                    transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${angle}deg) scale(${scale})`,
                    opacity
                  }}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className={`helix-card ${diff === 0 ? 'is-active' : ''}`}>
                    <div className="helix-card-header">
                      <span className="helix-year">{year}</span>
                      <span className="helix-status">{diff === 0 ? 'SYNCED' : 'LOCKED'}</span>
                    </div>
                    {yearEvents.length > 0 ? (
                      <div className="helix-events">
                        {yearEvents.map(ev => (
                          <div key={ev.id} className="helix-event">
                            <div className="helix-event-title">{ev.title}</div>
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
    </div>
  )
}
