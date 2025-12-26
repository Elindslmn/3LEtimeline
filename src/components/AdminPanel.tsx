import React, {useState, ChangeEvent} from 'react'

type Media = { type: 'image' | 'video'; src: string }
type EventItem = { id: string; year: number; title: string; date?: string; description?: string; media?: Media[] }

export default function AdminPanel({events, setEvents, storageKey}:{events: EventItem[]; setEvents: (e: EventItem[])=>void; storageKey: string}){
  const [editing, setEditing] = useState<EventItem | null>(null)
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null)

  function addEmpty(){
    const ev: EventItem = { id: String(Date.now()), year: 2000, title: 'New event', description: '' }
    setEvents([ev, ...events])
    setEditing(ev)
  }

  function remove(id:string){
    if(!confirm('Delete event?')) return
    setEvents(events.filter(e=>e.id!==id))
  }

  function update(ev: EventItem){
    setEvents(events.map(e=>e.id===ev.id?ev:e))
    setEditing(null)
  }

  function exportJson(){
    const dataStr = JSON.stringify(events, null, 2)
    const blob = new Blob([dataStr], {type:'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'events-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importJsonFile(f: File | null){
    if(!f) return
    const reader = new FileReader()
    reader.onload = ()=>{
      try{
        const parsed = JSON.parse(String(reader.result))
        if(Array.isArray(parsed)){
          setEvents(parsed)
          alert('Imported ' + parsed.length + ' events. Saved to localStorage.')
        } else alert('Invalid JSON format: expected an array')
      }catch(e){
        alert('Error parsing JSON')
      }
    }
    reader.readAsText(f)
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0] ?? null
    if(!f) return
    const reader = new FileReader()
    reader.onload = ()=>{
      setFileDataUrl(String(reader.result))
    }
    reader.readAsDataURL(f)
  }

  function attachImageToEditing(){
    if(!editing) return
    const media: Media = { type: 'image', src: fileDataUrl || '' }
    const ev = {...editing, media: [...(editing.media||[]), media]}
    update(ev)
    setFileDataUrl(null)
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-bold mb-3">Backoffice</h2>
      <div className="flex flex-col gap-2">
        <button onClick={addEmpty} className="bg-blue-600 text-white px-3 py-1 rounded">Add event</button>
        <button onClick={exportJson} className="bg-green-600 text-white px-3 py-1 rounded">Export JSON</button>
        <label className="block">
          <span className="text-sm">Import JSON</span>
          <input type="file" accept="application/json" onChange={(e)=>importJsonFile(e.target.files?.[0] ?? null)} className="mt-1" />
        </label>
        <div className="border-t pt-3">
          <div className="text-sm font-medium mb-2">Events ({events.length})</div>
          <div className="space-y-2 max-h-64 overflow-auto">
            {events.map(ev=> (
              <div key={ev.id} className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-semibold">{ev.year} — {ev.title}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>setEditing(ev)} className="text-sm text-blue-600">Edit</button>
                  <button onClick={()=>remove(ev.id)} className="text-sm text-red-600">Del</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {editing && (
          <div className="mt-3 border-t pt-3">
            <h3 className="font-medium mb-2">Edit event</h3>
            <label className="block mb-1">Year
              <input className="w-full border rounded px-2 py-1 mt-1" value={editing.year} onChange={(e)=>setEditing({...editing, year: Number(e.target.value)})} />
            </label>
            <label className="block mb-1">Title
              <input className="w-full border rounded px-2 py-1 mt-1" value={editing.title} onChange={(e)=>setEditing({...editing, title: e.target.value})} />
            </label>
            <label className="block mb-1">Date
              <input className="w-full border rounded px-2 py-1 mt-1" value={editing.date||''} onChange={(e)=>setEditing({...editing, date: e.target.value})} />
            </label>
            <label className="block mb-1">Description
              <textarea className="w-full border rounded px-2 py-1 mt-1" value={editing.description||''} onChange={(e)=>setEditing({...editing, description: e.target.value})} />
            </label>

            <div className="mt-2">
              <div className="text-sm font-medium">Attach image (upload)</div>
              <input type="file" accept="image/*" onChange={onFileChange} className="mt-1" />
              {fileDataUrl && (
                <div className="mt-2">
                  <img src={fileDataUrl} className="w-full h-28 object-cover rounded" />
                  <div className="flex gap-2 mt-2">
                    <button onClick={attachImageToEditing} className="bg-blue-600 text-white px-3 py-1 rounded">Attach</button>
                    <button onClick={()=>setFileDataUrl(null)} className="px-3 py-1 rounded border">Cancel</button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <button onClick={()=>update(editing)} className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
              <button onClick={()=>setEditing(null)} className="px-3 py-1 rounded border">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
