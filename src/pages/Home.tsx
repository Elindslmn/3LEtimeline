import React from 'react'
import Timeline from '../components/Timeline'

export default function Home({events}:{events:any[]}){
  return (
    <div>
      <Timeline events={events} />
    </div>
  )
}
