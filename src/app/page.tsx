'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Block, Step } from '../lib/blocks';
import { resolveResult } from '../lib/blocks';
import { turns } from '../lib/session';
import { runCommand } from '../lib/commands';
import { useSessionScroll } from '../lib/useSessionScroll';
import { fetchAuctionballGames } from '../lib/liveStats';
import { agentStatus, formatShortDay, hasAgentStatus } from '../lib/agentStatus';

type NewBlock<T = Block> = T extends Block ? Omit<T, 'id'> : never;

const VERBS = [
  'Pondering',
  'Divining',
  'Noodling',
  'Percolating',
  'Cogitating',
  'Ruminating',
  'Simmering',
  'Synthesizing',
  'Deliberating',
  'Marinating',
];

const GLYPHS = ['✻', '✽', '✳', '✢', '·', '✢', '✳', '✽'];

/* ------------------------------------------------------------------ chrome */

function Welcome() {
  return (
    <div className="welcome-wrap">
      <div className="welcome">
        <p className="welcome-title">
          <span className="glyph">✻</span> Welcome to Claude Code!
        </p>
        <p className="welcome-sub">/help for help, /status for your current setup</p>
        <p className="welcome-cwd">cwd: ~/christopher-yun</p>
      </div>
      <p className="tip">
        <span className="glyph" aria-hidden="true">
          ※
        </span>{' '}
        Tip: Esc skips the typing, any time.
      </p>
    </div>
  );
}

function Spinner({ verb }: { verb: string }) {
  const [ms, setMs] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const id = window.setInterval(() => setMs(performance.now() - start), 90);
    return () => window.clearInterval(id);
  }, []);

  const seconds = ms / 1000;
  const tokens = 210 + Math.round(seconds * 720);
  const tokenLabel = tokens >= 1000 ? `${(tokens / 1000).toFixed(1)}k` : String(tokens);

  return (
    <div className="spinner" aria-live="polite">
      <span className="glyph spin" aria-hidden="true">
        {GLYPHS[Math.floor(ms / 120) % GLYPHS.length]}
      </span>
      <span className="verb">{verb}…</span>
      <span className="spinner-meta">
        ({seconds.toFixed(0)}s · ↑ {tokenLabel} tokens · esc to interrupt)
      </span>
    </div>
  );
}

