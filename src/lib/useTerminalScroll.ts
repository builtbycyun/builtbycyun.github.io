import { useEffect, useRef } from 'react';

interface UseTerminalScrollProps {
  currentSection: number;
  sectionsLength: number;
  hasNewContent: boolean;
  isAtBottom: boolean;
  setIsAtBottom: (value: boolean) => void;
  setHasNewContent: (value: boolean) => void;
  executeNextCommand: () => void;
  isExecutingRef: React.MutableRefObject<boolean>;
  scrollTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

export const useTerminalScroll = ({
  currentSection,
  sectionsLength,
  hasNewContent,
  isAtBottom,
  setIsAtBottom,
  setHasNewContent,
  executeNextCommand,
  isExecutingRef,
  scrollTimeoutRef,
}: UseTerminalScrollProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (e: WheelEvent | TouchEvent) => {
      // If all sections are complete, allow normal scrolling
      if (currentSection >= sectionsLength) {
        return; // Let default scroll behavior happen
      }
      
      let deltaY = 0;
      
      // Handle both wheel and touch events
      if (e.type === 'wheel') {
        deltaY = (e as WheelEvent).deltaY;
      } else if (e.type === 'touchmove') {
        // For touch, we'll handle this differently - let it scroll naturally
        return;
      }
      
      // Allow normal upward scrolling
      if (deltaY < 0) {
        return; // Let default scroll behavior happen
      }
      
      // Check if we're at the bottom after new content
      const terminalElement = terminalRef.current;
      if (terminalElement) {
        const { scrollTop, scrollHeight, clientHeight } = terminalElement;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px tolerance
        setIsAtBottom(atBottom);
        
        // If there's new content and we're not at bottom, allow normal scrolling
        if (hasNewContent && !atBottom) {
          return; // Let default scroll behavior happen
        }
      }
      
      // Prevent downward scrolling and handle command execution (only for wheel events)
      if (deltaY > 0 && e.type === 'wheel') {
        e.preventDefault();
        
        // If we just reached the bottom of new content, clear the flag
        if (hasNewContent && isAtBottom) {
          setHasNewContent(false);
        }
        
        // Debounce rapid scroll events
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        scrollTimeoutRef.current = setTimeout(() => {
          // Only execute if not currently executing, there are more sections, and no new content to scroll through
          if (!isExecutingRef.current && currentSection < sectionsLength && !hasNewContent) {
            executeNextCommand();
          }
        }, 50); // 50ms debounce
      }
    };

    // Handle touch scrolling separately for mobile
    const handleTouchEnd = () => {
      const terminalElement = terminalRef.current;
      if (terminalElement) {
        const { scrollTop, scrollHeight, clientHeight } = terminalElement;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 20; // Larger tolerance for touch
        setIsAtBottom(atBottom);
        
        // If we're at bottom and no new content, allow next command
        if (atBottom && !hasNewContent && !isExecutingRef.current && currentSection < sectionsLength) {
          // Small delay to prevent accidental triggers
          setTimeout(() => {
            if (!isExecutingRef.current && currentSection < sectionsLength && !hasNewContent) {
              executeNextCommand();
            }
          }, 300);
        }
        
        // Clear new content flag if at bottom
        if (hasNewContent && atBottom) {
          setHasNewContent(false);
        }
      }
    };

    const terminalElement = terminalRef.current;
    if (terminalElement) {
      // Desktop scroll handling
      terminalElement.addEventListener('wheel', handleScroll, { passive: false });
      
      // Mobile touch handling
      terminalElement.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        terminalElement.removeEventListener('wheel', handleScroll);
        terminalElement.removeEventListener('touchend', handleTouchEnd);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [currentSection, sectionsLength, hasNewContent, isAtBottom, setIsAtBottom, setHasNewContent, executeNextCommand, isExecutingRef, scrollTimeoutRef]);

  return terminalRef;
};