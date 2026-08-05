// Turns a repository into a holding on the map.
//
// A survey marks a settlement with a symbol, not a screenshot, and it draws
// every symbol from the same small legend. So each repo gets one of eight
// cartographic marks, chosen by hashing its name: stable across builds, no
// list to maintain, and a new repo is drawn the moment it appears.
//
// The materials ramp deliberately does NOT use GitHub's language colours.
// Linguist's palette is built for a white page -- dropping #3572A5 blue and
// #f1e05a yellow onto parchment reads as a foreign object pasted over the
// survey. These are drawn from the ink already in use, so a language bar looks
// like something the cartographer mixed rather than something imported.

// FNV-1a. Small, stable, and dependency-free -- the same name always draws the
// same mark, on any machine, in any build.
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

// Eight marks from the legend. Drawn on a 40x40 field, stroked rather than
// filled so they sit in the same ink as the map's own symbols.
export const SYMBOLS = {
  keep: '<path d="M7 33V15h3v-3h4v3h12v-3h4v3h3v18Z"/><path d="M17 33v-8h6v8"/>',
  tower:
    '<path d="M14 33V13h12v20Z"/><path d="M12 13h16l-2-4H14Z"/><circle cx="20" cy="20" r="2.2"/>',
  port:
    '<circle cx="20" cy="10" r="3"/><path d="M20 13v18"/><path d="M12 18h16"/><path d="M9 25c0 6 5 8 11 8s11-2 11-8"/>',
  mine:
    '<path d="M8 33h24"/><path d="M13 33V22a7 7 0 0 1 14 0v11"/><path d="M20 33v-7"/>',
  bridge:
    '<path d="M5 26h30"/><path d="M8 26a12 9 0 0 1 24 0"/><path d="M8 26v7"/><path d="M32 26v7"/>',
  abbey:
    '<path d="M12 33V18l8-7 8 7v15Z"/><path d="M20 11V6"/><path d="M17 8h6"/><path d="M17 33v-8h6v8"/>',
  waymark: '<path d="M15 33 16 14a4 4 0 0 1 8 0l1 19Z"/><path d="M8 33h24"/>',
  forge:
    '<path d="M10 18h16l-3 5H13Z"/><path d="M17 23h6v5h-6Z"/><path d="M12 28h16v3H12Z"/>',
};

const SYMBOL_KEYS = Object.keys(SYMBOLS);

export function symbolFor(name) {
  return SYMBOL_KEYS[hash(name) % SYMBOL_KEYS.length];
}

// Six materials. Distinguishable side by side, all of them plausible as ink or
// pigment on this paper.
const MATERIALS = [
  '#8C3B22', // rust
  '#6B5836', // umber
  '#B08A3E', // ochre
  '#5A6B70', // slate
  '#6E7A4E', // sage
  '#7A4A5A', // plum
];

// Colour by language name, so Python is the same shade in every holding on the
// page. Within a single repo a collision would make two materials look like
// one, so a taken shade steps to the next free slot.
export function materialsFor(languages = []) {
  const used = new Set();
  return languages.map(({ lang, pct }) => {
    let i = hash(lang) % MATERIALS.length;
    for (let n = 0; n < MATERIALS.length && used.has(i); n++) {
      i = (i + 1) % MATERIALS.length;
    }
    used.add(i);
    return { lang, pct, colour: MATERIALS[i] };
  });
}

// Topics are the interesting half of a repo's metadata and there are often ten
// of them. Show the ones that say something and count the rest.
export function bannersFor(topics = [], limit = 5) {
  return { shown: topics.slice(0, limit), rest: Math.max(0, topics.length - limit) };
}
