export interface GraphDay {
  date: string;
  value: number;
  tooltip: string;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Local Date from YYYY-MM-DD — never `new Date(str)`, which reads it as UTC. */
function toDate(day: string): Date {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/**
 * Quartiles of the *active* days only. Including the zeros would put three of
 * four thresholds at 0 and paint every working day the darkest step.
 */
function levelThresholds(days: GraphDay[]): number[] {
  const active = days.filter(d => d.value > 0).map(d => d.value).sort((a, b) => a - b);
  if (active.length === 0) return [0, 0, 0, 0];
  const at = (q: number) => active[Math.min(active.length - 1, Math.floor(active.length * q))];
  return [at(0.25), at(0.5), at(0.75), at(0.9)];
}

/**
 * A contribution-style heatmap.
 *
 * Sequential encoding: one hue, faint → strong against the dark surface, so
 * magnitude reads without relying on hue discrimination. Cells are separated by
 * a surface gap rather than a stroke. Tooltips are native `title` attributes,
 * which keeps this page free of client JavaScript entirely — the trade is that
 * they appear on the browser's delay rather than instantly.
 */
export function ActivityGraph({
  days,
  caption,
  title,
  note,
}: {
  days: GraphDay[];
  caption: string;
  title: string;
  note?: string;
}) {
  if (days.length === 0) return null;

  const thresholds = levelThresholds(days);
  const levelOf = (value: number) => {
    if (value <= 0) return 0;
    if (value <= thresholds[0]) return 1;
    if (value <= thresholds[1]) return 2;
    if (value <= thresholds[2]) return 3;
    return 4;
  };

  // Pad the front so row 0 is always Sunday and columns are whole weeks.
  const leading = toDate(days[0].date).getDay();
  const cells: (GraphDay | null)[] = [...Array(leading).fill(null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = cells.length / 7;

  // Label a column when its first day opens a new month.
  const monthLabels: { col: number; label: string }[] = [];
  let lastMonth = -1;
  for (let col = 0; col < weeks; col++) {
    const first = cells[col * 7];
    if (!first) continue;
    const month = toDate(first.date).getMonth();
    if (month !== lastMonth) {
      lastMonth = month;
      monthLabels.push({ col, label: MONTHS[month] });
    }
  }

  return (
    <div className="activity">
      <div className="activity-head">
        <h3>{title}</h3>
        {note && <span className="activity-note">{note}</span>}
      </div>

      <div className="activity-scroll">
        <div className="activity-inner" style={{ ['--weeks' as string]: String(weeks) }}>
          <div className="activity-months">
            {monthLabels.map(({ col, label }) => (
              <span key={`${label}-${col}`} style={{ gridColumn: col + 1 }}>
                {label}
              </span>
            ))}
          </div>

          <div className="activity-grid" role="img" aria-label={`${title}. ${caption}`}>
            {cells.map((day, i) =>
              day ? (
                <span
                  key={day.date}
                  className={`cell lvl${levelOf(day.value)}`}
                  title={day.tooltip}
                />
              ) : (
                <span key={`pad-${i}`} className="cell pad" />
              )
            )}
          </div>
        </div>
      </div>

      <div className="activity-legend">
        <span className="activity-caption">{caption}</span>
        <span className="activity-scale">
          Less
          <span className="cell lvl0" />
          <span className="cell lvl1" />
          <span className="cell lvl2" />
          <span className="cell lvl3" />
          <span className="cell lvl4" />
          More
        </span>
      </div>
    </div>
  );
}
