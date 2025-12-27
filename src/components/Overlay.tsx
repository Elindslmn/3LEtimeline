import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Scroll, useScroll } from '@react-three/drei';

type OverlayProps = {
  children: ReactNode;
};

export default function Overlay({ children }: OverlayProps) {
  const scroll = useScroll();
  const rootRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    if (!rootRef.current) return;
    const slow = scroll.offset * 40;
    const mid = scroll.offset * 70;
    const fast = scroll.offset * 110;
    rootRef.current.style.setProperty('--parallax-slow', `${slow}px`);
    rootRef.current.style.setProperty('--parallax-mid', `${mid}px`);
    rootRef.current.style.setProperty('--parallax-fast', `${fast}px`);
  });

  return (
    <Scroll html style={{ width: '100%' }}>
      <div ref={rootRef} className="overlay-root">
        {children}
      </div>
    </Scroll>
  );
}
