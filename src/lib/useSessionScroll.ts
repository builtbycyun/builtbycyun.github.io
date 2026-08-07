import { useEffect, useRef } from 'react';

interface UseSessionScrollProps {
  /** False once the scripted tour is over and the visitor owns the prompt. */
  active: boolean;
  isRunningRef: React.MutableRefObject<boolean>;
  hasNewContentRef: React.MutableRefObject<boolean>;
  advance: () => void;
}

// Pause required between reading fresh output and sending the next prompt, so
// wheel momentum can't fire off turns the visitor never asked for.
const COOLDOWN_MS = 600;

/**
 * Drives the scripted session from scroll, touch, and keyboard. While the tour
 * is running, a downward gesture at the bottom of the transcript sends the next
 * prompt instead of scrolling past the end. Once it's over the hook goes quiet
 * and the page scrolls (and types) normally.
 */
export const useSessionScroll = ({
  active,
  isRunningRef,
  hasNewContentRef,
  advance,
}: UseSessionScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cooldownRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceRef = useRef(advance);
  advanceRef.current = advance;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const isAtBottom = (tolerance: number) =>
      el.scrollTop + el.clientHeight >= el.scrollHeight - tolerance;

    const trySend = (delay: number, bypassCooldown = false) => {
      // One gesture acknowledges freshly printed output; the next one sends.
      if (hasNewContentRef.current) {
        hasNewContentRef.current = false;
        cooldownRef.current = Date.now();
        return;
      }
      if (!bypassCooldown && Date.now() - cooldownRef.current < COOLDOWN_MS) return;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (!isRunningRef.current) advanceRef.current();
      }, delay);
    };

    const handleWheel = (e: WheelEvent) => {
      if (!active) return;
      if (e.deltaY <= 0) return; // scrolling up is always free
      if (!isAtBottom(10)) return; // still reading: normal scrolling
      e.preventDefault();
      trySend(50);
    };

    const handleTouchEnd = () => {
      if (!active) return;
      if (!isAtBottom(24)) return;
      trySend(250);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!active) return; // the composer owns the keyboard once the tour ends
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const page = el.clientHeight * 0.8;

      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        el.scrollBy({ top: e.key === 'PageUp' ? -page : -64, behavior: 'smooth' });
        return;
      }

      const isForward =
        e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ';
      if (!isForward) return;
      e.preventDefault();

      if (!isAtBottom(10)) {
        el.scrollBy({ top: e.key === 'ArrowDown' ? 64 : page, behavior: 'smooth' });
        return;
      }
      trySend(0, e.key === 'Enter'); // a deliberate Enter never waits
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [active, isRunningRef, hasNewContentRef]);

  return scrollRef;
};
