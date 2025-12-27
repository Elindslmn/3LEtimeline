// App.jsx
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import Experience from './components/Experience';
import Overlay from './components/Overlay';

export default function App() {
  return (
    <div className="h-screen w-full bg-black">
      {/* 1. THE 3D CANVAS */}
      <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
        
        {/* 2. SCROLL CONTROLS WRAPPER */}
        {/* "pages={2}" means the scrollable area is 200% of the viewport height */}
        <ScrollControls pages={2} damping={0.2}>
          
          {/* The 3D Scene (moves with scroll) */}
          <Experience />
          
          {/* The HTML Overlay (scrolls naturally) */}
          <Overlay />
          
        </ScrollControls>
      </Canvas>
    </div>
  );
}
