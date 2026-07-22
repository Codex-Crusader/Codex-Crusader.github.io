// Creates empty stubs for the two generated data files if they are missing, so
// a fresh clone can `npm run build` without first hitting the network.
// Real data comes from `npm run sync` and `npm run photos`.

import { access, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const stubs = [
  ['../src/data/github.json', { profile: null, repos: [] }],
  ['../src/data/photos.json', { photos: [] }],
];

for (const [rel, stub] of stubs) {
  const path = resolve(here, rel);
  try {
    await access(path);
  } catch {
    await writeFile(path, JSON.stringify(stub, null, 2) + '\n');
    console.log(`ensure-data: created empty ${rel.replace('../', '')}`);
  }
}
