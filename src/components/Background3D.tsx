import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, Torus, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

const Background3D = () => {
  return (
    <Canvas style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Scene />
    </Canvas>
  );
};

const Scene = () => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.rotation.x += 0.001;
    }
  });

  const shapes = useMemo(() => {
    const shapeComponents = [Box, Sphere, Torus, Icosahedron];
    const colors = ['#00ffff', '#ff00ff', '#ffff00'];
    return [...Array(50)].map((_, i) => {
      const Shape = shapeComponents[Math.floor(Math.random() * shapeComponents.length)];
      return {
        id: i,
        Component: Shape,
        color: colors[Math.floor(Math.random() * colors.length)],
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40
        ),
        scale: Math.random() * 0.5 + 0.2,
      };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {shapes.map(({ id, Component, color, position, scale }) => (
        <Component key={id} position={position} scale={scale}>
          <meshStandardMaterial color={color} roughness={0} metalness={0.5} />
        </Component>
      ))}
    </group>
  );
};

export default Background3D;