// Scans assets/screenshots/<charter-slug>/, produces responsive WebP variants
// into public/screenshots/<charter-slug>/ and writes src/data/screenshots.json.
//
// Same shape as scan-photos.js, and separate from it on purpose. A photograph
// and a screenshot are different things with different jobs: the Republic of
// Corum is a gallery of plates that were kept, and these are evidence attached
// to a charter. Feeding both through one folder would put a screenshot of a
// dashboard into the photography province.
//
// Dropping a file into assets/screenshots/<slug>/ is the only action needed.
// There is no hardcoded list, and the folder name IS the charter slug: a folder
// naming no charter is reported and skipped rather than published as a set of
// images belonging to nothing.
//
// Naming matters more here than it does for photos, because the filename
// becomes both the alt text and part of the published URL. Name a file for what
// it shows: `exposure-report.jpg` becomes "Exposure report", which is a useful
// description to a screen reader and to an image search. `img2.jpg` becomes
// "Img2", which is neither.
//
// Metadata is stripped for the same reason it is on photographs. A screenshot
// carries less than a phone photo does, but "less" is not "none", and there is
// no reason for a build to pass anything through that it was not asked to.

import { readdir, mkdir, rm, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname, basename, join } from 'node:path';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(here, '../assets/screenshots');
const OUT_DIR = resolve(here, '../public/screenshots');
const OUT_JSON = resolve(here, '../src/data/screenshots.json');

// Narrower than the photo widths. A screenshot is shown inside the folio column
// rather than as a full-bleed plate, and 1600px of dashboard is bytes nobody
// reads. The largest is still enough for a retina display at that column width.
const WIDTHS = [480, 960, 1280];
const QUALITY = 80;
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// "exposure-report.jpg" -> "Exposure report"
function readable(slug) {
  const words = slug.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

async function main() {
  // The charter slugs, so a folder that names nothing can be reported. Imported
  // here rather than hardcoded, for the same reason everything else on this
  // site is: a second copy of the list would go stale the first time one was
  // renamed.
  const { default: charters } = await import('../src/data/charters.js');
  const slugs = new Set(charters.map((c) => c.slug));

  let dirs = [];
  try {
    dirs = (await readdir(SRC, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort((a, b) => a.localeCompare(b));
  } catch {
    console.warn('scan-screenshots: assets/screenshots/ does not exist, nothing to do.');
  }

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const byCharter = {};
  let total = 0;

  for (const slug of dirs) {
    if (!slugs.has(slug)) {
      console.warn(`scan-screenshots: no charter with slug "${slug}", skipping that folder`);
      continue;
    }

    const files = (await readdir(join(SRC, slug)))
      .filter((f) => EXTS.has(extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b));

    if (!files.length) continue;

    await mkdir(join(OUT_DIR, slug), { recursive: true });
    const shots = [];

    for (const file of files) {
      const name = basename(file, extname(file));
      const meta = await sharp(join(SRC, slug, file)).metadata();

      const targets = [
        ...new Set([
          ...WIDTHS.filter((w) => w < meta.width),
          Math.min(meta.width, WIDTHS.at(-1)),
        ]),
      ].sort((a, b) => a - b);

      const variants = [];
      for (const target of targets) {
        const out = `${name}-${target}.webp`;
        // No .withMetadata(): sharp writes these with no EXIF at all.
        const info = await sharp(join(SRC, slug, file))
          .resize({ width: target, withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toFile(join(OUT_DIR, slug, out));
        variants.push({ name: out, width: info.width });
      }

      shots.push({
        name,
        variants,
        width: meta.width,
        height: meta.height,
        ratio: Number((meta.width / meta.height).toFixed(3)),
        // The filename, made readable. The charter prefixes its own title, so
        // the alt a reader hears is "The Pulse Engine: a signal with its
        // reasoning" rather than a phrase with no subject.
        label: readable(name),
      });
      total += 1;
    }

    byCharter[slug] = shots;
  }

  await writeFile(OUT_JSON, JSON.stringify({ screenshots: byCharter }, null, 2) + '\n');
  const n = Object.keys(byCharter).length;
  console.log(
    `scan-screenshots: processed ${total} screenshot(s) across ${n} charter(s), metadata stripped.`,
  );
}

main().catch((err) => {
  console.error('scan-screenshots failed:', err.message);
  process.exit(1);
});
