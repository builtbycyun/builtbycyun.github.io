import type { ReactNode } from 'react';
import type { Step } from './blocks';
import { contactInfo, experience, personalInfo, projects, techStack } from './data';
import { About, Agents, Contact, Experience, Out, Profile, Projects, Rows, Skills } from './answers';
import { agentStatus, formatTokens, hasAgentStatus } from './agentStatus';

export interface CommandResult {
  steps?: Step[];
  /** Assistant reply — rendered with the bullet. */
  body?: ReactNode;
  /** Dim system line — rendered without the bullet. */
  note?: ReactNode;
  clear?: boolean;
  /** URL to open in a new tab. */
  open?: string;
}

const RESUME = '/Christopher_Yun_Resume.pdf';

const HELP: [string, string][] = [
  ['/agents', 'what his Claude Code agents have been doing'],
  ['/profile', 'who he is, in five lines'],
  ['/about', 'the longer version'],
  ['/skills', 'languages, backend, frontend, cloud'],
  ['/projects', 'everything he has shipped'],
  ['/experience', 'where he has worked'],
  ['/contact', 'email, GitHub, LinkedIn'],
  ['/resume', 'open the PDF'],
  ['/status', 'what this session is running on'],
  ['/cost', 'the bill for this conversation'],
  ['/clear', 'wipe the transcript'],
];

function read(file: string, lines: number): Step {
  return { name: 'Read', args: `~/christopher-yun/${file}`, result: `Read ${lines} lines`, runMs: 480 };
}

/* --------------------------------------------------------------- free-text search */

interface Hit {
  type: 'project' | 'job' | 'skill';
  id: string;
  label: string;
  detail: string;
  href?: string;
}

function search(query: string): Hit[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  const hits: Hit[] = [];

  for (const project of projects) {
    const haystack = [project.name, project.description, ...project.technologies, ...project.features]
      .join(' ')
      .toLowerCase();
    if (haystack.includes(q)) {
      hits.push({
        type: 'project',
        id: project.id,
        label: project.name,
        detail: project.description,
        href: project.liveUrl ?? (project.githubUrl?.startsWith('http') ? project.githubUrl : undefined),
      });
    }
  }

  for (const job of experience) {
    const haystack = [job.company, job.position, job.description, ...job.achievements, ...job.technologies]
      .join(' ')
      .toLowerCase();
    if (haystack.includes(q)) {
      hits.push({
        type: 'job',
        id: job.id,
        label: `${job.company} — ${job.position}`,
        detail: `${job.duration}. ${job.description}`,
      });
    }
  }

  for (const cat of techStack) {
    const match = cat.technologies.find(tech => tech.toLowerCase() === q || tech.toLowerCase().includes(q));
    if (match) {
      hits.push({
        type: 'skill',
        id: `${cat.category}-${match}`,
        label: match,
        detail: `listed under skills/${cat.category}`,
      });
    }
  }

  return hits;
}

function Hits({ query, hits }: { query: string; hits: Hit[] }) {
  return (
    <>
      <p>
        {hits.length} {hits.length === 1 ? 'match' : 'matches'} for{' '}
        <code>{query}</code>:
      </p>
      {hits.map(hit => (
        <div className="hit" key={`${hit.type}-${hit.id}`}>
          <span className="hit-kind">{hit.type}</span>
          <div>
            <div className="hit-label">
              {hit.href ? <Out href={hit.href}>{hit.label}</Out> : hit.label}
            </div>
            <div className="hit-detail">{hit.detail}</div>
          </div>
        </div>
      ))}
      <p className="muted-note">
        <code>/projects</code> and <code>/experience</code> have the full write-ups.
      </p>
    </>
  );
}

/* -------------------------------------------------------------------- dispatch */

/** Natural-language shortcuts, checked before falling through to search. */
const ROUTES: [RegExp, string][] = [
  [/\b(agent|agents|today|working on|claude code|tokens)\b/, '/agents'],
  [/\b(who|whoami|profile|name|introduce)\b/, '/profile'],
  [/\b(about|bio|background|story)\b/, '/about'],
  [/\b(skill|stack|tech|language|know)\b/, '/skills'],
  [/\b(project|built|build|ship|portfolio|work on)\b/, '/projects'],
  [/\b(experience|job|career|worked|employ|intern)\b/, '/experience'],
  [/\b(contact|email|reach|hire|linkedin|github)\b/, '/contact'],
  [/\b(resume|cv)\b/, '/resume'],
];

