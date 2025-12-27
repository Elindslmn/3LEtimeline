import React, {useMemo, useRef} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import * as THREE from 'three'

type ThemeName = 'brotherhood' | 'cyberpunk' | 'ratchet'

type AnimusSceneProps = {
  theme: ThemeName
  years: number[]
  activeYear: number | null
  onSelectYear: (year: number) => void
}

const THEME_COLORS: Record<ThemeName, {primary: string; glow: string; grid: string}> = {
  brotherhood: {primary: '#d20000', glow: '#ff3b3b', grid: '#d7d7d7'},
  cyberpunk: {primary: '#00ff41', glow: '#7f00ff', grid: '#1a1a1a'},
  ratchet: {primary: '#ff8c1a', glow: '#00c3ff', grid: '#244d7a'}
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
    const radius = 0.45
    const targetHeight = 4.8
    const spacing = years.length > 1 ? targetHeight / (years.length - 1) : 0
    const mid = (years.length - 1) / 2
    return years.map((year, index) => {
      const t = index * 0.6
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
      group.current.rotation.y += 0.006
    }
  })

  return (
    <group ref={group} position={[-1.6, 0, 0]}>
      {nodes.map((node, index) => {
        const isActive = node.year === activeYear
        const scale = isActive ? 1.2 : 1
        return (
          <group key={node.year} position={[0, 0, 0]}>
            <mesh
              position={node.posLeft}
              scale={scale}
              onClick={() => onSelectYear(node.year)}
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
            {index % 3 === 0 && (
              <mesh position={[node.posLeft[0] * 1.6, node.posLeft[1], node.posLeft[2] * 1.4]}>
                <sphereGeometry args={[0.03, 12, 12]} />
                <meshStandardMaterial color={primary} opacity={0.5} transparent />
              </mesh>
            )}
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
  return (
    <div className="helix-canvas">
      <Canvas camera={{position: [0, 0, 4.6], fov: 35}}>
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 4, 4]} intensity={1.2} />
        <DNAHelix theme={theme} years={years} activeYear={activeYear} onSelectYear={onSelectYear} />
        <WireGrid theme={theme} />
      </Canvas>
    </div>
  )
}
