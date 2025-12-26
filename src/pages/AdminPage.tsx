import React from 'react'
import Login from '../components/Login'
import AdminPanel from '../components/AdminPanel'

export default function AdminPage({events, setEvents, storageKey}:{events:any[]; setEvents:(e:any[])=>void; storageKey:string}){
  const isAuthed = sessionStorage.getItem('elind_admin_auth') === '1'

  if(!isAuthed){
    return <Login />
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Admin Dashboard</h2>
      <AdminPanel events={events} setEvents={setEvents} storageKey={storageKey} />
    </div>
  )
}
