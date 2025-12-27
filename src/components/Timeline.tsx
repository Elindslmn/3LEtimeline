import React, {useMemo, useState} from 'react'

type EventItem = {
  id: string
  year: number
  title: string
  date?: string
  description?: string
  media?: { type: 'image' | 'video'; src: string }[]
}

export default function Timeline({events}: {events: EventItem[]}) {
  const [filterDecade, setFilterDecade] = useState<number | 'all'>('all')
  const decades = Array.from(new Set(events.map(e => Math.floor(e.year / 10) * 10))).sort()

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

  const filteredYears = years.filter(y =>
    filterDecade === 'all' ? true : Math.floor(y / 10) * 10 === filterDecade
  )

  return (
    <div>
      <div className="animus-filter">
        <label className="animus-subtitle">Filtro</label>
        <select value={String(filterDecade)} onChange={(e)=>{
          const v = e.target.value
          setFilterDecade(v === 'all' ? 'all' : Number(v))
        }} className="animus-select">
          <option value={'all'}>Tutti</option>
          {decades.map(d => (
            <option key={d} value={d}>{d}s</option>
          ))}
        </select>
      </div>

      <div className="animus-timeline">
        <div className="animus-line" />
        <div className="space-y-8">
          {filteredYears.map(year => {
            const yearEvents = (eventsByYear.get(year) ?? []).slice().sort((a, b) => {
              if (a.date && b.date) return a.date.localeCompare(b.date)
              return a.title.localeCompare(b.title)
            })
            return (
              <div key={year} className="relative flex items-start gap-6">
                <div className="animus-year">
                  <div>{year}</div>
                </div>
                <div className="relative flex-1">
                  <span className="absolute -left-[34px] top-2 h-3 w-3 rounded-full border-2 border-[color:var(--line)] bg-white" />
                  {yearEvents.length > 0 ? (
                    <div className="space-y-4">
                      {yearEvents.map(ev => (
                        <div key={ev.id} className="animus-card">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <span className="animus-chip">{ev.title}</span>
                              {ev.date && <div className="mt-2 text-xs uppercase tracking-[0.25em] text-[color:var(--ink)]/70">{ev.date}</div>}
                            </div>
                          </div>
                          {ev.description && <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink)]/90">{ev.description}</p>}
                          {ev.media && ev.media.length>0 && (
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              {ev.media.map((m, i) => (
                                <div key={i} className="animus-media">
                                  {m.type === 'image' ? (
                                    <img src={m.src} alt="media" className="h-40 w-full object-cover" />
                                  ) : (
                                    <video src={m.src} controls className="h-40 w-full object-cover" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="animus-empty">
                      Nessun evento per questo anno.
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
