'use client';

import { useState, useEffect } from 'react';
import { TypewriterProps } from '@/types';

export default function TypewriterText({
  text,
  delay = 0,
  speed = 50,
  className = '',
  onComplete,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const startTyping = setTimeout(() => {
      setIsTyping(true);
      setShowCursor(true);
    }, delay);

    return () => clearTimeout(startTyping);
  }, [delay]);

  useEffect(() => {
    if (!isTyping || currentIndex >= text.length) {
      if (currentIndex >= text.length && onComplete) {
        onComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayText(text.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, isTyping, text, speed, onComplete]);

  useEffect(() => {
    if (currentIndex >= text.length) {
      const cursorTimer = setTimeout(() => {
        setShowCursor(false);
      }, 1000);
      return () => clearTimeout(cursorTimer);
    }
  }, [currentIndex, text.length]);

  return (
    <span className={`font-mono ${className}`}>
      {displayText}
      {showCursor && (
        <span className="terminal-cursor ml-1 w-2 h-5 bg-terminal-primary animate-blink">
          |
        </span>
      )}
    </span>
  );
}