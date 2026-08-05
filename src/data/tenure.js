// Reads the dates back out of a role's meta line so Ponstium Empire can draw
// each post against a shared timeline instead of just printing the string.
//
// The meta strings are written for humans and come in three shapes:
//
//   Apr 2026 — present · Mumbai · hybrid      both ends dated, open at the end
//   May — Jun 2026 · Navi Mumbai · on-site    one year, carried by the far end
//   Oct 2024 — Dec 2025 · Mumbai · on-site    both ends dated
//
// Everything after the first "·" is where and how, not when.
//
// This parses rather than asks for structured dates in profile.js on purpose:
// that file is meant to be edited by writing a sentence, and a second copy of
// the dates in a different format is a second thing to keep true. Anything that
// does not parse simply renders without a bar -- the sentence is still printed,
// so the reader loses a graphic, not a fact.

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const index = (year, month) => year * 12 + month;

function parsePoint(text, now, fallbackYear) {
  const clean = text.trim();
  if (/^(present|now|current)$/i.test(clean)) {
    return { at: index(now.getFullYear(), now.getMonth()), open: true };
  }
  const m = clean.match(/^([A-Za-z]{3})[a-z]*\.?\s*(\d{4})?$/);
  if (!m) return null;
  const month = MONTHS[m[1].toLowerCase()];
  if (month === undefined) return null;
  const year = m[2] ? Number(m[2]) : fallbackYear;
  if (!year) return null;
  return { at: index(year, month), open: false };
}

export function parseTenure(meta, now = new Date()) {
  if (!meta) return null;
  const datePart = meta.split('·')[0];
  const halves = datePart.split(/[—–]/);
  if (halves.length !== 2) return null;

  // The far end is parsed first: in "May — Jun 2026" it is the only half
  // carrying the year, and the near end borrows it.
  const end = parsePoint(halves[1], now);
  if (!end) return null;
  const start = parsePoint(halves[0], now, Math.floor(end.at / 12));
  if (!start || start.at > end.at) return null;

  return { start: start.at, end: end.at, open: end.open };
}

// Where and how, for the line under the title.
export function placeOf(meta) {
  const rest = meta.split('·').slice(1).map((s) => s.trim()).filter(Boolean);
  return rest.join(' · ');
}

export function monthsBetween(a, b) {
  return Math.max(1, b - a + 1);
}

export function spanLabel(tenure) {
  const n = monthsBetween(tenure.start, tenure.end);
  if (n < 12) return `${n} mo`;
  const years = Math.floor(n / 12);
  const months = n % 12;
  return months ? `${years}y ${months}m` : `${years}y`;
}

/**
 * Lay every post on one timeline so the bars can be compared by eye.
 * Returns null when nothing parsed, so the section falls back to plain entries.
 */
export function layTimeline(roles, now = new Date()) {
  const parsed = roles.map((role) => parseTenure(role.meta, now));
  const known = parsed.filter(Boolean);
  if (known.length < 2) return null;

  const first = Math.min(...known.map((t) => t.start));
  const last = Math.max(...known.map((t) => t.end));
  const span = Math.max(1, last - first);

  return {
    first,
    last,
    // Year gridlines, so the bars are read against something.
    years: Array.from(
      { length: Math.floor(last / 12) - Math.floor(first / 12) + 1 },
      (_, i) => {
        const year = Math.floor(first / 12) + i;
        return { year, at: ((index(year, 0) - first) / span) * 100 };
      },
    ).filter((y) => y.at >= 0 && y.at <= 100),
    bars: parsed.map((t) => {
      if (!t) return null;
      const left = ((t.start - first) / span) * 100;
      // monthsBetween counts inclusively so a one-month post is still visible,
      // which pushes any bar ending at the axis edge just past 100% and widens
      // the track past its column. Clamp to the axis.
      const width = Math.min(100 - left, (monthsBetween(t.start, t.end) / span) * 100);
      return { left, width, open: t.open, span: spanLabel(t) };
    }),
  };
}
