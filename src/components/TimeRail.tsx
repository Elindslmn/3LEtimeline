import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Vector3, CatmullRomCurve3 } from 'three'

const TimeRail = ({ years, activeYear, onSelectYear }) => {
  const curve = useMemo(() => {
    const points = [
      new Vector3(-5, -3, 0),
      new Vector3(0, 0, 0),
      new Vector3(5, 3, 0),
    ];
    return new CatmullRomCurve3(points);
  }, []);

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Tube curve={curve} />
      {years.map((year, index) => (
        <Orb
          key={year}
          position={curve.getPointAt(index / (years.length - 1))}
          year={year}
          isActive={year === activeYear}
          onClick={() => onSelectYear(year)}
        />
      ))}
      <CameraRig curve={curve} activeYear={activeYear} years={years} />
    </Canvas>
  );
};

const Tube = ({ curve }) => {
  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.1, 8, false]} />
      <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={2} />
    </mesh>
  );
};

const Orb = ({ position, year, isActive, onClick }) => {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.lookAt(0, 0, 0);
    }
  });

  return (
    <group position={position} ref={ref}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={isActive ? 'white' : 'cyan'}
          emissive={isActive ? 'white' : 'cyan'}
          emissiveIntensity={isActive ? 4 : 1}
        />
      </mesh>
      <text
        value={year.toString()}
        position={[0, 0.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {year}
      </text>
    </group>
  );
};

const CameraRig = ({ curve, activeYear, years }) => {
  const cameraRef = useRef();
  useFrame((state) => {
    if (cameraRef.current) {
      const activeIndex = years.indexOf(activeYear);
      if (activeIndex !== -1) {
        const t = activeIndex / (years.length - 1);
        const position = curve.getPointAt(t);
        const lookAt = curve.getPointAt(t + 0.01);
        state.camera.position.lerp(position.add(new Vector3(0, 0, 5)), 0.05);
        state.camera.lookAt(lookAt);
      }
    }
  });
  return null;
};

export default TimeRail;
