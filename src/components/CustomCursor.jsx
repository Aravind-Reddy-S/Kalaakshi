import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    if (!isFinePointer) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mx = -100, my = -100, rx = -100, ry = -100;
    let hasMoved = false;
    let animId;

    cursor.style.opacity = '0';
    ring.style.opacity = '0';

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        rx = mx;
        ry = my;
        cursor.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };

    const cursorLoop = () => {
      if (hasMoved) {
        cursor.style.left = mx + 'px';
        cursor.style.top = my + 'px';
        rx += (mx - rx) * 0.11;
        ry += (my - ry) * 0.11;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
      }
      animId = requestAnimationFrame(cursorLoop);
    };

    window.addEventListener('mousemove', onMouseMove);
    animId = requestAnimationFrame(cursorLoop);

    const onMouseEnter = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.8)';
      ring.style.opacity = '0';
    };

    const onMouseLeave = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.opacity = '1';
    };

    const attachHoverListeners = () => {
      const hoverables = document.querySelectorAll('a, button, .gallery-item, .offering-card, .kala-card, .btn-primary, .btn-secondary');
      hoverables.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });
      return hoverables;
    };

    const hoverables = attachHoverListeners();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
      hoverables.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div className="cursor" id="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" id="cursorRing" ref={ringRef}></div>
    </>
  );
}
