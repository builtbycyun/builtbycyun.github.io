import type { Metadata } from 'next';
import Link from 'next/link';
import {
  agentStatus,
  formatCount,
  formatDay,
  formatSpan,
  formatStamp,
  formatTokens,
  hasAgentStatus,
} from '../../lib/agentStatus';

export const metadata: Metadata = {
  title: 'agents — christopher-yun',
  description:
    "What Christopher Yun's Claude Code agents did: sessions, tool calls, files edited, and tokens spent.",
};

/**
 * A day of agent activity. Static: everything renders at build time from the
 * committed summary, so there is no loading state and no client JavaScript.
 */
export default function AgentsPage() {
  const { date, generatedAt, models, totals, projects, anonymous } = agentStatus;
  const { tokens } = totals;

  // One hue for every meter. The site's orange and green sit ΔE 3.5 apart under
  // deuteranopia, so colouring bars per project would make them identical for a
  // colourblind reader. Length carries magnitude; the name carries identity.
  //
  // Each meter is a share of the whole day, not of the busiest project — that
  // keeps the leader off a permanent 100% and leaves the private work visible
  // as the gap the named bars don't fill.
  const dayTotal = Math.max(1, totals.toolCalls);

  return (
    <div className="app">
      <div className="window">
        <header className="titlebar">
          <div className="dots" aria-hidden="true">
            <span className="dot-close" />
            <span className="dot-min" />
            <span className="dot-max" />
          </div>
          <div className="title">christopher-yun — agents</div>
        </header>

        <main className="page">
          <nav className="page-nav">
            <Link href="/" className="back-link">
              <span aria-hidden="true">←</span> back to the session
            </Link>
            <span className="page-date">{formatDay(date)}</span>
          </nav>

          {!hasAgentStatus ? (
            <p className="empty">
              No session summary has been published yet. Run{' '}
              <code>npm run agent-status</code> and commit the result.
            </p>
          ) : (
            <>
              <section className="hero">
                <p className="hero-label">Tokens spent</p>
                <p className="hero-value">{formatTokens(tokens.total)}</p>
                <p className="hero-sub">
                  {formatTokens(tokens.output)} written ·{' '}
                  {formatTokens(tokens.cacheWrite)} cached ·{' '}
                  {formatTokens(tokens.cacheRead)} re-read from cache
                </p>
              </section>

              <section className="kpis" aria-label="Totals for the day">
                <Stat label="Sessions" value={formatCount(totals.sessions)} />
                <Stat label="Tool calls" value={formatCount(totals.toolCalls)} />
                <Stat label="Files edited" value={formatCount(totals.filesTouched)} />
                <Stat label="Prompts" value={formatCount(totals.prompts)} />
              </section>

              <section className="page-section">
                <h2 className="page-heading">
                  <span>Projects</span>
                  <span className="page-rule" aria-hidden="true" />
                  <span className="page-heading-meta">
                    {projects.length} of {totals.projects} named
                  </span>
                </h2>

                {projects.map(project => (
                  <article className="agent-card" key={project.name}>
                    <header className="agent-card-head">
                      <h3>{project.name}</h3>
                      <span className="agent-card-meta">
                        {project.branch ? `${project.branch} · ` : ''}
                        {formatSpan(project.firstAt, project.lastAt)} active
                      </span>
                    </header>

                    {project.titles.length > 0 && (
                      <ul className="agent-titles">
                        {project.titles.map(title => (
                          <li key={title}>{title}</li>
                        ))}
                      </ul>
                    )}

                    <div
                      className="meter"
                      role="img"
                      aria-label={`${Math.round(
                        (project.toolCalls / dayTotal) * 100
                      )} percent of the day's tool calls`}
                    >
                      <div
                        className="meter-fill"
                        style={{ width: `${Math.round((project.toolCalls / dayTotal) * 100)}%` }}
                      />
                    </div>

                    <p className="agent-card-stats">
                      {formatCount(project.toolCalls)} tool calls (
                      {Math.round((project.toolCalls / dayTotal) * 100)}% of the day) ·{' '}
                      {formatCount(project.filesTouched)} files ·{' '}
                      {formatTokens(project.tokens.output)} written ·{' '}
                      {project.sessions} {project.sessions === 1 ? 'session' : 'sessions'}
                    </p>
                  </article>
                ))}

                {anonymous.projects > 0 && (
                  <p className="page-note">
                    {anonymous.projects} other{' '}
                    {anonymous.projects === 1 ? 'project' : 'projects'} ({anonymous.sessions}{' '}
                    {anonymous.sessions === 1 ? 'session' : 'sessions'}) stayed private —
                    counted here, never named.
                  </p>
                )}
              </section>

              <section className="page-section">
                <h2 className="page-heading">
                  <span>How this works</span>
                  <span className="page-rule" aria-hidden="true" />
                </h2>
                <p className="page-note">
                  Claude Code writes every session to disk. A script on Christopher&apos;s
                  machine reads the day&apos;s transcripts and commits the summary above.
                  Nothing here is fetched from Anthropic — no API reports what an account
                  worked on, and a static page has no server to hold a key. Only projects
                  he opts in are named.
                </p>
                <dl className="kv">
                  <div className="kv-row">
                    <dt>Model</dt>
                    <dd>{models.map(m => <code key={m}>{m}</code>)}</dd>
                  </div>
                  <div className="kv-row">
                    <dt>Covers</dt>
                    <dd>{formatDay(date)}</dd>
                  </div>
                  <div className="kv-row">
                    <dt>Generated</dt>
                    <dd>{formatStamp(generatedAt)}</dd>
                  </div>
                </dl>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}
