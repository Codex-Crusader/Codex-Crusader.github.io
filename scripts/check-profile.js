// Warns about anything in profile.js that is still blank. Never fails the
// build: an incomplete contact row is skipped at render time, not shipped
// broken, so this is a nudge rather than a gate.

import profile from '../src/data/profile.js';

const blanks = profile.contact.links
  .filter(([, text, href]) => !href || !text)
  .map(([label]) => label.toLowerCase());

if (blanks.length) {
  console.warn(
    `check-profile: not published yet, no value set in profile.js -> ${blanks.join(', ')}`,
  );
}
