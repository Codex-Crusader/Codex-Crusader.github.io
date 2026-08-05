// Draws the social share card from the map the site actually ships.
//
// The card used to be a file someone exported once. It was committed in July,
// the realm grew settlements in August, and every share of the link kept
// showing a map of an empty country — the one thing the site does best, absent
// from the only picture most people ever see of it. A survey that redraws
// itself nightly should not have a hand-made photograph of itself attached.
//
// So the card is drawn from dist/index.html after the build, which means it is
// the same sheet, with the same provinces and the same settlements, every time.
// Add a repository and the card gains a town on the next run without anyone
// remembering to redraw it.
//
// Run by `npm run cover`, after `astro build`.

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const page = process.argv[2] ?? 'dist/index.html';
const out = process.argv[3] ?? 'dist/og-cover.png';

// og:image:width / og:image:height in the page say 1200x630. If these two ever
// disagree, the card is the wrong shape in every preview that trusts the tags.
const CARD = { width: 1200, height: 630 };

if (!fs.existsSync(page)) {
  console.warn(`draw-cover: no ${page}, nothing to draw from`);
  process.exit(0);
}

const html = fs.readFileSync(page, 'utf8');
const found = html.match(/<svg[\s\S]*?<\/svg>/);

if (!found) {
  // The build has already succeeded at this point, and a missing card costs a
  // preview image rather than a page. Warn and leave whatever is in public/.
  console.warn('draw-cover: no <svg> in the built page, keeping the existing cover');
  process.exit(0);
}

let svg = found[0];

// Two labels are drawn into the SVG and the stylesheet picks one: the pointer
// wording and the touch wording. A rasteriser has no stylesheet, so both land
// on the same baseline and print as a pile. The card is a picture of a map
// being read on a screen, so it keeps the pointer wording.
svg = svg.replace(/<text class="map-hint-touch"[\s\S]*?<\/text>/g, '');

// Same problem, and this is the one that decides whether the card is legible.
// Villages keep their names to themselves until pointed at — twelve repository
// names at once is an unreadable map, which is the entire reason the labels are
// graded by rank. The grading is `opacity: 0`, invisible to a rasteriser, so
// every village name would print at full strength and rebuild the exact pile
// the grading exists to prevent. Cities and towns stay; villages stay dots.
const villages = (svg.match(/<text class="settlement-label minor"/g) || []).length;
svg = svg.replace(/<text class="settlement-label minor"[\s\S]*?<\/text>/g, '');

// The live sheet is width:100%, which a rasteriser cannot resolve. Give it the
// viewBox's own dimensions so it draws at the proportions it was drawn in.
svg = svg.replace(
  /style="width: 100%; height: auto; display: block;"/,
  'width="1536" height="695"',
);

// The sheet is 1536x695 and the card is 1200x630, a slightly taller shape, so
// containing the whole sheet leaves a band top and bottom. Fill it with the
// map's own sea colour — the same #E9DFC4 the panel is drawn on — so the card
// reads as a sheet of paper with a margin rather than a letterboxed screenshot.
// A palette PNG, because of what this particular picture is: flat parchment,
// fine linework and a dozen earth colours. Measured against the alternatives at
// this size — 752 KB as truecolour, 349 at 256 colours, 113 at 128, and no
// visible banding in the parchment gradients at 128. A share card is fetched by
// a scraper on someone else's connection, so three quarters of a megabyte for
// an image indistinguishable from a tenth of that is worth nothing.
await sharp(Buffer.from(svg), { density: 200 })
  .resize(CARD.width, CARD.height, { fit: 'contain', background: '#E9DFC4' })
  .png({ compressionLevel: 9, palette: true, colours: 128 })
  .toFile(out);

// The card is written straight into dist/ and never committed back, the same
// rule the repository already follows for github.json and the photo variants.
// public/og-cover.png stays as the fallback for a build that cannot draw one.
const kb = (fs.statSync(out).size / 1024).toFixed(0);
console.log(
  `draw-cover: ${path.basename(out)} ${CARD.width}x${CARD.height}, ${kb} KB, ${villages} village labels held back`,
);
