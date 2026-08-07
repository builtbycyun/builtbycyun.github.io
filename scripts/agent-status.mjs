#!/usr/bin/env node
/**
 * Summarise a day of local Claude Code activity into public/agent-status.json,
 * which the site fetches at load.
 *
 * There is no API that reports "what did this account work on today", so this
 * reads what Claude Code already writes to disk: one JSONL transcript per
 * session under ~/.claude/projects/<slugged-cwd>/<session-id>.jsonl.
 *
 * Only directories listed in scripts/agent-status.config.json are ever named.
 * Everything else is counted and left anonymous.
 *
 *   node scripts/agent-status.mjs                 # today, local time
 *   node scripts/agent-status.mjs --date=2026-08-06
 *   node scripts/agent-status.mjs --dry           # print, don't write
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..');
const SESSIONS_DIR = join(homedir(), '.claude', 'projects');
const CONFIG_PATH = join(HERE, 'agent-status.config.json');
const OUT_PATH = join(REPO, 'public', 'agent-status.json');

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const dateArg = args.find(a => a.startsWith('--date='))?.slice('--date='.length);

/** Local (not UTC) calendar date of an ISO timestamp, as YYYY-MM-DD. */
function localDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const targetDate = dateArg ?? localDate(new Date().toISOString());

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const publish = config.publish ?? {};
const maxTitles = config.maxTitlesPerProject ?? 3;

const EDIT_TOOLS = new Set(['Edit', 'Write', 'NotebookEdit']);

/** One accumulator per project directory seen on the target date. */
const projects = new Map();

function bucket(dirName) {
  if (!projects.has(dirName)) {
    projects.set(dirName, {
      dirName,
      sessions: new Set(),
      prompts: 0,
      toolCalls: 0,
      files: new Set(),
      branches: new Set(),
      titles: new Map(), // sessionId -> title
      firstAt: null,
      lastAt: null,
      tokens: { input: 0, output: 0, cacheWrite: 0, cacheRead: 0 },
      models: new Set(),
    });
  }
  return projects.get(dirName);
}

function readSessionFile(path) {
  let lines;
  try {
    lines = readFileSync(path, 'utf8').split('\n');
  } catch {
    return; // session being written, or unreadable — skip it
  }

  // ai-title records carry no timestamp, so collect them before deciding
  // whether this session touched the target date at all.
  const titles = new Map();
  const records = [];
  for (const line of lines) {
    if (!line) continue;
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      continue; // a half-written trailing line
    }
    if (record.type === 'ai-title' && record.aiTitle) {
      titles.set(record.sessionId, record.aiTitle);
      continue;
    }
    records.push(record);
  }

  for (const record of records) {
    if (!record.timestamp || localDate(record.timestamp) !== targetDate) continue;
    const cwd = record.cwd;
    if (!cwd) continue;

    const entry = bucket(basename(cwd.replace(/[\\/]+$/, '')));
    if (record.sessionId) entry.sessions.add(record.sessionId);
    if (record.gitBranch) entry.branches.add(record.gitBranch);
    if (!entry.firstAt || record.timestamp < entry.firstAt) entry.firstAt = record.timestamp;
    if (!entry.lastAt || record.timestamp > entry.lastAt) entry.lastAt = record.timestamp;

    const title = titles.get(record.sessionId);
    if (title) entry.titles.set(record.sessionId, title);

    // A real prompt: typed by the user, plain text, not a tool result or a
    // caveat the CLI injected.
    if (record.type === 'user' && !record.isMeta && typeof record.message?.content === 'string') {
      entry.prompts += 1;
    }

    if (record.type === 'assistant') {
      if (record.message?.model) entry.models.add(record.message.model);
      const usage = record.message?.usage;
      if (usage) {
        entry.tokens.input += usage.input_tokens ?? 0;
        entry.tokens.output += usage.output_tokens ?? 0;
        entry.tokens.cacheWrite += usage.cache_creation_input_tokens ?? 0;
        entry.tokens.cacheRead += usage.cache_read_input_tokens ?? 0;
      }
      for (const part of record.message?.content ?? []) {
        if (part?.type !== 'tool_use') continue;
        entry.toolCalls += 1;
        const file = part.input?.file_path;
        if (EDIT_TOOLS.has(part.name) && typeof file === 'string') entry.files.add(file);
      }
    }
  }
}

if (!existsSync(SESSIONS_DIR)) {
  console.error(`No Claude Code sessions directory at ${SESSIONS_DIR}`);
  process.exit(1);
}

for (const dir of readdirSync(SESSIONS_DIR, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const dirPath = join(SESSIONS_DIR, dir.name);
  for (const file of readdirSync(dirPath)) {
    if (file.endsWith('.jsonl')) readSessionFile(join(dirPath, file));
  }
}

/* ------------------------------------------------------------ shape the output */

const named = [];
const totals = {
  projects: 0,
  sessions: 0,
  prompts: 0,
  toolCalls: 0,
  filesTouched: 0,
  tokens: { input: 0, output: 0, cacheWrite: 0, cacheRead: 0, total: 0 },
};
let anonProjects = 0;
let anonSessions = 0;
const models = new Set();

for (const entry of projects.values()) {
  const sessions = entry.sessions.size;
  if (sessions === 0) continue;

  totals.projects += 1;
  totals.sessions += sessions;
  totals.prompts += entry.prompts;
  totals.toolCalls += entry.toolCalls;
  totals.filesTouched += entry.files.size;
  totals.tokens.input += entry.tokens.input;
  totals.tokens.output += entry.tokens.output;
  totals.tokens.cacheWrite += entry.tokens.cacheWrite;
  totals.tokens.cacheRead += entry.tokens.cacheRead;
  entry.models.forEach(m => models.add(m));

  const opt = publish[entry.dirName];
  if (!opt) {
    anonProjects += 1;
    anonSessions += sessions;
    continue;
  }

  named.push({
    name: opt.name ?? entry.dirName,
    branch: [...entry.branches][0] ?? null,
    sessions,
    prompts: entry.prompts,
    toolCalls: entry.toolCalls,
    filesTouched: entry.files.size,
    firstAt: entry.firstAt,
    lastAt: entry.lastAt,
    tokens: entry.tokens,
    titles: opt.titles === false ? [] : [...entry.titles.values()].slice(0, maxTitles),
  });
}

totals.tokens.total =
  totals.tokens.input + totals.tokens.output + totals.tokens.cacheWrite + totals.tokens.cacheRead;

named.sort((a, b) => b.toolCalls - a.toolCalls);

const payload = {
  date: targetDate,
  generatedAt: new Date().toISOString(),
  models: [...models].sort(),
  totals,
  projects: named,
  anonymous: { projects: anonProjects, sessions: anonSessions },
};

const summary =
  `${targetDate}: ${totals.sessions} sessions across ${totals.projects} projects ` +
  `(${named.length} named, ${anonProjects} private) · ` +
  `${totals.toolCalls} tool calls · ${(totals.tokens.total / 1e6).toFixed(1)}M tokens`;

if (dry) {
  console.log(JSON.stringify(payload, null, 2));
  console.error(`\n[dry run] ${summary}`);
} else {
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(summary);
  console.log(`wrote ${OUT_PATH}`);
}
