import React from 'react'
import Timeline from '../components/Timeline'

type HomeProps = {
  events: any[]
  activeYear: number | null
  onSelectYear: (year: number) => void
}

export default function Home({events, activeYear, onSelectYear}: HomeProps){
  return (
    <div className="home-shell">
      <Timeline events={events} activeYear={activeYear} onSelectYear={onSelectYear} />
      <section id="about" className="about-panel">
        <h3>About</h3>
        <p>
          Timeline personale in stile Animus. Seleziona una sequenza per sincronizzare i ricordi.
        </p>
      </section>
    </div>
  )
}
