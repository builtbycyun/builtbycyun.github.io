#!/usr/bin/env node
/**
 * Build public/commit-activity.json — commits per day, from GitHub's GraphQL
 * contributions API.
 *
 * This runs in GitHub Actions, not on a laptop, which is the whole point: the
 * commit heatmap stays current with nothing running locally. (Claude token data
 * can't work this way — it lives only in local session transcripts.)
 *
 * The contributions collection already includes private repositories when the
 * token can see them, and reports the same numbers as the profile graph.
 *
 *   GITHUB_TOKEN=... GITHUB_LOGIN=builtbycyun node scripts/commit-activity.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(HERE, '..', 'public', 'commit-activity.json');

const token = process.env.GITHUB_TOKEN;
const login = process.env.GITHUB_LOGIN;

if (!token || !login) {
  console.error('GITHUB_TOKEN and GITHUB_LOGIN are required.');
  process.exit(1);
}

const QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount }
          }
        }
      }
    }
  }
`;

const to = new Date();
const from = new Date(to.getTime() - 370 * 24 * 60 * 60 * 1000);

const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    Authorization: `bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'builtbycyun-activity',
  },
  body: JSON.stringify({
    query: QUERY,
    variables: { login, from: from.toISOString(), to: to.toISOString() },
  }),
});

if (!res.ok) {
  console.error(`GitHub API returned ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const body = await res.json();
if (body.errors?.length) {
  console.error(`GraphQL errors: ${JSON.stringify(body.errors)}`);
  process.exit(1);
}

const collection = body.data?.user?.contributionsCollection;
if (!collection) {
  console.error(`No contributions found for ${login}.`);
  process.exit(1);
}

const days = collection.contributionCalendar.weeks
  .flatMap(week => week.contributionDays)
  .map(day => ({ date: day.date, count: day.contributionCount }));

const active = days.filter(d => d.count > 0);
const payload = {
  login,
  generatedAt: new Date().toISOString(),
  totalContributions: collection.contributionCalendar.totalContributions,
  commitContributions: collection.totalCommitContributions,
  privateContributions: collection.restrictedContributionsCount,
  activeDays: active.length,
  busiest: active.reduce((best, d) => (d.count > (best?.count ?? 0) ? d : best), null),
  days,
};

await mkdir(dirname(OUT_PATH), { recursive: true });
await writeFile(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);

console.log(
  `${login}: ${payload.totalContributions} contributions over ${days.length} days ` +
    `(${active.length} active, ${payload.privateContributions} from private repos)`
);
console.log(`wrote ${OUT_PATH}`);
