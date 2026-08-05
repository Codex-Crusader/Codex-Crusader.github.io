// Surveys the whole realm: every province gets settlements drawn from the data
// that province is actually about.
//
//   Afon Empire      repositories        Republic of Corum   photographs
//   Ponstium Empire  posts held          Phoededia           roads out
//   Kingdom of Dequm the cartographer's seat
//
// Rather than eyeball coordinates inside a hand-drawn border and hope they still
// look right when something is added, this reads each province's own path out of
// the map at build time and does the cartography: point-in-polygon to stay
// inside the border, distance to the nearest edge so nothing crowds the
// coastline, and farthest-point sampling so settlements spread instead of clump.
//
// The consequence is the part worth having. Nothing here is a fixed asset. Add a
// repo, a role or a photograph and the next nightly build re-surveys that
// province and redraws it to fit -- the map is a function of the data, not a
// picture of it.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Resolved from the project root, not from import.meta.url. Astro bundles this
// module into dist/, so a path relative to the module resolves to
// dist/components/OrviaMap.astro -- which does not exist. Same reason
// resume.js measures the writ from process.cwd().
const MAP = resolve(process.cwd(), 'src/components/OrviaMap.astro');

// ── The province borders ───────────────────────────────────────────────────
// A gateway province is closed polygons of M/L/Z commands, so the point list is
// simply every number pair in each subpath. No curve flattening needed.
function provinceRings(src, href) {
  const anchor = src.match(
    new RegExp(`<a class="region-link" href="${href}"[\\s\\S]*?<\\/a>`),
  );
  if (!anchor) return null;
  const d = anchor[0].match(/class="land land-gateway" d="([^"]+)"/);
  if (!d) return null;

  // Guard the assumption rather than trusting it: a curve command would make
  // the raw number pairs meaningless and quietly scatter settlements into the
  // sea, which is exactly the kind of thing that looks fine in a diff.
  if (/[CcSsQqTtAaHhVv]/.test(d[1])) return null;

  const rings = d[1]
    .split(/(?=M)/)
    .filter(Boolean)
    .map((sub) => {
      const nums = (sub.match(/-?\d*\.?\d+/g) ?? []).map(Number);
      const pts = [];
      for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
      return pts;
    })
    .filter((r) => r.length > 8);

  return rings.length ? rings : null;
}

function inRing([x, y], ring) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

// A province drawn as several subpaths (a mainland plus its islands) is inside
// if an odd number of rings contain the point, which is also how the browser
// fills it.
const inside = (p, rings) => rings.reduce((n, r) => n + (inRing(p, r) ? 1 : 0), 0) % 2 === 1;

function distanceToEdge([x, y], rings) {
  let best = Infinity;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      const dx = xj - xi;
      const dy = yj - yi;
      const len = dx * dx + dy * dy;
      const t = len ? Math.max(0, Math.min(1, ((x - xi) * dx + (y - yi) * dy) / len)) : 0;
      best = Math.min(best, Math.hypot(x - (xi + t * dx), y - (yi + t * dy)));
      if (best < 0.5) return best;
    }
  }
  return best;
}

// ── Keep-out ───────────────────────────────────────────────────────────────
// The map already has writing on it: province names, travel badges, the names
// of neighbouring realms that spill across a border. A settlement printed under
// any of them is unreadable.
//
// These are read out of the map rather than typed in as coordinates. Hand-typed
// boxes are guesses that rot the moment a label moves, and the first version of
// this file proved it by dropping a settlement straight onto "AFON EMPIRE".
//
// Group transforms are ignored, so a transformed element (the compass, the
// scale bar, the legend) contributes a box in the wrong place. That is safe in
// the only direction that matters: an extra keep-out costs a few candidate
// sites, while a missed one costs a legible label.
function obstacles(src) {
  const boxes = [];
  const attr = (attrs, name) => {
    const v = attrs.match(new RegExp(`\\b${name}="(-?[\\d.]+)"`));
    return v ? Number(v[1]) : null;
  };

  for (const m of src.matchAll(/<text\b([^>]*)>([^<]*)<\/text>/g)) {
    const text = m[2].trim();
    if (!text || text.includes('{')) continue; // the templated inscription
    const x = attr(m[1], 'x');
    const y = attr(m[1], 'y');
    if (x === null || y === null) continue;
    const size = attr(m[1], 'font-size') ?? 10;
    const spacing = attr(m[1], 'letter-spacing') ?? 0;
    const w = text.length * (size * 0.62 + spacing);

    // text-anchor is inherited: the province names carry no anchor attribute of
    // their own and are centred by a parent <g>, which a per-element regex
    // cannot see. Measuring the live SVG showed the resulting box sitting 84
    // units right of the real one, which is how a settlement ended up printed
    // across "AFON EMPIRE". Rather than parse the group tree, cover both
    // anchorings: x - w to x + w contains the text either way.
    boxes.push({ x: x - w, y: y - size, w: w * 2, h: size * 1.6 });
  }

  // Travel badges are drawn as filled rects behind their label.
  for (const m of src.matchAll(/<rect\b([^>]*)\/>/g)) {
    const x = attr(m[1], 'x');
    const y = attr(m[1], 'y');
    const w = attr(m[1], 'width');
    const h = attr(m[1], 'height');
    if (x === null || y === null || !w || !h) continue;
    if (w > 400 || h > 300) continue; // the sea and the frame, not labels
    boxes.push({ x, y, w, h });
  }

  return boxes;
}

