import { useEffect, useRef } from 'react';

interface UseTerminalScrollProps {
  currentSection: number;
  sectionsLength: number;
  isExecutingRef: React.MutableRefObject<boolean>;
  hasNewContentRef: React.MutableRefObject<boolean>;
  executeNextCommand: () => void;
}

// Pause required between consuming fresh output and running the next command,
// so wheel momentum can't chain commands the user didn't ask for.
const COOLDOWN_MS = 600;

export const useTerminalScroll = ({
  currentSection,
  sectionsLength,
  isExecutingRef,
  hasNewContentRef,
  executeNextCommand,
}: UseTerminalScrollProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const cooldownRef = useRef(0);
  const triggerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = terminalRef.current;
    if (!el) return;

    const isAtBottom = (tolerance: number) =>
      el.scrollTop + el.clientHeight >= el.scrollHeight - tolerance;

    const tryExecute = (delay: number, bypassCooldown = false) => {
      // One gesture acknowledges freshly printed output; the next one runs a command.
      if (hasNewContentRef.current) {
        hasNewContentRef.current = false;
        cooldownRef.current = Date.now();
        return;
      }
      if (!bypassCooldown && Date.now() - cooldownRef.current < COOLDOWN_MS) return;
      if (triggerTimeoutRef.current) clearTimeout(triggerTimeoutRef.current);
      triggerTimeoutRef.current = setTimeout(() => {
        if (!isExecutingRef.current && currentSection < sectionsLength) {
          executeNextCommand();
        }
      }, delay);
    };

    const handleWheel = (e: WheelEvent) => {
      if (currentSection >= sectionsLength) return; // tour over: normal scrolling
      if (e.deltaY <= 0) return; // scrolling up is always free
      if (!isAtBottom(10)) return; // still reading: normal scrolling
      e.preventDefault();
      tryExecute(50);
    };

    const handleTouchEnd = () => {
      if (currentSection >= sectionsLength) return;
      if (!isAtBottom(24)) return;
      tryExecute(250);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
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
      if (currentSection >= sectionsLength) return;
      tryExecute(0, e.key === 'Enter'); // a deliberate Enter never waits
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      if (triggerTimeoutRef.current) clearTimeout(triggerTimeoutRef.current);
    };
  }, [currentSection, sectionsLength, isExecutingRef, hasNewContentRef, executeNextCommand]);

  return terminalRef;
};
