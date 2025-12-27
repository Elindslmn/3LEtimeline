import React from 'react'

type HomeProps = {
  events: any[]
  activeYear: number | null
  onSelectYear: (year: number) => void
}

export default function Home({events, activeYear, onSelectYear}: HomeProps){
  return (
    <div className="home-shell">
      <section id="about" className="about-panel">
        <h3>About</h3>
        <p>
          Timeline personale in stile Animus. Seleziona una sequenza dal tunnel a sinistra.
        </p>
      </section>
    </div>
  )
}
