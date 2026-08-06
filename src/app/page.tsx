'use client';

import { useEffect, useRef, useState } from 'react';
import { terminalSections } from '../lib/terminalSections';
import { useTerminalScroll } from '../lib/useTerminalScroll';
import { fetchAuctionballGames } from '../lib/liveStats';

interface TerminalLine {
  id: number;
  type: 'prompt' | 'output' | 'loading';
  content: string;
}

function PromptPrefix() {
  return (
    <>
      <span className="prompt-user">cyun@portfolio</span>
      <span className="prompt-dim">:</span>
      <span className="prompt-path">~</span>
      <span className="prompt-dim">$ </span>
    </>
  );
}

export default function TerminalPortfolio() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const isExecutingRef = useRef(false);
  const hasNewContentRef = useRef(false);
  const initializedRef = useRef(false);
  const nextLineIdRef = useRef(0);

  const isComplete = currentSection >= terminalSections.length;

  const terminalRef = useTerminalScroll({
    currentSection,
    sectionsLength: terminalSections.length,
    isExecutingRef,
    hasNewContentRef,
    executeNextCommand,
  });

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    addLine('prompt', '');
    // Start early so the count is ready by the time the projects section runs
    fetchAuctionballGames();
  }, []);

  const addLine = (type: TerminalLine['type'], content: string) => {
    const id = nextLineIdRef.current++;
    setLines(prev => [...prev, { id, type, content }]);
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      const el = terminalRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  async function executeNextCommand() {
    if (isComplete || isExecutingRef.current) return;
    isExecutingRef.current = true;
    const section = terminalSections[currentSection];

    await typeCommand(section.command);

    addLine('loading', 'Loading');
    scrollToBottom();

    setTimeout(() => {
      // Replace the loading line with the command's output
      setLines(prev => prev.slice(0, -1));
      addLine('output', section.content());
      hasNewContentRef.current = true;

      setTimeout(() => {
        addLine('prompt', '');
        setCurrentSection(prev => prev + 1);
        isExecutingRef.current = false;
      }, 500);
    }, 800 + Math.random() * 600);
  }

  const typeCommand = (command: string): Promise<void> =>
    new Promise(resolve => {
      let i = 1;
      const typeChar = () => {
        const typed = command.slice(0, i);
        setLines(prev => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.type === 'prompt') {
            next[next.length - 1] = { ...last, content: typed };
          }
          return next;
        });
        scrollToBottom();
        if (i < command.length) {
          i++;
          setTimeout(typeChar, 24 + Math.random() * 36);
        } else {
          setTimeout(resolve, 180);
        }
      };
      typeChar();
    });

  return (
    <div className="terminal-shell">
      <div className="terminal-window">
        <header className="terminal-header">
          <div className="terminal-buttons" aria-hidden="true">
            <span className="terminal-button close" />
            <span className="terminal-button minimize" />
            <span className="terminal-button maximize" />
          </div>
          <div className="terminal-title">cyun@portfolio: ~</div>
        </header>

        <div ref={terminalRef} className="terminal-container" role="log">
          {lines.map((line, index) => {
            const isLastLine = index === lines.length - 1;
            return (
              <div key={line.id} className="terminal-line">
                {line.type === 'prompt' && (
                  <>
                    <PromptPrefix />
                    <span className="command">{line.content}</span>
                    {isLastLine && <span className="cursor" aria-hidden="true" />}
                  </>
                )}
                {line.type === 'output' && (
                  <pre
                    className="output"
                    dangerouslySetInnerHTML={{ __html: line.content }}
                  />
                )}
                {line.type === 'loading' && (
                  <span className="loading-dots">{line.content}</span>
                )}
              </div>
            );
          })}

          {isComplete ? (
            <div className="terminal-line comment">
              # That&apos;s everything — thanks for stopping by. Scroll freely, and reach out anytime.
            </div>
          ) : (
            !isExecutingRef.current && (
              <div className="terminal-line scroll-hint" aria-hidden="true">
                <span className="scroll-hint-arrow">▼</span> scroll or press Enter to run the next command
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
