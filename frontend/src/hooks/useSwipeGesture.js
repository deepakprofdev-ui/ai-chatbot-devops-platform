/**
 * useSwipeGesture.js
 * Detects horizontal swipe gestures for opening/closing the mobile sidebar.
 */

import { useRef, useEffect } from 'react';

export function useSwipeGesture({ onSwipeLeft, onSwipeRight, enabled = true, edgeOnly = false, edgeWidth = 24 }) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX    = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e) => {
      const x = e.touches[0].clientX;
      if (edgeOnly && x > edgeWidth) return; // only trigger from screen edge
      touchStartX.current = x;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (!touchStartX.current || !touchEndX.current) return;

      const deltaX = touchEndX.current - touchStartX.current;
      const absX   = Math.abs(deltaX);

      // Require a deliberate horizontal swipe (avoid accidental vertical scroll triggers)
      if (absX > 60) {
        if (deltaX < 0) onSwipeLeft?.();
        else             onSwipeRight?.();
      }

      touchStartX.current = 0;
      touchEndX.current   = 0;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, onSwipeLeft, onSwipeRight, edgeOnly, edgeWidth]);
}