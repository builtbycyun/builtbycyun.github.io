#!/usr/bin/env node
/**
 * Build public/Christopher_Yun_Resume.pdf from resume/resume.html.
 *
 * The original LaTeX source for the resume was lost, so the resume is now an
 * HTML file printed to PDF by headless Chrome.
 *
 * Chrome needs an absolute file:// URL here. Handing it a relative path like
 * "resume/resume.html" makes it treat "resume" as a hostname and silently print
 * a DNS error page instead of the resume, so this script always resolves the
 * path first.
 *
 *   npm run resume
 *   CHROME_PATH="/path/to/chrome" npm run resume   # if auto-detection misses
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const SRC_PATH = join(ROOT, 'resume', 'resume.html');
const OUT_PATH = join(ROOT, 'public', 'Christopher_Yun_Resume.pdf');

const CHROME_CANDIDATES = {
  win32: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ],
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ],
  linux: ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'],
};

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const found = (CHROME_CANDIDATES[process.platform] ?? []).find((p) => existsSync(p));
  if (found) return found;
  console.error(
    'Could not find Chrome. Set CHROME_PATH to the browser binary and try again.',
  );
  process.exit(1);
}

/**
 * Page count straight out of the page tree. Chrome writes a flat one, so the
 * first /Count is the number of pages. The resume is meant to be one page, and
 * spilling onto a second is the failure that actually happens when editing it.
 */
function pageCount(pdfPath) {
  const match = readFileSync(pdfPath, 'latin1').match(/\/Count\s+(\d+)/);
  return match ? Number(match[1]) : null;
}

if (!existsSync(SRC_PATH)) {
  console.error(`Missing ${SRC_PATH}`);
  process.exit(1);
}

const chrome = findChrome();
const result = spawnSync(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${OUT_PATH}`,
    pathToFileURL(SRC_PATH).href,
  ],
  { stdio: ['ignore', 'ignore', 'pipe'] },
);

if (result.error || result.status !== 0) {
  console.error(result.error?.message ?? result.stderr?.toString() ?? 'Chrome failed.');
  process.exit(1);
}

const pages = pageCount(OUT_PATH);
console.log(`Wrote public/Christopher_Yun_Resume.pdf (${pages ?? '?'} page${pages === 1 ? '' : 's'})`);

if (pages !== null && pages > 1) {
  console.warn(
    '\nThis resume is meant to fit on one page. See resume/README.md for the\n' +
      'three knobs that control the fit before cutting content.',
  );
  process.exit(1);
}
