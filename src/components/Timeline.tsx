import React, {useState} from 'react'

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

  const filtered = events.filter(e => filterDecade === 'all' ? true : Math.floor(e.year/10)*10 === filterDecade)

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <label className="font-medium">Filter:</label>
        <select value={String(filterDecade)} onChange={(e)=>{
          const v = e.target.value
          setFilterDecade(v === 'all' ? 'all' : Number(v))
        }} className="border rounded px-2 py-1">
          <option value={'all'}>All</option>
          {decades.map(d => (
            <option key={d} value={d}>{d}s</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.sort((a,b)=>a.year-b.year).map(ev => (
          <div key={ev.id} className="p-4 bg-white rounded shadow">
            <div className="flex items-start gap-4">
              <div className="text-xl font-semibold w-24">{ev.year}</div>
              <div>
                <div className="font-bold">{ev.title}</div>
                {ev.date && <div className="text-sm text-gray-600">{ev.date}</div>}
                {ev.description && <p className="mt-2 text-gray-800">{ev.description}</p>}
                {ev.media && ev.media.length>0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {ev.media.map((m, i) => (
                      <div key={i} className="w-40">
                        {m.type === 'image' ? (
                          <img src={m.src} alt="media" className="w-full h-24 object-cover rounded" />
                        ) : (
                          <video src={m.src} controls className="w-full h-24 object-cover rounded" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
