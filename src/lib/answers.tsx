import type { ReactNode } from 'react';
import { personalInfo, techStack, projects, experience, contactInfo } from './data';
import { getAuctionballGames } from './liveStats';
import { agentStatus, formatDay, formatTokens, hasAgentStatus } from './agentStatus';

/* ---------------------------------------------------------------- primitives */

/** Section landmark above an answer, so the eye can find where a topic starts. */
export function SectionHead({ label, meta }: { label: string; meta?: string }) {
  return (
    <div className="section-head">
      <span className="section-label">{label}</span>
      <span className="section-rule" aria-hidden="true" />
      {meta && <span className="section-meta">{meta}</span>}
    </div>
  );
}

export function Rows({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="kv">
      {rows.map(([label, value]) => (
        <div className="kv-row" key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Pills({ items }: { items: string[] }) {
  return (
    <div className="pills">
      {items.map(item => (
        <span className="pill" key={item}>
          {item}
        </span>
      ))}
    </div>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="bullets">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function Out({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="ext" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

const RESUME = '/Christopher_Yun_Resume.pdf';

/* ------------------------------------------------------------------ answers */

export function Profile() {
  return (
    <>
      <SectionHead label="Profile" meta="profile.md" />
      <p>
        <strong>{personalInfo.name}</strong> — {personalInfo.title.toLowerCase()} in{' '}
        {personalInfo.location}. {personalInfo.yearsOfExperience}+ years in, mostly on the
        systems side: cloud-native backends, and a long stretch of reverse-engineering web
        infrastructure that did not want to be understood.
      </p>
      <Rows
        rows={[
          ['Education', 'B.S. Computer Science, University of Maryland'],
          ['Focus', personalInfo.specialties.join('  ·  ')],
          ['Status', <span className="ok" key="s">Available for opportunities</span>],
          ['Resume', <Out href={RESUME} key="r">Christopher_Yun_Resume.pdf</Out>],
        ]}
      />
    </>
  );
}

export function About() {
  return (
    <>
      <SectionHead label="About" meta="about.md" />
      <p>Short version, in his words:</p>
      <blockquote>{personalInfo.bio}</blockquote>
      <p className="lead">Three things he keeps coming back to:</p>
      <Bullets items={personalInfo.specialties} />
    </>
  );
}

const SKILL_LABELS: Record<string, string> = {
  languages: 'Languages',
  backend: 'Backend',
  frontend: 'Frontend',
  services: 'Cloud & services',
};

const SKILL_ORDER = ['languages', 'backend', 'frontend', 'services'];

export function Skills() {
  const total = techStack.reduce((n, cat) => n + cat.technologies.length, 0);
  const ordered = SKILL_ORDER.map(key => techStack.find(cat => cat.category === key)).filter(
    (cat): cat is (typeof techStack)[number] => Boolean(cat)
  );

  return (
    <>
      <SectionHead label="Skills" meta={`${total} entries`} />
      <p>Four directories. Grouped as they sit on disk:</p>
      {ordered.map(cat => (
        <section className="group" key={cat.category}>
          <h3>{SKILL_LABELS[cat.category] ?? cat.category}</h3>
          <Pills items={cat.technologies} />
        </section>
      ))}
      <p className="muted-note">
        The ones that actually carry the projects: TypeScript, Python, Go, React/Next.js,
        Postgres, AWS. The rest are real but occasional.
      </p>
    </>
  );
}

export function Projects() {
  const games = getAuctionballGames();

  return (
    <>
      <SectionHead label="Projects" meta={`${projects.length} files`} />
      <p>
        One is open source, two are live in production, one won a hackathon, one paid for
        college.
      </p>
      {projects.map(project => (
        <article className="card" key={project.id}>
          <h3 className="card-title">{project.name}</h3>
          <p>{project.description}</p>
          <Pills items={project.technologies} />
          <Bullets items={project.features} />
          {project.id === 'auctionball' && games !== null && (
            <p className="live">
              <span className="live-dot" aria-hidden="true" />
              {games.toLocaleString()} games played — read off the production server a moment
              ago
            </p>
          )}
          <Rows
            rows={[
              ...(project.githubUrl
                ? ([
                    [
                      'Source',
                      project.githubUrl.startsWith('http') ? (
                        <Out href={project.githubUrl} key="g">
                          {project.githubUrl.replace('https://', '')}
                        </Out>
                      ) : (
                        <span className="dim" key="g">{project.githubUrl}</span>
                      ),
                    ],
                  ] as [string, ReactNode][])
                : []),
              ...(project.liveUrl
                ? ([
                    [
                      'Live',
                      <Out href={project.liveUrl} key="l">
                        {project.liveUrl.replace('https://', '')}
                      </Out>,
                    ],
                  ] as [string, ReactNode][])
                : []),
            ]}
          />
        </article>
      ))}
    </>
  );
}

export function Experience() {
  return (
    <>
      <SectionHead label="Experience" meta={`${experience.length} roles`} />
      <p>Newest first. The founder stretch is the one that surprises people.</p>
      {experience.map(job => (
        <article className="card" key={job.id}>
          <h3 className="card-title">
            {job.company}
            <span className="card-meta">{job.duration}</span>
          </h3>
          <p className="role">{job.position}</p>
          <p>{job.description}</p>
          <Bullets items={job.achievements} />
          <Pills items={job.technologies} />
        </article>
      ))}
    </>
  );
}

/** A pointer to /agents — the full breakdown lives on its own page. */
export function Agents() {
  if (!hasAgentStatus) {
    return <p>No session summary has been published yet.</p>;
  }

  const { date, totals } = agentStatus;

  return (
    <>
      <SectionHead label="Agents" meta={formatDay(date)} />
      <p>
        On {formatDay(date)} his Claude Code sessions ran <strong>{totals.sessions}</strong>{' '}
        {totals.sessions === 1 ? 'time' : 'times'} across <strong>{totals.projects}</strong>{' '}
        {totals.projects === 1 ? 'project' : 'projects'}, making{' '}
        <strong>{totals.toolCalls.toLocaleString('en-US')}</strong> tool calls and spending{' '}
        <strong>{formatTokens(totals.tokens.total)}</strong> tokens.
      </p>
      <p>
        The full breakdown — per project, with what each session was actually doing — is on{' '}
        <a href="/agents/">the agents page</a>.
      </p>
    </>
  );
}

export function Contact() {
  return (
    <>
      <SectionHead label="Contact" meta="contact.json" />
      <p>Everything public, no forms:</p>
      <Rows
        rows={[
          ['Email', <a href={`mailto:${contactInfo.email}`} key="e">{contactInfo.email}</a>],
          [
            'GitHub',
            <Out href={contactInfo.github} key="g">
              {contactInfo.github.replace('https://', '')}
            </Out>,
          ],
          [
            'LinkedIn',
            <Out href={contactInfo.linkedin} key="l">
              {contactInfo.linkedin.replace('https://', '')}
            </Out>,
          ],
          ['Location', contactInfo.location],
          ['Resume', <Out href={RESUME} key="r">Christopher_Yun_Resume.pdf</Out>],
        ]}
      />
      <p className="muted-note">
        Email is the fastest. He reads it, and he replies.
      </p>
    </>
  );
}
