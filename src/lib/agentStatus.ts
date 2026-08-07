// A day of Claude Code activity, summarised by scripts/agent-status.mjs into
// public/agent-status.json and imported here at build time.
//
// Nothing here talks to Anthropic. No API reports "what did this account do
// today", and a static site has nowhere to keep a key — so the data is pushed
// out by the local script, not pulled in by the browser.
//
// Every formatter below is deterministic: no toLocaleString, no `new Date(iso)`
// for display. These render identically on the server and in the visitor's
// browser, whatever their timezone, so nothing can mismatch on hydration.
import raw from '../../public/agent-status.json';
import commits from '../../public/commit-activity.json';

export interface AgentTokens {
  input: number;
  output: number;
  cacheWrite: number;
  cacheRead: number;
}

export interface AgentProject {
  name: string;
  branch: string | null;
  sessions: number;
  prompts: number;
  toolCalls: number;
  filesTouched: number;
  firstAt: string;
  lastAt: string;
  tokens: AgentTokens;
  titles: string[];
}

export interface AgentDay {
  date: string;
  sessions: number;
  toolCalls: number;
  tokens: number;
  projects: number;
}

export interface AgentStatus {
  date: string;
  generatedAt: string;
  models: string[];
  history: AgentDay[];
  lifetime: {
    days: number;
    sessions: number;
    toolCalls: number;
    tokens: number;
    busiest: AgentDay | null;
    firstDate: string | null;
  };
  totals: {
    projects: number;
    sessions: number;
    prompts: number;
    toolCalls: number;
    filesTouched: number;
    tokens: AgentTokens & { total: number };
  };
  projects: AgentProject[];
  anonymous: { projects: number; sessions: number };
}

export const agentStatus = raw as AgentStatus;

/** False when the feed exists but records nothing — the UI then hides itself. */
export const hasAgentStatus = Boolean(agentStatus?.totals?.sessions);

/**
 * Commits per day, refreshed daily by .github/workflows/activity.yml. This half
 * runs entirely on GitHub, so it stays current with no local machine involved —
 * unlike the Claude figures, which only exist in local session transcripts.
 */
export interface CommitActivity {
  login: string;
  generatedAt: string;
  totalContributions: number;
  commitContributions: number;
  privateContributions: number;
  activeDays: number;
  busiest: { date: string; count: number } | null;
  days: { date: string; count: number }[];
}

export const commitActivity = commits as CommitActivity;

export const hasCommitActivity = Boolean(commitActivity?.days?.length);

/* --------------------------------------------------------------- formatting */

export function formatTokens(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}k`;
  return String(n);
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** "2026-08-07" -> "Fri, Aug 7". Built from components, so the weekday is the
 *  same in every timezone — unlike `new Date("2026-08-07")`, which is UTC. */
export function formatDay(day: string): string {
  const [y, m, d] = day.split('-').map(Number);
  const weekday = DAYS[new Date(y, (m ?? 1) - 1, d ?? 1).getDay()];
  return `${weekday}, ${MONTHS[(m ?? 1) - 1]} ${d}`;
}

/** "2026-08-07" -> "Aug 7" */
export function formatShortDay(day: string): string {
  const [, m, d] = day.split('-').map(Number);
  return `${MONTHS[(m ?? 1) - 1]} ${d}`;
}

/** ISO instant -> "2026-08-07 21:54 UTC", by slicing rather than parsing. */
export function formatStamp(iso: string): string {
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;
}

/** Wall-clock span of a project's sessions — pure arithmetic, timezone-free. */
export function formatSpan(firstAt: string, lastAt: string): string {
  const minutes = Math.max(
    0,
    Math.round((Date.parse(lastAt) - Date.parse(firstAt)) / 60000)
  );
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

export function formatCount(n: number): string {
  return n.toLocaleString('en-US');
}
