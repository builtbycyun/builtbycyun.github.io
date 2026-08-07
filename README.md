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

To keep it current automatically, schedule `npm run agent-status` plus a commit
on this machine (Task Scheduler, or a Claude Code routine). GitHub Actions can't
do it — the transcripts are local, and the runner is not.

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

To change what the page says, edit `src/lib/data.ts`. To change what it asks,
edit `src/lib/session.tsx`.
