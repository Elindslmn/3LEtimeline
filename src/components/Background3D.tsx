import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, Torus, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

declare global {
  interface Window {
    CANNON: any;
  }
}

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
  const world = useMemo(() => {
    if (window.CANNON) {
      const w = new window.CANNON.World();
      w.gravity.set(0, 0, 0);
      return w;
    }
    return null;
  }, []);

  const shapes = useMemo(() => {
    const shapeComponents = [Box, Sphere, Torus, Icosahedron];
    const colors = ['#00ffff', '#ff00ff', '#ffff00'];
    return [...Array(50)].map((_, i) => {
      const Shape = shapeComponents[Math.floor(Math.random() * shapeComponents.length)];
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      );
      const scale = Math.random() * 0.5 + 0.2;
      const body = new window.CANNON.Body({
        mass: 1,
        position: new window.CANNON.Vec3(position.x, position.y, position.z),
        shape: new window.CANNON.Sphere(scale),
      });
      world?.addBody(body);
      return {
        id: i,
        Component: Shape,
        color: colors[Math.floor(Math.random() * colors.length)],
        position,
        scale,
        body,
      };
    });
  }, [world]);

  useFrame(() => {
    world?.step(1 / 60);
    shapes.forEach((shape) => {
      shape.position.copy(shape.body.position);
    });
  });

  const handleClick = (body) => {
    const force = new window.CANNON.Vec3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );
    body.applyLocalForce(force, new window.CANNON.Vec3(0, 0, 0));
  };

  return (
    <group>
      {shapes.map(({ id, Component, color, position, scale, body }) => (
        <Component
          key={id}
          position={position}
          scale={scale}
          onClick={() => handleClick(body)}
        >
          <meshStandardMaterial color={color} roughness={0} metalness={0.5} wireframe />
        </Component>
      ))}
    </group>
  );
};

export default Background3D;
