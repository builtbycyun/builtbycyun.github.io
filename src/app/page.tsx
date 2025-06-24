'use client';

import { useState, useEffect, useRef } from 'react';
import { terminalSections } from '../lib/terminalSections';
import { useTerminalScroll } from '../lib/useTerminalScroll';

interface TerminalLine {
  id: string;
  type: 'prompt' | 'command' | 'output' | 'loading';
  content: string;
  delay?: number;
}

export default function TerminalPortfolio() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isExecutingRef = useRef(false);
  const [hasNewContent, setHasNewContent] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const terminalRef = useTerminalScroll({
    currentSection,
    sectionsLength: terminalSections.length,
    hasNewContent,
    isAtBottom,
    setIsAtBottom,
    setHasNewContent,
    executeNextCommand,
    isExecutingRef,
    scrollTimeoutRef,
  });

  useEffect(() => {
    // Initial terminal setup
    addLine('prompt', 'user@portfolio:~$ ');
  }, []);

  const addLine = (type: TerminalLine['type'], content: string, delay = 0) => {
    setTimeout(() => {
      setLines(prev => [...prev, {
        id: Math.random().toString(36),
        type,
        content,
        delay
      }]);
    }, delay);
  };

  async function executeNextCommand() {
    if (currentSection >= terminalSections.length || isExecutingRef.current) return;
    
    isExecutingRef.current = true;
    const section = terminalSections[currentSection];
    
    // Type the command
    await typeCommand(section.command);
    
    // Show loading
    addLine('loading', 'Loading...');
    
    // Wait for loading simulation
    setTimeout(() => {
      // Remove loading line and add output
      setLines(prev => prev.slice(0, -1));
      addLine('output', section.content());
      
      // Mark that we have new content to scroll through
      setHasNewContent(true);
      setIsAtBottom(false);
      
      // Add new prompt
      setTimeout(() => {
        addLine('prompt', 'user@portfolio:~$ ');
        setCurrentSection(prev => prev + 1);
        isExecutingRef.current = false;
      }, 500);
    }, 800 + Math.random() * 700); // Random loading time between 800-1500ms
  }

  const typeCommand = (command: string): Promise<void> => {
    return new Promise((resolve) => {
      let i = 0;
      const typeChar = () => {
        if (i <= command.length) {
          setLines(prev => {
            const newLines = [...prev];
            const lastLine = newLines[newLines.length - 1];
            if (lastLine && lastLine.type === 'prompt') {
              lastLine.content = `user@portfolio:~$ ${command.slice(0, i)}`;
            }
            return newLines;
          });
          i++;
          setTimeout(typeChar, 30 + Math.random() * 40); // Faster, more consistent typing
        } else {
          // Add a brief pause before resolving
          setTimeout(resolve, 200);
        }
      };
      typeChar();
    });
  };

  return (
    <div className="terminal-window h-screen">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button close"></div>
          <div className="terminal-button minimize"></div>
          <div className="terminal-button maximize"></div>
        </div>
        <div className="terminal-title">user@portfolio: ~</div>
      </div>
      
      <div ref={terminalRef} className="terminal-container">
        {lines.map((line) => (
          <div key={line.id} className="terminal-line">
            {line.type === 'prompt' && (
              <span className="prompt">{line.content}</span>
            )}
            {line.type === 'command' && (
              <span className="command">{line.content}</span>
            )}
            {line.type === 'output' && (
              <pre 
                className="output" 
                dangerouslySetInnerHTML={{ __html: line.content }}
              ></pre>
            )}
            {line.type === 'loading' && (
              <span className="loading-dots output">{line.content}</span>
            )}
          </div>
        ))}
        
        {currentSection < terminalSections.length && (
          <span className="cursor">█</span>
        )}
        
        {currentSection >= terminalSections.length && (
          <div className="terminal-line">
            <span className="prompt">user@portfolio:~$ </span>
            <span className="comment"># Portfolio exploration complete! Use normal scrolling to navigate.</span>
          </div>
        )}
        
        {currentSection < terminalSections.length && !isExecutingRef.current && (
          <div className="terminal-line comment">
            # Scroll down to continue...
          </div>
        )}
      </div>
    </div>
  );
}