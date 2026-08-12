# Resume source

`resume.html` is the source for `public/Christopher_Yun_Resume.pdf`. Edit the HTML,
then rebuild the PDF:

```bash
npm run resume
```

That prints the HTML to `public/Christopher_Yun_Resume.pdf` with headless Chrome and
tells you the page count. If Chrome isn't found automatically, point at it:

```bash
CHROME_PATH="/path/to/chrome" npm run resume
```

The original LaTeX source for this resume was lost, so it was rebuilt as HTML in
August 2026. Nothing in this folder is deployed — Next.js only serves `public/`.

## Keeping it to one page

The layout is tuned to fill exactly one page, and adding a bullet will usually push
it to two. `npm run resume` fails loudly if that happens, so you won't ship a
two-page PDF by accident.

Three knobs control the fit, all near the top of `resume.html`:

- `--body` (currently `9.5pt`) — overall text size
- `line-height` on `body` (currently `1.20`)
- `@page margin` (currently `0.4in` top/bottom)

Nudge those before cutting content. Roughly 0.2pt of `--body` is worth one line.

## Notes

- Font is Cambria, not the Computer Modern of the old LaTeX version. The stack in
  `resume.html` prefers Latin Modern Roman if it is ever installed.
- Project dates for Auctionball and Journeyman (`2026 – Present`) were inferred from
  this repo's git history, not from real start dates. Fix them if you know better.
- Resume content is deliberately narrower than the site. `src/lib/data.ts` keeps the
  full history (CACI, Brivo, every project); the resume carries a one-page subset.
