import React, {useState, useEffect} from 'react'
import netlifyIdentity from 'netlify-identity-widget'

export default function Login(){
  const [pass, setPass] = useState('')
  const adminPass = import.meta.env.VITE_ADMIN_PASS || 'admin'
  const [netlifyAvailable, setNetlifyAvailable] = useState<boolean | null>(null)

  useEffect(()=>{
    let cancelled = false

    // Detect Netlify Identity by probing the settings endpoint.
    // On non-Netlify hosts (ex: Vercel) this will fail or return HTML.
    const checkNetlifyIdentity = async () => {
      if (typeof window === 'undefined') return
      try{
        const res = await fetch('/.netlify/identity/settings', {
          headers: {Accept: 'application/json'}
        })
        if(!res.ok) throw new Error('Netlify Identity unavailable')
        const data = await res.json()
        if(!data?.site_id) throw new Error('Netlify Identity not enabled')
        if(!cancelled) setNetlifyAvailable(true)
      }catch(e){
        if(!cancelled) setNetlifyAvailable(false)
      }
    }

    checkNetlifyIdentity()

    return ()=>{
      cancelled = true
    }
  }, [])

  useEffect(()=>{
    if(!netlifyAvailable) return

    netlifyIdentity.on('login', (user:any)=>{
      try{
        user.close && user.close()
      }catch(e){}
      sessionStorage.setItem('elind_admin_auth','1')
      sessionStorage.setItem('elind_admin_netlify_user', JSON.stringify(user))
      location.href = '/admin'
    })
    netlifyIdentity.on('logout', ()=>{
      sessionStorage.removeItem('elind_admin_auth')
      sessionStorage.removeItem('elind_admin_netlify_user')
    })
    return ()=>{
      try{
        netlifyIdentity.off('login')
        netlifyIdentity.off('logout')
      }catch(e){}
    }
  }, [netlifyAvailable])

  function openNetlifyModal(){
    if(!netlifyAvailable){
      alert('Netlify Identity is not available on this host. Use local login below or deploy to Netlify and enable Identity.')
      return
    }
    try{
      netlifyIdentity.open()
    }catch(e){
      alert('Netlify Identity not available. Ensure you deployed to Netlify and enabled Identity for this site.')
    }
  }

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

      <div className="flex flex-col gap-3 mb-3">
        {netlifyAvailable !== false && (
          <button
            onClick={openNetlifyModal}
            className="bg-indigo-600 text-white px-3 py-2 rounded disabled:opacity-60"
            disabled={netlifyAvailable === null}
          >
            {netlifyAvailable === null ? 'Checking Netlify Identity...' : 'Login with Netlify Identity'}
          </button>
        )}
        <div className="text-sm text-gray-600">
          {netlifyAvailable === false
            ? 'Netlify Identity is not available on this host (e.g. Vercel). Use local login below or deploy to Netlify and enable Identity.'
            : 'If you host on Netlify, enable Identity and invite a user to access the admin.'}
        </div>
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
