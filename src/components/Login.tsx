import React, {useState} from 'react'

export default function Login(){
  const [pass, setPass] = useState('')
  const adminPass = import.meta.env.VITE_ADMIN_PASS || 'admin'

  function submit(e:React.FormEvent){
    e.preventDefault()
    if(pass === adminPass){
      sessionStorage.setItem('elind_admin_auth','1')
      location.href = '/admin'
    } else {
      alert('Wrong password')
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-medium mb-3">Admin Login</h2>

      <div className="text-sm text-gray-600 mb-3">
        Use the local password below. Set `VITE_ADMIN_PASS` in Vercel Environment Variables to change it.
      </div>

      <div className="border-t pt-3">
        <form onSubmit={submit} className="flex flex-col gap-2">
          <input type="password" placeholder="password" value={pass} onChange={(e)=>setPass(e.target.value)} className="border rounded px-2 py-1" />
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-3 py-1 rounded">Login (local)</button>
            <button type="button" onClick={()=>{ alert('Default password is "admin" if not set in environment variable VITE_ADMIN_PASS') }} className="px-3 py-1 rounded border">Help</button>
          </div>
        </form>
      </div>
    </div>
  )
}
