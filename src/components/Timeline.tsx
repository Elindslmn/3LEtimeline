import React, {useMemo, useState} from 'react'

type EventItem = {
  id: string
  year: number
  title: string
  date?: string
  description?: string
  media?: { type: 'image' | 'video'; src: string }[]
}

type TimelineProps = {
  events: EventItem[]
  activeYear: number | null
  onSelectYear: (year: number) => void
}

const makeSignal = (seed: string) => {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000000
  }
  const hex = hash.toString(16).padStart(6, '0')
  return `SYNC-${hex.toUpperCase()}`
}

export default function Timeline({events, activeYear, onSelectYear}: TimelineProps) {
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

  const [expandedYear, setExpandedYear] = useState<number | null>(null)

  return (
    <div className="timeline-shell">
      <div className="timeline-header">
        <p className="timeline-kicker">Memory Sequences</p>
        <h2 className="timeline-title">Sequence Index</h2>
      </div>

      <div className="timeline-list">
        {years.map(year => {
          const yearEvents = (eventsByYear.get(year) ?? []).slice().sort((a, b) => {
            if (a.date && b.date) return a.date.localeCompare(b.date)
            return a.title.localeCompare(b.title)
          })
          const isActive = activeYear === year
          const isExpanded = expandedYear === year

          return (
            <section
              key={year}
              className={`timeline-year${isActive ? ' is-active' : ''}`}
              onClick={() => {
                onSelectYear(year)
                setExpandedYear(isExpanded ? null : year)
              }}
            >
              <div className="timeline-year-header">
                <div>
                  <div className="timeline-year-label">SEQ. {year}</div>
                  <div className="timeline-year-meta">MEMORY START</div>
                </div>
                <div className="timeline-year-signal">{makeSignal(`year-${year}`)}</div>
              </div>

              {yearEvents.length > 0 ? (
                <div className={`timeline-events${isExpanded ? ' is-open' : ''}`}>
                  {yearEvents.map(ev => (
                    <article key={ev.id} className="timeline-event">
                      <div className="timeline-event-title">{ev.title}</div>
                      <div className="timeline-event-signal">{makeSignal(`${ev.id}-${ev.year}`)}</div>
                      {ev.date && <div className="timeline-event-date">{ev.date}</div>}
                      {ev.description && <p className="timeline-event-desc">{ev.description}</p>}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="timeline-empty">NO DATA LOADED</div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
