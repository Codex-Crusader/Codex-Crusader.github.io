// Scans assets/photos/, produces responsive WebP variants into public/photos/
// and writes src/data/photos.json.
//
// Dropping a file into assets/photos/ is the only action needed to publish it.
// There is no hardcoded photo list.
//
// Privacy: sharp applies the EXIF orientation with .rotate() and then writes
// output with no metadata at all. Phone photos carry GPS coordinates, so the
// stripping is the point, not an optimisation.

import { readdir, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname, basename, join } from 'node:path';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(here, '../assets/photos');
const OUT_DIR = resolve(here, '../public/photos');
const OUT_JSON = resolve(here, '../src/data/photos.json');

const WIDTHS = [480, 960, 1600];
const QUALITY = 78;
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// "cliffside-at-dusk-02.jpg" -> "Cliffside at dusk 02"
function readable(slug) {
  const words = slug.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

async function main() {
  let files = [];
  try {
    files = await readdir(SRC);
  } catch {
    console.warn('scan-photos: assets/photos/ does not exist, nothing to do.');
  }

  const images = files
    .filter((f) => EXTS.has(extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const photos = [];

  for (const file of images) {
    const slug = basename(file, extname(file));
    const meta = await sharp(join(SRC, file)).metadata();

    // EXIF orientations 5–8 rotate by 90°, so the stored width and height are
    // the wrong way round compared to how the photo actually displays.
    const turned = meta.orientation >= 5 && meta.orientation <= 8;
    const width = turned ? meta.height : meta.width;
    const height = turned ? meta.width : meta.height;

    // Never upscale. Ask for the standard widths that fit, plus the natural
    // width itself when it falls between two of them.
    const targets = [...new Set([...WIDTHS.filter((w) => w < width), Math.min(width, WIDTHS.at(-1))])]
      .sort((a, b) => a - b);

    const variants = [];
    for (const target of targets) {
      const name = `${slug}-${target}.webp`;
      // No .withMetadata() anywhere in this chain: sharp writes the output with
      // no EXIF, no GPS, no maker notes.
      const info = await sharp(join(SRC, file))
        .rotate() // bakes in the EXIF orientation
        .resize({ width: target, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(join(OUT_DIR, name));
      // Use what was actually written, so the srcset descriptors are honest.
      variants.push({ name, width: info.width });
    }

    photos.push({
      slug,
      // Paths are relative so the site works under a GitHub Pages base path.
      // The page prefixes them with import.meta.env.BASE_URL.
      variants,
      width,
      height,
      ratio: Number((width / height).toFixed(3)),
      orientation: height > width ? 'portrait' : width > height ? 'landscape' : 'square',
      alt: readable(slug),
      caption: readable(slug).toLowerCase(),
    });
  }

  await writeFile(OUT_JSON, JSON.stringify({ photos }, null, 2) + '\n');
  console.log(`scan-photos: processed ${photos.length} photo(s), metadata stripped.`);
}

main().catch((err) => {
  console.error('scan-photos failed:', err.message);
  process.exit(1);
});