function Result({ lines, pending }: { lines: string[]; pending?: boolean }) {
  return (
    <div className={pending ? 'result pending' : 'result'}>
      <span className="conn" aria-hidden="true" />
      <div className="result-text">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}

function Gutter() {
  return (
    <span className="gutter" aria-hidden="true">
      <i className="dot" />
    </span>
  );
}

function renderBlock(block: Block) {
  switch (block.kind) {
    case 'user':
      return (
        <div className="block user" key={block.id}>
          <span className="chev" aria-hidden="true">
            &gt;
          </span>
          <span className="user-text">{block.text}</span>
        </div>
      );

    case 'thinking':
      return (
        <div className="block thinking" key={block.id}>
          <span className="glyph" aria-hidden="true">
            ✻
          </span>
          <span>{block.text}</span>
        </div>
      );

    case 'tool':
      return (
        <div className="block entry" key={block.id}>
          <Gutter />
          <div className="entry-body">
            <div className="tool-call">
              <span className="tool-name">{block.name}</span>
              <span className="tool-args">({block.args})</span>
            </div>
            {block.result === null ? (
              <Result lines={['running…']} pending />
            ) : (
              <Result lines={block.result.split('\n')} />
            )}
          </div>
        </div>
      );

    case 'todos':
      return (
        <div className="block entry" key={block.id}>
          <Gutter />
          <div className="entry-body">
            <div className="tool-call">
              <span className="tool-name">Update Todos</span>
            </div>
            <div className="result">
              <span className="conn" aria-hidden="true" />
              <ul className="todos">
                {block.items.map((item, i) => (
                  <li key={i} className={item.done ? 'done' : undefined}>
                    <span className="check" aria-hidden="true" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );

    case 'message':
      return (
        <div className="block entry" key={block.id} data-block={block.id}>
          <Gutter />
          <div className="entry-body prose">{block.body}</div>
        </div>
      );

    case 'note':
      return (
        <div className="block note" key={block.id}>
          {block.body}
        </div>
      );
  }
}

/* ------------------------------------------------------------------- engine */

export default function ClaudeCodePortfolio() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [draft, setDraft] = useState('');
  const [turnIndex, setTurnIndex] = useState(0);
  const [verb, setVerb] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const isRunningRef = useRef(false);
  const hasNewContentRef = useRef(false);
  const idRef = useRef(0);
  const startedRef = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Pending sleeps, so Esc can flush the whole animation at once.
  const waitersRef = useRef(new Set<() => void>());
  const skipRef = useRef(false);

  const isTouring = turnIndex < turns.length;

  const scrollRef = useSessionScroll({
    active: isTouring,
    isRunningRef,
    hasNewContentRef,
    advance: () => void runTurn(turnIndex),
  });

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    // Start early so the counter has landed by the time the projects turn runs.
    fetchAuctionballGames();
    // Play the opening exchange unprompted: it shows the visitor what scrolling
    // will do far better than an instruction does. No cleanup — the guard above
    // already makes this once-per-session.
    window.setTimeout(() => void runTurn(0), 900);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !isRunningRef.current) return;
      e.preventDefault();
      skipRef.current = true;
      const waiters = Array.from(waitersRef.current);
      waitersRef.current.clear();
      waiters.forEach(resolve => resolve());
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    // Hand the visitor the prompt once the tour ends — but don't yank up a
    // keyboard on touch devices.
    if (isTouring) return;
    if (!window.matchMedia('(hover: hover)').matches) return;
    inputRef.current?.focus();
  }, [isTouring]);

  const sleep = (ms: number) =>
    new Promise<void>(resolve => {
      if (skipRef.current) {
        resolve();
        return;
      }
      const done = () => {
        window.clearTimeout(timer);
        waitersRef.current.delete(done);
        resolve();
      };
      const timer = window.setTimeout(done, ms);
      waitersRef.current.add(done);
    });

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  /** Bring the top of a finished answer into view, rather than its end. */
  const scrollAnswerIntoView = (id: number) => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      const node = el.querySelector<HTMLElement>(`[data-block="${id}"]`);
      if (!node) {
        el.scrollTop = el.scrollHeight;
        return;
      }
      const top =
        el.scrollTop + node.getBoundingClientRect().top - el.getBoundingClientRect().top - 14;
      el.scrollTo({
        top: Math.max(0, top),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
    });
  };

  const push = (block: NewBlock): number => {
    const id = idRef.current++;
    setBlocks(prev => [...prev, { ...block, id } as Block]);
    // The agent thinking out loud — prompts, thinking, tool calls — tracks the
    // bottom so the live action stays visible. An answer is different: landing
    // the reader at the end of a long section only makes them scroll back up,
    // so an answer arrives with its first line in view instead.
    if (block.kind === 'message') scrollAnswerIntoView(id);
    else scrollToBottom();
    return id;
  };

  const typeDraft = async (text: string) => {
    for (let i = 1; i <= text.length; i++) {
      if (skipRef.current) break;
      setDraft(text.slice(0, i));
      await sleep(16 + Math.random() * 28);
    }
    setDraft(text);
    await sleep(220);
  };

  const runSteps = async (steps: Step[]) => {
    for (const step of steps) {
      await sleep(360);
      const id = push({ kind: 'tool', name: step.name, args: step.args, result: null });
      await sleep(step.runMs ?? 700);
      const result = resolveResult(step.result);
      setBlocks(prev =>
        prev.map(block => (block.id === id && block.kind === 'tool' ? { ...block, result } : block))
      );
      scrollToBottom();
    }
  };

  async function runTurn(index: number) {
    if (index >= turns.length || isRunningRef.current) return;
    isRunningRef.current = true;
    skipRef.current = false;

    const turn = turns[index];
    await typeDraft(turn.prompt);
    push({ kind: 'user', text: turn.prompt });
    setDraft('');
    setVerb(VERBS[index % VERBS.length]);
    scrollToBottom(); // the spinner is a sibling of the blocks, not one of them

    if (turn.thinking) {
      await sleep(520);
      push({ kind: 'thinking', text: turn.thinking });
    }
    if (turn.steps) await runSteps(turn.steps);
    if (turn.todos) {
      await sleep(420);
      push({ kind: 'todos', items: turn.todos });
    }

    await sleep(turn.steps || turn.todos ? 420 : 760);
    if (turn.answer) push({ kind: 'message', body: turn.answer() });

    setVerb(null);
    hasNewContentRef.current = true;
    setTurnIndex(index + 1);
    isRunningRef.current = false;
  }

  /** Run one command — from the composer, or from the status-bar button. */
  async function runInput(text: string) {
    if (!text || isRunningRef.current) return;

    const result = runCommand(text);
    // Fire the popup while we still have the gesture that triggered it.
    if (result.open) window.open(result.open, '_blank', 'noopener,noreferrer');

    isRunningRef.current = true;
    skipRef.current = false;
    push({ kind: 'user', text });

    if (result.clear) {
      setBlocks([]);
      idRef.current = 0;
      if (result.note) push({ kind: 'note', body: result.note });
      isRunningRef.current = false;
      return;
    }

    setVerb(VERBS[Math.floor(Math.random() * VERBS.length)]);
    scrollToBottom();
    await sleep(420);
    if (result.steps) await runSteps(result.steps);
    await sleep(360);
    if (result.body) push({ kind: 'message', body: result.body });
    if (result.note) push({ kind: 'note', body: result.note });

    setVerb(null);
    // Costs one scroll gesture, so a mid-tour click can't chain into the next
    // scripted turn on the same flick.
    hasNewContentRef.current = true;
    isRunningRef.current = false;
  }

  async function submitDraft() {
    if (isTouring) return;
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    await runInput(text);
    inputRef.current?.focus();
  }

  return (
    <div className="app">
      <div className="window">
        <header className="titlebar">
          <div className="dots" aria-hidden="true">
            <span className="dot-close" />
            <span className="dot-min" />
            <span className="dot-max" />
          </div>
          <div className="title">christopher-yun — claude</div>
        </header>

        <div className="transcript" ref={scrollRef} role="log">
          <Welcome />
          {blocks.map(renderBlock)}
          {verb && <Spinner verb={verb} />}
          {isTouring && !verb && (
            <div className="hint" aria-hidden="true">
              <span className="hint-arrow">▼</span> scroll to send the next prompt
            </div>
          )}
        </div>

        <form
          className="composer"
          onSubmit={e => {
            e.preventDefault();
            void submitDraft();
          }}
        >
          <div
            className={`prompt-box${focused ? ' focused' : ''}${isTouring ? ' locked' : ''}`}
            onClick={() => !isTouring && inputRef.current?.focus()}
          >
            <span className="chev" aria-hidden="true">
              &gt;
            </span>
            <div className="field">
              <span className="mirror">
                <span className="mirror-text">{draft}</span>
                <span className="caret" aria-hidden="true" />
                {!draft && !isTouring && (
                  <span className="placeholder">ask anything, or try /help</span>
                )}
              </span>
              <textarea
                ref={inputRef}
                className="input"
                value={draft}
                rows={1}
                readOnly={isTouring}
                aria-label="Prompt"
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="send"
                onChange={e => setDraft(e.target.value.replace(/\n/g, ''))}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={e => {
                  if (e.key !== 'Enter' || e.shiftKey) return;
                  e.preventDefault();
                  void submitDraft();
                }}
              />
            </div>
          </div>

          <div className="statusline">
            <div className="status-left">
              {hasAgentStatus && (
                <Link href="/agents/" className="agents-chip">
                  <span className="agents-dot" aria-hidden="true" />
                  <span className="agents-count">
                    {formatShortDay(agentStatus.date)} ·{' '}
                    {agentStatus.totals.sessions} sessions —{' '}
                  </span>
                  see what his agents are working on
                </Link>
              )}
              <span className="status-hint">
                {isTouring ? 'scroll or Enter · esc skips' : 'try /help, or just ask'}
              </span>
            </div>
            <span className="status-right">claude-opus-5 · ~/christopher-yun</span>
          </div>
        </form>
      </div>
    </div>
  );
}