// ── Placement ──────────────────────────────────────────────────────────────
const CHAR = 5.4; // JetBrains Mono at 9px
const LABEL_H = 11;
const GAP = 9; // dot to first letter

// The longest a name may be drawn on the sheet, in characters.
//
// A province is roughly 395 units across and a character is 5.4 of them, so a
// 41-character repository name is 221 units: it takes up more than half the
// country it belongs to and runs out over the border into land that is not
// labelled at all. 26 is about 140 units, near enough a third, which is what
// the rest of the names already sit at.
//
// This is a cap and not a plea to name things shorter. Repository names arrive
// from the GitHub API and photograph captions from filenames, so the longest
// label is not a fixed fact about this site: it is whatever gets created next.
// The map has to survive that without being redrawn by hand.
const LABEL_MAX = 26;

// Cut at a separator rather than mid-word, so the stub still reads as a name.
// `Pulse-Engine_Market_Intelligence_Platform` becomes `Pulse-Engine_Market…`
// rather than `Pulse-Engine_Market_Intel…`, which is a name with a word
// snapped in half and looks like a rendering fault rather than a decision.
//
// The floor stops a separator that falls early from leaving a two-letter stub:
// `a-very-long-single-token-name` would trim back to `a…`, which identifies
// nothing. Below the floor it takes the plain cut, on the grounds that a
// truncated word is still more use than one letter.
//
// Nothing is lost by this. The <title> on each settlement carries the whole
// name, which is both the hover tooltip and the link's accessible name, and
// the settlement links into the folio where the name is written out in full.
function shorten(label) {
  if (label.length <= LABEL_MAX) return label;
  const cut = label.slice(0, LABEL_MAX - 1);
  const at = Math.max(
    cut.lastIndexOf('-'),
    cut.lastIndexOf('_'),
    cut.lastIndexOf(' '),
    cut.lastIndexOf('.'),
  );
  const stem = at >= Math.floor(LABEL_MAX * 0.55) ? cut.slice(0, at) : cut.trimEnd();
  return `${stem}…`;
}

// Rank by standing within its own province, not against an absolute number:
// what counts as a city among twelve repositories is not what counts as one
// among four roads. Roughly the top sixth are cities, the next fifth towns.
function rankOf(i, total) {
  if (i < Math.max(1, Math.round(total * 0.16))) return 'city';
  if (i < Math.max(2, Math.round(total * 0.4))) return 'town';
  return 'village';
}

function sitesIn(rings, keepOut, wanted) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const ring of rings) {
    for (const [x, y] of ring) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  const near = keepOut.filter(
    (b) => b.x + b.w > minX - 20 && b.x < maxX + 20 && b.y + b.h > minY - 20 && b.y < maxY + 20,
  );
  const blocked = ([x, y]) =>
    near.some((b) => x > b.x - 7 && x < b.x + b.w + 7 && y > b.y - 7 && y < b.y + b.h + 7);

  // Phoededia is a fraction of the Afon Empire's area, so a clearance that
  // suits one leaves the other with nowhere to stand. Relax until the province
  // can actually hold what it has been asked to hold.
  let candidates = [];
  for (const clearance of [15, 11, 8, 5, 3]) {
    candidates = [];
    for (let y = minY; y <= maxY; y += 5) {
      for (let x = minX; x <= maxX; x += 5) {
        const p = [x, y];
        if (blocked(p) || !inside(p, rings)) continue;
        if (distanceToEdge(p, rings) < clearance) continue;
        candidates.push(p);
      }
    }
    if (candidates.length >= wanted) break;
  }
  if (!candidates.length) return { chosen: [], minX, maxX };

  // Farthest-point sampling. Start from the candidate deepest inside the
  // province so the first settlement reads as the capital, then repeatedly take
  // whichever point is furthest from everything placed so far.
  let seed = candidates[0];
  let deepest = -1;
  for (const p of candidates) {
    const d = distanceToEdge(p, rings);
    if (d > deepest) {
      deepest = d;
      seed = p;
    }
  }

  const chosen = [seed];
  while (chosen.length < Math.min(wanted, candidates.length)) {
    let best = null;
    let bestGap = -1;
    for (const p of candidates) {
      let gap = Infinity;
      for (const c of chosen) {
        const d = Math.hypot(p[0] - c[0], p[1] - c[1]);
        if (d < gap) gap = d;
      }
      if (gap > bestGap) {
        bestGap = gap;
        best = p;
      }
    }
    if (!best) break;
    chosen.push(best);
  }

  return { chosen, minX, maxX };
}

