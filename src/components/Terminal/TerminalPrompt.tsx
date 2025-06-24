'use client';

import { useState, useEffect } from 'react';

interface TerminalPromptProps {
  path?: string;
  command?: string;
  delay?: number;
  onCommandComplete?: () => void;
  className?: string;
}

export default function TerminalPrompt({
  path = '~',
  command = '',
  delay = 0,
  onCommandComplete,
  className = '',
}: TerminalPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [displayCommand, setDisplayCommand] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingCommand, setIsTypingCommand] = useState(false);

  const promptText = `user@portfolio:${path}$ `;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true);
      if (command) {
        setTimeout(() => setIsTypingCommand(true), 300);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, command]);

  useEffect(() => {
    if (!isTypingCommand || !command || currentIndex >= command.length) {
      if (currentIndex >= command.length && onCommandComplete) {
        setTimeout(onCommandComplete, 500);
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayCommand(command.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, 80);

    return () => clearTimeout(timer);
  }, [currentIndex, isTypingCommand, command, onCommandComplete]);

  if (!showPrompt) return null;

  return (
    <div className={`flex items-center mb-2 ${className}`}>
      <span className="text-terminal-primary font-medium">
        <span className="text-terminal-secondary">user@portfolio</span>
        :
        <span className="text-terminal-primary">{path}</span>
        $ 
      </span>
      <span className="ml-1 text-terminal-white">
        {displayCommand}
        {isTypingCommand && currentIndex < command.length && (
          <span className="terminal-cursor animate-blink">|</span>
        )}
      </span>
    </div>
  );
}