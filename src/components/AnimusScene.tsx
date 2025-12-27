import React, {useMemo, useRef} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import {Html} from '@react-three/drei'
import * as THREE from 'three'

type ThemeName = 'brotherhood' | 'cyberpunk' | 'ratchet'

type AnimusSceneProps = {
  theme: ThemeName
  years: number[]
  activeYear: number | null
  onSelectYear: (year: number) => void
}

const THEME_COLORS: Record<ThemeName, {primary: string; glow: string; grid: string; fog: string}> = {
  brotherhood: {primary: '#d20000', glow: '#ff3b3b', grid: '#d7d7d7', fog: '#f3f3f3'},
  cyberpunk: {primary: '#00ff41', glow: '#7f00ff', grid: '#1a1a1a', fog: '#050505'},
  ratchet: {primary: '#ff8c1a', glow: '#00c3ff', grid: '#244d7a', fog: '#0c1b33'}
}

type HelixNode = {
  year: number
  posLeft: [number, number, number]
  posRight: [number, number, number]
}

function DNAHelix({theme, years, activeYear, onSelectYear}: AnimusSceneProps) {
  const group = useRef<THREE.Group>(null)
  const {primary, glow} = THEME_COLORS[theme]
  const nodes = useMemo<HelixNode[]>(() => {
    if (years.length === 0) return []
    const radius = 0.6
    const targetHeight = 5.4
    const spacing = years.length > 1 ? targetHeight / (years.length - 1) : 0
    const mid = (years.length - 1) / 2
    return years.map((year, index) => {
      const t = index * 0.7
      const x = Math.cos(t) * radius
      const z = Math.sin(t) * radius
      const y = (index - mid) * spacing
      return {
        year,
        posLeft: [x, y, z],
        posRight: [-x, y, -z]
      }
    })
  }, [years])

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.0045
    }
  })

  const activeIndex = activeYear ? years.indexOf(activeYear) : 0

  return (
    <group ref={group} position={[-1.15, 0, 0]} rotation={[0.12, 0.5, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 6, 24]} />
        <meshStandardMaterial color={primary} emissive={glow} emissiveIntensity={0.4} opacity={0.4} transparent />
      </mesh>
      {nodes.map((node, index) => {
        const isActive = node.year === activeYear
        const dist = Math.abs(index - activeIndex)
        const scale = isActive ? 1.25 : Math.max(0.75, 1 - dist * 0.08)
        const opacity = Math.max(0.25, 1 - dist * 0.15)
        const blur = Math.min(8, dist * 1.6)
        return (
          <group key={node.year} position={[0, 0, 0]}>
            <mesh
              position={node.posLeft}
              scale={scale}
              onClick={() => onSelectYear(node.year)}
              castShadow
            >
              <sphereGeometry args={[0.08, 24, 24]} />
              <meshStandardMaterial
                color={primary}
                emissive={glow}
                emissiveIntensity={isActive ? 1.2 : 0.4}
              />
            </mesh>
            <mesh
              position={node.posRight}
              scale={scale}
              onClick={() => onSelectYear(node.year)}
              castShadow
            >
              <sphereGeometry args={[0.08, 24, 24]} />
              <meshStandardMaterial
                color={primary}
                emissive={glow}
                emissiveIntensity={isActive ? 1.2 : 0.3}
              />
            </mesh>
            <mesh
              position={[0, node.posLeft[1], 0]}
              rotation={[0, 0, Math.PI / 2]}
              scale={[1, 1, 1]}
            >
              <cylinderGeometry args={[0.01, 0.01, Math.abs(node.posLeft[0]) * 2, 12]} />
              <meshStandardMaterial color={primary} opacity={0.6} transparent />
            </mesh>
            <Html
              position={[node.posLeft[0] * 1.15, node.posLeft[1], node.posLeft[2] * 1.1]}
              transform
              distanceFactor={1.5}
              center
            >
              <div
                className={`helix-card3d${isActive ? ' is-active' : ''}`}
                style={{
                  opacity,
                  filter: `blur(${blur}px)`,
                  transform: `scale(${scale})`,
                  animationDelay: `${index * 0.12}s`
                }}
              >
                <div className="helix-card3d-header">
                  <span className="helix-card3d-year">{node.year}</span>
                  <span className="helix-card3d-status">{isActive ? 'SYNCED' : 'LOCKED'}</span>
                </div>
                <div className="helix-card3d-meta">SEQ. {node.year} // MEMORY START</div>
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

function WireGrid({theme}: {theme: ThemeName}) {
  const {grid} = THEME_COLORS[theme]
  return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, -2]}>
        <planeGeometry args={[12, 12, 24, 24]} />
      <meshBasicMaterial color={grid} wireframe opacity={0.35} transparent />
      </mesh>
  )
}

export default function AnimusScene({theme, years, activeYear, onSelectYear}: AnimusSceneProps) {
  const {fog} = THEME_COLORS[theme]
  return (
    <div className="helix-canvas">
      <Canvas shadows camera={{position: [0.2, 0, 4.4], fov: 36}}>
        <fog attach="fog" args={[fog, 2.4, 7.5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 4, 4]} intensity={1.4} castShadow />
        <pointLight position={[-2, -2, 3]} intensity={0.8} />
        <spotLight position={[2, -3, 4]} intensity={0.6} angle={0.6} penumbra={0.8} />
        <DNAHelix theme={theme} years={years} activeYear={activeYear} onSelectYear={onSelectYear} />
        <WireGrid theme={theme} />
      </Canvas>
    </div>
  )
}
