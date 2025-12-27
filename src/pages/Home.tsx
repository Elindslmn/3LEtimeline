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
  const activeIndex = years.length > 0 && activeYear != null ? years.indexOf(activeYear) : 0
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0
  const axisCount = Math.min(5, Math.max(1, years.length))
  const startIndex = years.length > 0
    ? Math.max(0, Math.min(safeActiveIndex - Math.floor(axisCount / 2), years.length - axisCount))
    : 0
  const axisYears = years.length > 0 ? years.slice(startIndex, startIndex + axisCount) : [focusYear]
  const axisStep = axisCount > 1 ? 80 / (axisCount - 1) : 0
  const axisNodes = axisYears.map((year, index) => {
    const pos = `${10 + index * axisStep}%`
    const depth = `${(index - Math.floor(axisCount / 2)) * 18 + 24}px`
    return {
      year,
      pos,
      depth,
      isActive: year === activeYear
    }
  })

  const stepYear = (delta: number) => {
    if (years.length === 0) return
    const nextIndex = Math.max(0, Math.min(safeActiveIndex + delta, years.length - 1))
    onSelectYear(years[nextIndex])
  }

  return (
    <div className="home-shell">
      <section id="about" className="hero">
        <div className="hero-copy parallax-slow">
          <p className="hero-kicker">System Ready // Animus Helix</p>
          <h1 className="hero-title">
            Elind <span className="hero-title-accent">Timeline</span>
          </h1>
          <p className="hero-subtitle">
            Curated memory stream from {startYear}-{endYear}. Select a node on the rail to jump or dive into the helix to sync.
          </p>
          <div className="hero-actions">
            <a className="cta-button" href="#timeline">Explore Archives</a>
            <a className="cta-button ghost" href="#animus">Enter Helix</a>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-rail parallax-fast">
            <div className="rail-line" aria-hidden="true" />
            {axisNodes.map((node) => (
              <button
                type="button"
                key={node.year}
                className={`rail-node${node.isActive ? ' is-highlight' : ''}`}
                style={{'--pos': node.pos, '--depth': node.depth} as React.CSSProperties}
                onClick={() => onSelectYear(node.year)}
                aria-pressed={node.isActive}
                title={`Go to ${node.year}`}
              >
                <span className="rail-node-label">{node.year}</span>
              </button>
            ))}
          </div>
          <div className="axis-controls">
            <button
              type="button"
              className="axis-control"
              onClick={() => stepYear(-1)}
              disabled={safeActiveIndex <= 0}
            >
              Prev year
            </button>
            <button
              type="button"
              className="axis-control"
              onClick={() => stepYear(1)}
              disabled={safeActiveIndex >= years.length - 1}
            >
              Next year
            </button>
          </div>
          <div className="hero-stats parallax-mid">
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
