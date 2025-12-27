import React, {useEffect, useState} from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({x: 0, y: 0})
  const [clicked, setClicked] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const supportsFinePointer = window.matchMedia('(pointer: fine)').matches
    setEnabled(supportsFinePointer)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const handleMove = (event: MouseEvent) => {
      setPosition({x: event.clientX, y: event.clientY})
    }
    const handleDown = () => setClicked(true)
    const handleUp = () => setClicked(false)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      className={`custom-cursor${clicked ? ' is-clicked' : ''}`}
      style={{left: position.x, top: position.y}}
    >
      <span className="cursor-ring" />
      <span className="cursor-dot" />
    </div>
  )
}
