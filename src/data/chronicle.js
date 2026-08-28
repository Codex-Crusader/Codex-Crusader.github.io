// The chronicles, resolved and measured, the way resume.js resolves the writ.
//
// writing.js holds the prose and nothing else. Everything a page needs to say
// ABOUT an article is worked out here at build time, so no figure a reader uses
// to make a decision is ever a number somebody typed and forgot.
//
//   · word count and reading time are counted from the body
//   · the address is derived from the slug in one place
//   · the article-to-project links are resolved against the real survey
//   · the reverse project-to-article links are inverted from the same data
//
// The last two are the point of this file. An article names the projects it is
// about; a charter never names an article. The reverse index is computed here,
// so the two directions cannot disagree and there is no second list to update
// when an article is written.
//
// ── On failing the build ────────────────────────────────────────────────────
//
// A project name that matches no surveyed repository is a typo in a file
// somebody just edited, and it fails the build rather than warning. That is
// deliberately harsher than the rule charters.js keeps for a missing repo,
// where the world changed under the site and a deploy should still go out.
//
// The check is skipped when the survey is empty, because `npm run build` is
// required to work on a fresh clone with no network: ensure-data.js drops in
// empty stubs, and a validation that cannot tell "no such repo" from "no data
// yet" would fail every clone. An empty survey means unknown, not absent.

import writing from './writing.js';
import charters from './charters.js';
import github from './github.json';

const env = import.meta.env ?? {};
const base = env.BASE_URL ?? '/';

const repos = github.repos ?? [];
const surveyed = new Set(repos.map((r) => r.name));
const charterOf = new Map(charters.map((c) => [c.repo, c]));

// Words, counted rather than estimated. Headings are included because a reader
// reads them; the standfirst is not, because it is the summary of the thing and
// counting it would count it twice.
function wordsIn(article) {
  const parts = [];
  for (const section of article.sections ?? []) {
    if (section.heading) parts.push(section.heading);
    parts.push(...(section.paragraphs ?? []));
  }
  return parts.join(' ').trim().split(/\s+/).filter(Boolean).length;
}

// 220 words a minute, rounded up, floored at one. Prose read on a screen, not
// a technical paper read with a pen, which is the pace this is actually read at.
// Rounded to a whole minute because "4.3 minutes" is a made-up precision: the
// figure exists to answer "have I got time for this", and no reader needs a
// decimal to decide that.
function minutesFor(words) {
  return Math.max(1, Math.ceil(words / 220));
}

const articles = writing
  .map((article) => {
    const words = wordsIn(article);

    const projects = (article.projects ?? []).map((repo) => {
      if (surveyed.size && !surveyed.has(repo)) {
        throw new Error(
          `writing.js: article "${article.slug}" names project "${repo}", which is not a surveyed repository. ` +
            `Use the exact repository name. Surveyed: ${[...surveyed].sort().join(', ')}`,
        );
      }
      const charter = charterOf.get(repo);
      const found = repos.find((r) => r.name === repo);
      return {
        repo,
        // A project with a charter is linked to its charter, which is the page
        // written about it. One without is linked to its holding on the map,
        // which is the only address it has. Same rule the register keeps.
        title: charter?.title ?? repo,
        href: charter ? `${base}projects/${charter.slug}/` : `${base}#holding-${repo.toLowerCase()}`,
        hasCharter: Boolean(charter),
        description: found?.description ?? null,
      };
    });

    return {
      ...article,
      // The resolved objects, replacing the bare names writing.js wrote. A page
      // wants a title and an address; the name was only ever the key.
      projects,
      words,
      readingTime: minutesFor(words),
      path: `writing/${article.slug}/`,
      href: `${base}writing/${article.slug}/`,
    };
  })
  // Newest first. Same date across several is stable in file order, which is
  // the order they were written in.
  .sort((a, b) => (a.published < b.published ? 1 : a.published > b.published ? -1 : 0));

// The reverse index: which articles named this repository. Charters ask this
// rather than keeping a list of their own.
const byRepo = new Map();
for (const article of articles) {
  for (const { repo } of article.projects ?? []) {
    if (!byRepo.has(repo)) byRepo.set(repo, []);
    byRepo.get(repo).push(article);
  }
}

export function articlesAbout(repo) {
  return byRepo.get(repo) ?? [];
}

export default articles;
