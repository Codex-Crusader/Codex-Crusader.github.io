// Places the repositories onto the map as real settlements.
//
// The Afon Empire is a hand-drawn border. Rather than eyeball a dozen
// coordinates inside it and hope they still look right when a repo is added,
// this reads the province's own path out of the map at build time and does the
// cartography properly: point-in-polygon to stay inside the border, distance to
// the nearest edge so nothing crowds the coastline, and farthest-point sampling
// so the settlements spread out instead of clumping.
//
// The consequence is the part worth having. Nothing here is a fixed asset. Add
// a repo and the next nightly build re-surveys the province and redraws the
// settlements to fit -- the map is a function of the GitHub account, not a
// picture of it.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Resolved from the project root, not from import.meta.url. Astro bundles this
// module into dist/, so a path relative to the module resolves to
// dist/components/OrviaMap.astro -- which does not exist. Same reason
// resume.js measures the writ from process.cwd().
const MAP = resolve(process.cwd(), 'src/components/OrviaMap.astro');

// ── The province border ────────────────────────────────────────────────────
// Every gateway province is one closed polygon of M/L/Z commands, so the point
// list is simply every number pair in the path. No curve flattening needed.
function provincePolygon(src, href) {
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

  const nums = (d[1].match(/-?\d*\.?\d+/g) ?? []).map(Number);
  const points = [];
  for (let i = 0; i + 1 < nums.length; i += 2) points.push([nums[i], nums[i + 1]]);
  return points.length > 8 ? points : null;
}

function inside([x, y], poly) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

function distanceToEdge([x, y], poly) {
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const dx = xj - xi;
    const dy = yj - yi;
    const len = dx * dx + dy * dy;
    const t = len ? Math.max(0, Math.min(1, ((x - xi) * dx + (y - yi) * dy) / len)) : 0;
    const px = xi + t * dx;
    const py = yi + t * dy;
    best = Math.min(best, Math.hypot(x - px, y - py));
    if (best < 0.5) break;
  }
  return best;
}

// ── Keep-out ───────────────────────────────────────────────────────────────
// The map already has writing on it: province names, travel badges, the names
// of the neighbouring realms that spill across a border. A settlement printed
// under any of them is unreadable.
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

  for (const m of src.matchAll(/<text\b([^>]*)>([^<]*)<\/text>/g)) {
    const attrs = m[1];
    const text = m[2].trim();
    if (!text || text.includes('{')) continue; // skip the templated inscription
    const num = (name) => {
      const v = attrs.match(new RegExp(`\\b${name}="(-?[\\d.]+)"`));
      return v ? Number(v[1]) : null;
    };
    const x = num('x');
    const y = num('y');
    if (x === null || y === null) continue;
    const size = num('font-size') ?? 10;
    const spacing = num('letter-spacing') ?? 0;
    const w = text.length * (size * 0.62 + spacing);

    // text-anchor is inherited: the province names carry no anchor attribute of
    // their own and are centred by a parent <g>, which a per-element regex
    // cannot see. Measuring the live SVG showed the resulting box sitting 84
    // units to the right of the real one, which is how a settlement ended up
    // printed across "AFON EMPIRE".
    //
    // Rather than parse the group tree, cover both anchorings: a box from x - w
    // to x + w contains the text whether it is start-anchored or centred. Too
    // large costs a few candidate sites; too small costs a legible map.
    boxes.push({ x: x - w, y: y - size, w: w * 2, h: size * 1.6 });
  }

  // Travel badges are drawn as filled rects behind their label.
  for (const m of src.matchAll(/<rect\b([^>]*)\/>/g)) {
    const attrs = m[1];
    const num = (name) => {
      const v = attrs.match(new RegExp(`\\b${name}="(-?[\\d.]+)"`));
      return v ? Number(v[1]) : null;
    };
    const x = num('x');
    const y = num('y');
    const w = num('width');
    const h = num('height');
    if (x === null || y === null || !w || !h) continue;
    if (w > 400 || h > 300) continue; // the sea and the frame, not labels
    boxes.push({ x, y, w, h });
  }

  return boxes;
}

function blocked([x, y], boxes, pad = 7) {
  return boxes.some(
    (b) => x > b.x - pad && x < b.x + b.w + pad && y > b.y - pad && y < b.y + b.h + pad,
  );
}