export function runCommand(raw: string): CommandResult {
  const input = raw.trim();
  if (!input) return {};

  const command = input.startsWith('/') ? input.split(/\s+/)[0].toLowerCase() : routeOf(input);

  switch (command) {
    case '/help':
      return {
        body: (
          <>
            <p>Slash commands this session knows:</p>
            <dl className="kv">
              {HELP.map(([name, description]) => (
                <div className="kv-row" key={name}>
                  <dt>
                    <code>{name}</code>
                  </dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
            <p className="muted-note">
              Anything that isn&apos;t a slash command gets grepped across the whole place.
            </p>
          </>
        ),
      };

    case '/agents':
      return {
        steps: [
          {
            name: 'Bash',
            args: 'claude sessions --since today --json',
            result: hasAgentStatus
              ? `${agentStatus.totals.sessions} sessions · ${agentStatus.totals.toolCalls.toLocaleString(
                  'en-US'
                )} tool calls · ${formatTokens(agentStatus.totals.tokens.total)} tokens`
              : 'no summary published yet',
            runMs: 900,
          },
        ],
        body: <Agents />,
      };

    case '/profile':
    case '/whoami':
      return { steps: [read('profile.md', 14)], body: <Profile /> };

    case '/about':
      return { steps: [read('about.md', 22)], body: <About /> };

    case '/skills':
      return {
        steps: [
          {
            name: 'Bash',
            args: 'ls -1 ~/christopher-yun/skills/',
            result: 'backend\nfrontend\nlanguages\nservices',
            runMs: 460,
          },
        ],
        body: <Skills />,
      };

    case '/projects':
      return {
        steps: [
          {
            name: 'Glob',
            args: '~/christopher-yun/projects/**/*.md',
            result: `Found ${projects.length} files`,
            runMs: 460,
          },
        ],
        body: <Projects />,
      };

    case '/experience':
    case '/work':
      return { steps: [read('career.log', 96)], body: <Experience /> };

    case '/contact':
      return { steps: [read('contact.json', 8)], body: <Contact /> };

    case '/resume':
      return {
        open: RESUME,
        steps: [
          { name: 'Read', args: 'Christopher_Yun_Resume.pdf', result: 'Opened in a new tab', runMs: 420 },
        ],
        body: (
          <p>
            Opened <Out href={RESUME}>Christopher_Yun_Resume.pdf</Out>. If the tab got blocked,
            that link works too.
          </p>
        ),
      };

    case '/status':
      return {
        body: (
          <Rows
            rows={[
              ['Session', 'christopher-yun (static export)'],
              ['Model', <code key="m">claude-opus-5</code>],
              ['cwd', <code key="c">~/christopher-yun</code>],
              ['Tools', 'Read · Glob · Bash · Task · Fetch'],
              ['Backend', 'none — every tool call above is theatre'],
              ['Uptime', 'as long as GitHub Pages holds'],
            ]}
          />
        ),
      };

    case '/cost':
      return {
        body: (
          <>
            <Rows
              rows={[
                ['Total cost', '$0.00'],
                ['API duration', '0s'],
                ['Lines added', '0'],
                ['Lines removed', '0'],
              ]}
            />
            <p className="muted-note">
              No tokens were spent. This is a static page doing an impression of an agent.
            </p>
          </>
        ),
      };

    case '/model':
      return {
        body: (
          <p>
            Running <code>claude-opus-5</code> in this fiction. In real life the author&apos;s
            two production projects — Priors and PokerNow AI — both call the actual Claude API.
          </p>
        ),
      };

    case '/clear':
      return { clear: true, note: <>Transcript cleared. Try /help.</> };

    default:
      break;
  }

  if (input.startsWith('/')) {
    return {
      note: (
        <>
          Unknown slash command: <code>{command}</code>. Try <code>/help</code>.
        </>
      ),
    };
  }

  const hits = search(input);
  if (hits.length === 0) {
    return {
      steps: [
        {
          name: 'Grep',
          args: `pattern: "${input}", path: "~/christopher-yun"`,
          result: 'No matches found',
          runMs: 620,
        },
      ],
      body: (
        <>
          <p>
            Nothing in the repo matches <code>{input}</code>.
          </p>
          <p className="muted-note">
            {personalInfo.name.split(' ')[0]} is reachable at{' '}
            <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a> for the questions this
            page can&apos;t answer. Otherwise <code>/help</code>.
          </p>
        </>
      ),
    };
  }

  const files = new Set(hits.map(hit => hit.type));
  return {
    steps: [
      {
        name: 'Grep',
        args: `pattern: "${input}", path: "~/christopher-yun"`,
        result: `Found ${hits.length} ${hits.length === 1 ? 'match' : 'matches'} across ${files.size} ${
          files.size === 1 ? 'file' : 'files'
        }`,
        runMs: 700,
      },
    ],
    body: <Hits query={input} hits={hits} />,
  };
}

function routeOf(input: string): string {
  const lower = input.toLowerCase();
  for (const [pattern, command] of ROUTES) {
    if (pattern.test(lower)) return command;
  }
  return '';
}

/** Exposed so the composer can hint at what exists. */
export const slashCommands = HELP.map(([name]) => name);
