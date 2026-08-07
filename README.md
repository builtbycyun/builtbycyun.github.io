# builtbycyun.github.io

Christopher Yun's portfolio, built to look and behave like a Claude Code session.

Scroll (or press Enter) and the page sends the next prompt: it types into the
composer, runs simulated tool calls — `Read`, `Glob`, `Bash`, `Task`, `Fetch` —
and answers. Esc skips the animation. When the scripted tour ends the prompt
becomes live: slash commands (`/projects`, `/experience`, `/help`) work, and any
other text gets grepped across the portfolio content.

One tool call isn't simulated. The projects section opens a WebSocket to the
production Auctionball server and prints its real lifetime games-played counter.

## The agent status feed

The bottom bar has one clickable thing: **see what his agents are working on**.
It runs `/agents`, which reports a real day of Claude Code activity — sessions,
prompts, tool calls, files edited, and tokens spent.

There is no API that answers "what did this account work on today", and a static
site has nowhere to keep a key, so the data is **pushed, not pulled**. Claude Code
already writes every session to `~/.claude/projects/<slugged-cwd>/<id>.jsonl`.
A local script reads today's transcripts and writes a summary into the repo:

```bash
npm run agent-status              # today
node scripts/agent-status.mjs --date=2026-08-06
node scripts/agent-status.mjs --dry   # print it, don't write it
```

That writes `public/agent-status.json`. Commit and push it and the site picks it
up on the next deploy. If the file is missing the bar hides itself, so nothing
breaks when it hasn't been generated.

**Only projects listed in `scripts/agent-status.config.json` are ever named.**
Everything else is counted and reported as "3 other projects stayed private".
Session titles describe what you were doing, so a directory is opted in
deliberately — add it to `publish`, or set `titles: false` to publish a project's
numbers without its titles.

It is cheap to re-run. Every transcript is parsed once and cached by
`(mtime, size)`; old sessions never change, so a repeat run only reads what you
worked on since. Over a 532MB corpus that is **1.9s cold, 0.2s warm**. Lines are
streamed rather than slurped, so memory stays flat. Nothing runs in the
background and nothing polls — it is a one-shot you invoke.

## What updates itself, and what doesn't

The two heatmaps on `/agents` have deliberately different lifecycles:

| Graph | Source | Stays current? |
| --- | --- | --- |
| **Commits per day** | GitHub's contributions API, via `.github/workflows/activity.yml` on a daily cron | **Yes** — runs on GitHub, no local machine involved |
| **Claude tokens per day** | Local session transcripts, via `npm run agent-status` | Only when you run it |

That split isn't a shortcut, it's the constraint: Claude usage data exists
**only** in local transcripts. Anthropic publishes no API for "what did this
account do", so no cloud job can reach it. Zero local execution means zero
Claude data. The history is the forgiving part — the transcripts are a complete
archive, so one run backfills every past day at once, and only the newest day
goes stale between runs.

If you want the Claude half fresher without a scheduled task, hook it to
something you already do rather than to the clock — a Claude Code `SessionEnd`
hook runs it exactly when a session produces new data, and nothing runs in
between.

To include private repositories in the commit graph, add a personal access
token with `repo` scope as an `ACTIVITY_TOKEN` repository secret. Without it the
workflow falls back to the default token.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

Static export only — no server. GitHub Actions builds `main` and publishes
`out/` to GitHub Pages.

## Layout

| Path | What's in it |
| --- | --- |
| `src/app/page.tsx` | The session engine: typing, tool timing, Esc-to-skip, the composer |
| `src/app/globals.css` | Every visual decision |
| `src/lib/session.tsx` | The scripted tour — prompts, tool calls, and which answer each returns |
| `src/lib/answers.tsx` | The content components the answers are built from |
| `src/lib/commands.tsx` | Slash commands and free-text search, for after the tour |
| `src/lib/data.ts` | Projects, jobs, skills, contact details — edit here, not in the components |
| `src/lib/liveStats.ts` | The Auctionball WebSocket probe |
| `src/lib/agentStatus.ts` | Loads and formats the agent status feed |
| `scripts/agent-status.mjs` | Summarises local Claude Code sessions into `public/agent-status.json` |
| `scripts/agent-status.config.json` | Which project directories may be named publicly |
| `scripts/commit-activity.mjs` | Pulls commits-per-day from GitHub (runs in Actions, not locally) |
| `src/app/agents/page.tsx` | The `/agents` page — static, no client JavaScript |
| `src/app/agents/ActivityGraph.tsx` | The contribution-style heatmap |

To change what the page says, edit `src/lib/data.ts`. To change what it asks,
edit `src/lib/session.tsx`.
