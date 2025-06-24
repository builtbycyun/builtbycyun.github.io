'use client';

import { useState } from 'react';
import { TerminalSectionProps } from '@/types';
import TerminalPrompt from './TerminalPrompt';
import ScrollObserver from '../ui/ScrollObserver';

export default function TerminalSection({
  command,
  delay = 0,
  children,
  className = '',
}: TerminalSectionProps) {
  const [showOutput, setShowOutput] = useState(false);

  const handleCommandComplete = () => {
    setShowOutput(true);
  };

  return (
    <ScrollObserver 
      className={`terminal-section ${className}`}
      delay={delay / 1000}
    >
      <div className="space-y-2">
        <TerminalPrompt
          command={command}
          delay={delay}
          onCommandComplete={handleCommandComplete}
        />
        
        {showOutput && (
          <div className="terminal-output pl-4 border-l-2 border-terminal-dim">
            {children}
          </div>
        )}
      </div>
    </ScrollObserver>
  );
}