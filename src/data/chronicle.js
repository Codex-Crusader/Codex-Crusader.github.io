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
// ── On a name the survey does not know ──────────────────────────────────────
//
// It warns and drops the link. It does not fail the build, and an earlier
// version of this file that did was wrong for a reason worth writing down.
//
// The argument for failing was that a project name matching nothing is a typo
// in a file somebody just edited. That is one of the two ways it can happen.
// The other is that the repository was archived, renamed or added to
// `profile.github.exclude`, at which point the survey stops reporting it. From
// in here those two are indistinguishable: both are a string that matches no
// repo. Failing the build treats them identically and picks the wrong one, so a
// repository archived on a Tuesday kills the nightly deploy on Tuesday night,
// for a reason the author never sees because nobody is watching that run.
//
// That is exactly the case charters.js already decided, and it decided it the
// other way: a missing repository is the world changing under the site, it is
// not the author's fault, and the deploy should still go out. This follows it.
// The build prints the name, the article keeps its prose, and only the link
// disappears, on the same rule that keeps an unfinished contact row from
// shipping as a dead link.
//
// The check is skipped entirely when the survey is empty, because `npm run
// build` is required to work on a fresh clone with no network: ensure-data.js
// drops in empty stubs, and a check that cannot tell "no such repo" from "no
// data yet" would warn on every clone. An empty survey means unknown.

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

    const projects = (article.projects ?? [])
      .filter((repo) => {
        if (!surveyed.size || surveyed.has(repo)) return true;
        console.warn(
          `chronicle: article "${article.slug}" names project "${repo}", which the survey does not ` +
            `report. Either the name is wrong or the repository has gone. Dropping that link.`,
        );
        return false;
      })
      .map((repo) => {
        const charter = charterOf.get(repo);
        const found = repos.find((r) => r.name === repo);
        return {
          repo,
          // A project with a charter is linked to its charter, which is the
          // page written about it. One without is linked to its holding on the
          // map, which is the only address it has, and which is also the id the
          // front page gives that holding. Same rule the register keeps.
          title: charter?.title ?? repo,
          href: charter
            ? `${base}projects/${charter.slug}/`
            : `${base}#holding-${repo.toLowerCase()}`,
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