/**
 * Survey the realm.
 *
 * @param groups [{ href, items: [{ label, href, weight }] }]
 * @returns { [provinceHref]: mark[] }
 */
export function surveyRealm(groups) {
  let src;
  try {
    src = readFileSync(MAP, 'utf8');
  } catch {
    // The settlements are a layer on the map, not the map. Losing them should
    // cost the provinces their dots, not the nightly build its deploy.
    console.warn(`settlements: could not read ${MAP}, drawing no settlements`);
    return {};
  }

  const keepOut = obstacles(src);
  const out = {};
  const marks = [];

  for (const group of groups) {
    out[group.href] = [];
    const items = group.items.filter((i) => i && i.label);
    if (!items.length) continue;

    const rings = provinceRings(src, group.href);
    if (!rings) continue;

    const { chosen, minX, maxX } = sitesIn(rings, keepOut, items.length);
    if (!chosen.length) continue;

    const ordered = items
      .map((item, i) => ({ item, i }))
      .sort((a, b) => (b.item.weight ?? 0) - (a.item.weight ?? 0) || a.i - b.i);

    ordered.forEach(({ item }, n) => {
      const [x, y] = chosen[n % chosen.length];
      const mark = {
        label: item.label,
        // What is actually lettered on the sheet. `label` stays whole: it is
        // the settlement's <title>, so the tooltip and the accessible name are
        // never the truncated version.
        short: shorten(item.label),
        href: item.href,
        note: item.note ?? '',
        x,
        y,
        rank: rankOf(n, ordered.length),
        midX: (minX + maxX) / 2,
      };
      out[group.href].push(mark);
      marks.push(mark);
    });
  }

  // ── Labelling, across the whole realm at once ────────────────────────────
  // Twelve repository names, some 27 characters long, will not fit legibly
  // inside a province 395 units wide. That is a density problem and no amount
  // of cleverer placement solves it -- an early version spread the dots
  // perfectly and the names still overprinted each other and the province's own
  // name. So the map does what maps do and grades by importance: cities and
  // towns are named on the sheet, villages are dots that give up their names
  // only when pointed at or zoomed into, at which point exactly one is showing
  // and collisions between them stop mattering.
  //
  // The pass runs over every province together rather than one at a time,
  // because a name near a border has to clear its neighbours across that border
  // just as much as its own countrymen.
  const standing = keepOut.slice();

  const clashes = (box) =>
    standing.some(
      (b) =>
        box.x < b.x + b.w && box.x + box.w > b.x && box.y < b.y + b.h && box.y + box.h > b.y,
    );

  const site = (mark) => {
    // Measured on what is drawn, not on what the settlement is called. The
    // keep-out scan reserves the space the ink actually occupies.
    const w = mark.short.length * CHAR;
    const preferred = mark.x > mark.midX ? 'left' : 'right';
    for (const dy of [0, -12, 12, -22, 22]) {
      for (const trial of [preferred, preferred === 'left' ? 'right' : 'left']) {
        const bx = trial === 'right' ? mark.x + GAP : mark.x - GAP - w;
        const box = { x: bx, y: mark.y + dy - LABEL_H / 2, w, h: LABEL_H };
        if (box.x < 30 || box.x + box.w > 1506) continue; // off the sheet
        if (clashes(box)) continue;
        return { side: trial, dy, box };
      }
    }
    return null;
  };

  const RANKS = { city: 0, town: 1, village: 2 };
  // Cities claim their space first, then towns; villages take what is left.
  for (const mark of [...marks].sort((a, b) => RANKS[a.rank] - RANKS[b.rank])) {
    const spot = site(mark);
    const named = mark.rank !== 'village';
    if (spot && named) standing.push(spot.box);
    mark.side = spot ? spot.side : 'right';
    mark.dy = spot ? spot.dy : 0;
    // A named settlement with nowhere honest to put its name falls back to
    // showing it on hover rather than printing it over a neighbour.
    mark.always = Boolean(spot) && named;
  }

  return out;
}
