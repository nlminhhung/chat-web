'use client';

import { useState, useEffect, useRef } from 'react';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isMobile) {
    return null;
  }
  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 255, 255, 0.7)',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
      }}
    />
  );
};
