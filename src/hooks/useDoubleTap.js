import { useRef, useCallback } from 'react';

/**
 * Distinguishes single taps from double taps with a small delay window.
 * - Double-tap (two taps within `delay` ms) fires `onDoubleTap(event)` with the tap coords.
 * - Single-tap (a tap followed by no second tap within `delay` ms) fires `onSingleTap(event)`.
 *
 * Returns a pointer-up handler to spread onto any tappable element.
 */
export function useDoubleTap({ onSingleTap, onDoubleTap, delay = 280 } = {}) {
  const timerRef = useRef(null);
  const lastTapRef = useRef(0);

  const handler = useCallback(
    (event) => {
      const now = Date.now();
      const elapsed = now - lastTapRef.current;

      if (elapsed < delay && elapsed > 0) {
        // Second tap — it's a double-tap
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        lastTapRef.current = 0;
        onDoubleTap?.(event);
        return;
      }

      // Possibly the first tap — defer single-tap fire
      lastTapRef.current = now;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onSingleTap?.(event);
        lastTapRef.current = 0;
        timerRef.current = null;
      }, delay);
    },
    [onSingleTap, onDoubleTap, delay]
  );

  return handler;
}
