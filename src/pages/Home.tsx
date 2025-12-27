import React from 'react'
import Timeline from '../components/Timeline'
import AnimusScene from '../components/AnimusScene'

type HomeProps = {
  events: any[]
  years: number[]
  activeYear: number | null
  onSelectYear: (year: number) => void
}

export default function Home({events, years, activeYear, onSelectYear}: HomeProps){
  const totalEvents = events.length
  const totalYears = years.length
  const startYear = years[0] ?? 1995
  const endYear = years[years.length - 1] ?? startYear
  const focusYear = activeYear ?? startYear

  return (
    <div className="home-shell">
      <section id="about" className="hero">
        <div className="hero-copy">
          <p className="hero-kicker">Animus // Memory Stream</p>
          <h1 className="hero-title">Elind Timeline</h1>
          <p className="hero-subtitle">
            Curated memory stream from {startYear}-{endYear}. Dive into the index or enter the helix to sync.
          </p>
          <div className="hero-actions">
            <a className="cta-button" href="#timeline">Open Timeline</a>
            <a className="cta-button ghost" href="#animus">Enter Helix</a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-label">Years Indexed</span>
            <span className="stat-value">{totalYears || 0}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Events Logged</span>
            <span className="stat-value">{totalEvents || 0}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Focus Year</span>
            <span className="stat-value">{focusYear}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Sync Rate</span>
            <span className="stat-value">98.4%</span>
          </div>
        </div>
      </section>

      <section id="timeline" className="timeline-section">
        <div className="section-head">
          <div>
            <p className="section-kicker">Memory Index</p>
            <h2 className="section-title">Timeline Archive</h2>
          </div>
          <p className="section-meta">Click a year to reveal its events. Use the helix to jump.</p>
        </div>
        <Timeline events={events} activeYear={activeYear} onSelectYear={onSelectYear} />
      </section>

      <section id="animus" className="animus-section">
        <div className="section-head section-head--center">
          <div>
            <p className="section-kicker">Helix Interface</p>
            <h2 className="section-title">Sequence Navigator</h2>
          </div>
          <p className="section-meta">Click any node to sync the timeline below.</p>
        </div>
        <AnimusScene years={years} activeYear={activeYear} onSelectYear={onSelectYear} />
      </section>
    </div>
  )
}
