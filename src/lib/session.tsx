import type { Turn } from './blocks';
import { projects, techStack } from './data';
import { getAuctionballGames } from './liveStats';
import { About, Contact, Experience, Profile, Projects, Skills } from './answers';

const skillCount = techStack.reduce((n, cat) => n + cat.technologies.length, 0);

/**
 * The scripted tour. Each entry is one prompt the visitor "sends" by scrolling,
 * plus the tool calls and answer that come back.
 */
export const turns: Turn[] = [
  {
    prompt: 'whose repo is this?',
    steps: [
      { name: 'Read', args: '~/christopher-yun/profile.md', result: 'Read 14 lines', runMs: 620 },
    ],
    answer: () => <Profile />,
  },
  {
    prompt: 'give me the honest version — what is he actually about?',
    thinking: 'profile.md is the résumé line. about.md is where the person is.',
    steps: [
      { name: 'Read', args: '~/christopher-yun/about.md', result: 'Read 22 lines', runMs: 700 },
    ],
    answer: () => <About />,
  },
  {
    prompt: 'ok. walk me through the whole thing',
    todos: [
      { text: 'Inventory the skills directory', done: false },
      { text: 'Read every project in projects/', done: false },
      { text: 'Walk the career log', done: false },
      { text: 'Pull contact details and the resume', done: false },
    ],
    answer: () => <p>On it — four passes, in that order.</p>,
  },
  {
    prompt: 'what is he actually good with?',
    steps: [
      {
        name: 'Bash',
        args: 'ls -1 ~/christopher-yun/skills/',
        result: 'backend\nfrontend\nlanguages\nservices',
        runMs: 540,
      },
      {
        name: 'Task',
        args: 'Survey each skills subdirectory',
        result: `Done (4 tool uses · ${skillCount} entries · 11.2s)`,
        runMs: 1500,
      },
    ],
    answer: () => <Skills />,
  },
  {
    prompt: 'what has he built?',
    thinking: 'Read them all in one pass, then check whether the live ones are still up.',
    steps: [
      {
        name: 'Glob',
        args: '~/christopher-yun/projects/**/*.md',
        result: `Found ${projects.length} files`,
        runMs: 480,
      },
      {
        name: 'Read',
        args: `${projects.length} files in parallel`,
        result: `Read ${projects.length} files (612 lines)`,
        runMs: 1250,
      },
      {
        name: 'Fetch',
        args: 'wss://auctionball.xyz — lifetime games counter',
        result: () => {
          const games = getAuctionballGames();
          return games === null
            ? 'no response in 12s — skipping the live counter'
            : `200 OK · ${games.toLocaleString()} games played`;
        },
        runMs: 1100,
      },
    ],
    answer: () => <Projects />,
  },
  {
    prompt: 'where has he worked?',
    steps: [
      {
        name: 'Read',
        args: '~/christopher-yun/career.log',
        result: 'Read 96 lines',
        runMs: 720,
      },
    ],
    answer: () => <Experience />,
  },
  {
    prompt: 'how do I get in touch?',
    steps: [
      {
        name: 'Read',
        args: '~/christopher-yun/contact.json',
        result: 'Read 8 lines',
        runMs: 520,
      },
    ],
    answer: () => <Contact />,
  },
  {
    prompt: 'thanks',
    todos: [
      { text: 'Inventory the skills directory', done: true },
      { text: 'Read every project in projects/', done: true },
      { text: 'Walk the career log', done: true },
      { text: 'Pull contact details and the resume', done: true },
    ],
    answer: () => (
      <>
        <p>That&apos;s the whole repo.</p>
        <p className="muted-note">
          The prompt below is yours now. <code>/help</code> lists what it knows, or type any
          word — <code>aws</code>, <code>poker</code>, <code>rust</code>, <code>auction</code>{' '}
          — and it&apos;ll grep the place for you.
        </p>
      </>
    ),
  },
];