export function placeSettlements(repos, href = '#projects') {
  if (repos.length === 0) return [];

  let src;
  try {
    src = readFileSync(MAP, 'utf8');
  } catch {
    // The settlements are a layer on the map, not the map. Losing them should
    // cost the province its dots, not the nightly build its deploy.
    console.warn(`settlements: could not read ${MAP}, drawing no settlements`);
    return [];
  }

  const poly = provincePolygon(src, href);
  if (!poly) return [];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of poly) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  // Only the writing that actually sits on this province matters. Restricting
  // the keep-out to the province bbox also contains the blast radius of the
  // transform blind spot above: the compass, scale bar and legend all live in
  // transformed groups whose raw coordinates fall well outside this box.
  const keepOut = obstacles(src).filter(
    (b) =>
      b.x + b.w > minX - 20 && b.x < maxX + 20 && b.y + b.h > minY - 20 && b.y < maxY + 20,
  );

  // Candidates on a fixed grid: deterministic, and dense enough that the
  // spacing pass has room to work without making the build think about it.
  const STEP = 5;
  const CLEARANCE = 15; // map units from the coastline
  const candidates = [];
  for (let y = minY; y <= maxY; y += STEP) {
    for (let x = minX; x <= maxX; x += STEP) {
      const p = [x, y];
      if (blocked(p, keepOut) || !inside(p, poly)) continue;
      if (distanceToEdge(p, poly) < CLEARANCE) continue;
      candidates.push(p);
    }
  }
  if (candidates.length === 0) return [];

  // Farthest-point sampling. Start from the candidate deepest inside the
  // province so the first settlement reads as the capital, then repeatedly take
  // whichever point is furthest from everything placed so far.
  const chosen = [];
  let seed = candidates[0];
  let seedDepth = -1;
  for (const p of candidates) {
    const d = distanceToEdge(p, poly);
    if (d > seedDepth) {
      seedDepth = d;
      seed = p;
    }
  }
  chosen.push(seed);

  while (chosen.length < Math.min(repos.length, candidates.length)) {
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

  // Busiest repos take the roomiest sites, so the eye lands on the biggest
  // project first rather than on whichever one happened to sort first.
  const order = repos
    .map((r, i) => ({ r, i }))
    .sort((a, b) => (b.r.commits ?? 0) - (a.r.commits ?? 0) || a.i - b.i);

  // ── Labelling ────────────────────────────────────────────────────────────
  // Spreading the dots is only half the job. "Uni-basketball-ETL-pipeline" is
  // 27 characters, which at map scale is wider than the gap between two
  // neighbouring settlements -- so the names collide even when the dots do not.
  // Each label is placed the way a cartographer would: preferred side first,
  // then the other side, then nudged off the line, and dropped rather than
  // printed over its neighbour. A dropped label keeps its dot, which is still
  // hoverable and still a link.
  // Twelve repository names, some of them 27 characters, will not fit legibly
  // inside a province 395 units wide. That is a density problem and no amount
  // of cleverer placement solves it -- the first attempt spread them perfectly
  // and they still overprinted each other and the province's own name.
  //
  // So the map does what maps do: it grades by importance. Cities and towns are
  // named on the sheet. Villages are drawn as dots and give up their names
  // until you point at one, at which point exactly one name is showing and
  // collisions between them stop mattering.
  const CHAR = 5.4; // JetBrains Mono at 9px
  const LABEL_H = 11;
  const GAP = 9; // dot to first letter

  // Seeded with the map's own writing, so a settlement name cannot be printed
  // across a province name any more than across another settlement.
  const standing = keepOut.slice();

  const clashes = (box, against) =>
    against.some(
      (b) =>
        box.x < b.x + b.w && box.x + box.w > b.x && box.y < b.y + b.h && box.y + box.h > b.y,
    );

  const site = (name, x, y, against) => {
    const w = name.length * CHAR;
    const preferred = x > (minX + maxX) / 2 ? 'left' : 'right';
    for (const dy of [0, -12, 12, -22, 22]) {
      for (const trial of [preferred, preferred === 'left' ? 'right' : 'left']) {
        const bx = trial === 'right' ? x + GAP : x - GAP - w;
        const box = { x: bx, y: y + dy - LABEL_H / 2, w, h: LABEL_H };
        if (box.x < 30 || box.x + box.w > 1506) continue; // off the sheet
        if (clashes(box, against)) continue;
        return { side: trial, dy, box };
      }
    }
    return null;
  };

  const marks = order.map(({ r }, n) => {
    const [x, y] = chosen[n % chosen.length];
    const commits = r.commits ?? 0;
    // Three ranks, drawn the way a real map grades a settlement.
    const rank = commits >= 60 ? 'city' : commits >= 20 ? 'town' : 'village';
    return { name: r.name, href: `#holding-${r.name.toLowerCase()}`, x, y, rank, commits };
  });

  // Named settlements are placed first and reserve their space for good.
  for (const m of marks.filter((s) => s.rank !== 'village')) {
    const spot = site(m.name, m.x, m.y, standing);
    if (spot) {
      standing.push(spot.box);
      m.side = spot.side;
      m.dy = spot.dy;
    } else {
      m.side = null;
      m.dy = 0;
    }
    m.always = Boolean(spot);
  }

  // Villages only have to avoid the permanent writing, not each other: one
  // shows at a time, on hover.
  for (const m of marks.filter((s) => s.rank === 'village')) {
    const spot = site(m.name, m.x, m.y, standing) ?? { side: 'right', dy: 0 };
    m.side = spot.side;
    m.dy = spot.dy;
    m.always = false;
  }

  return marks;
}
