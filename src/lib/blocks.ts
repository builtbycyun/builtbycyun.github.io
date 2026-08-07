import type { ReactNode } from 'react';

/** One todo row in an "Update Todos" block. */
export interface TodoItem {
  text: string;
  done: boolean;
}

/**
 * A single rendered thing in the transcript. The engine appends these one at a
 * time; nothing here knows how it will be drawn.
 */
export type Block =
  | { id: number; kind: 'user'; text: string }
  | { id: number; kind: 'thinking'; text: string }
  | { id: number; kind: 'tool'; name: string; args: string; result: string | null }
  | { id: number; kind: 'todos'; items: TodoItem[] }
  | { id: number; kind: 'message'; body: ReactNode }
  | { id: number; kind: 'note'; body: ReactNode };

/**
 * A simulated tool call. `result` is a thunk when it depends on data that may
 * still be in flight (the live Auctionball counter).
 */
export interface Step {
  name: string;
  args: string;
  /** Multi-line results are split on \n and aligned under the connector. */
  result: string | (() => string);
  /** How long the tool "runs" before its result appears. */
  runMs?: number;
}

/** One scripted prompt-and-answer exchange. */
export interface Turn {
  prompt: string;
  thinking?: string;
  steps?: Step[];
  todos?: TodoItem[];
  answer?: () => ReactNode;
}

export const resolveResult = (result: Step['result']): string =>
  typeof result === 'function' ? result() : result;
