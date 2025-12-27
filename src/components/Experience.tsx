import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float, Stars } from '@react-three/drei';
import { useScroll } from '@react-three/drei';

export default function Experience() {
  const meshRef = useRef<any>(null);
  const scroll = useScroll(); // Access scroll data (0 to 1)

  useFrame((state, delta) => {
    // ROTATION: Spin the object based on scroll position
    // scroll.offset is a value between 0 (top) and 1 (bottom)
    if (meshRef.current) {
      meshRef.current.rotation.y = scroll.offset * Math.PI * 4; // Spin 2 full turns
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <>
      {/* LIGHTING & ATMOSPHERE */}
      <color attach="background" args={['#050505']} />
      <Environment preset="city" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* FLOAT ANIMATION (Idle movement) */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        
        {/* THE "BLENDER" OBJECT: A Winter Crystal */}
        <mesh ref={meshRef} position={[2, 0, 0]} scale={1.5}>
          {/* Complex shape to catch light (replace with useGLTF for real blender model) */}
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          
          {/* GLASS/ICE MATERIAL (Shopify Winter Style) */}
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={2}
            roughness={0}
            chromaticAberration={0.2}
            anisotropy={1}
            distortion={1}
            distortionScale={1}
            temporalDistortion={0.5}
            color="#aaddff" // Icy Blue tint
            bg="black"
          />
        </mesh>

      </Float>
    </>
  );
}
