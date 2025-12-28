import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

const DNA = () => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const strands = [...Array(100)].map((_, i) => {
    const angle = (i / 100) * Math.PI * 10;
    const y = (i / 100) * 20 - 10;
    return {
      p1: new THREE.Vector3(Math.cos(angle) * 2, y, Math.sin(angle) * 2),
      p2: new THREE.Vector3(Math.cos(angle + Math.PI) * 2, y, Math.sin(angle + Math.PI) * 2),
    };
  });

  return (
    <group ref={groupRef}>
      {strands.map(({ p1, p2 }, i) => (
        <React.Fragment key={i}>
          <Sphere args={[0.1, 16, 16]} position={p1}>
            <meshStandardMaterial color="#00ffff" />
          </Sphere>
          <Sphere args={[0.1, 16, 16]} position={p2}>
            <meshStandardMaterial color="#ff00ff" />
          </Sphere>
        </React.Fragment>
      ))}
    </group>
  );
};

export default DNA;
