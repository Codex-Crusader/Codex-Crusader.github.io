// Pulls every public repository for the configured account and its
// organisations, and writes src/data/github.json. Runs in CI before
// `astro build`.
//
// There is no hardcoded repo list anywhere. Create a public repo on GitHub, or
// in an org named in profile.github.orgs, and it shows up on the site after the
// next scheduled run.
//
// Fails loudly. A build that silently ships an empty Afon Empire is worse than
// a build that goes red.

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import profile from '../src/data/profile.js';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, '../src/data/github.json');

const USER = profile.github.username;
const ORGS = profile.github.orgs ?? [];
const EXCLUDE = new Set(profile.github.exclude.map((n) => n.toLowerCase()));
const FEATURED = profile.github.featured ?? [];
const TOKEN = process.env.GITHUB_TOKEN;

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': `${USER}-portfolio-build`,
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) {
    throw new Error(`GitHub ${res.status} ${res.statusText} on ${path}`);
  }
  return res;
}

// One owner's repositories, followed to the end of its pagination. The caller
// passes the whole query prefix because the two endpoints do not take the same
// arguments.
//
// `/users/{user}/repos` takes `type=owner`, which is what keeps the personal
// account's list to what it owns rather than what it can see. The organisation
// endpoint's `type` has no `owner` in its enum, and it does not reject the word
// either: it accepts the request and quietly ignores the filter. So the org
// call omits `type` entirely rather than passing an argument that reads as a
// constraint and is not one, and the `!r.private` filter in main() does that
// work instead, where it can be seen.
async function reposOf(path) {
  const out = [];
  for (let page = 1; page <= 20; page++) {
    const res = await api(`${path}&per_page=100&page=${page}&sort=pushed`);
    const batch = await res.json();
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

// The account, then every organisation, as one list. Deduplicated by full name
// because an org repo can also be reachable through the account, and a repo
// surveyed twice would be drawn as two holdings and counted twice in the ledger.
async function allRepos() {
  const owners = [`/users/${USER}/repos?type=owner`, ...ORGS.map((o) => `/orgs/${o}/repos?`)];
  const seen = new Map();
  for (const path of owners) {
    for (const r of await reposOf(path)) {
      if (!seen.has(r.full_name)) seen.set(r.full_name, r);
    }
  }
  return [...seen.values()];
}

// Cheap commit count: ask for one commit per page and read the page number the
// Link header points at as "last". One request per repo, no cloning.
//
// Keyed on full_name, not on the name under USER: an org's repo does not exist
// at /repos/USER/name, and this soft-fails, so getting that wrong would print
// the org's holdings without their figures and never say why.
async function commitCount(fullName) {
  const res = await fetch(
    `https://api.github.com/repos/${fullName}/commits?per_page=1`,
    { headers },
  );
  if (res.status === 409) return 0; // empty repo
  if (!res.ok) return undefined; // omit the field rather than guess
  const link = res.headers.get('link');
  const match = link && link.match(/[?&]page=(\d+)>;\s*rel="last"/);
  if (match) return Number(match[1]);
  const body = await res.json();
  return Array.isArray(body) ? body.length : undefined;
}

// The byte breakdown behind the single /language field. A repo is rarely one
// material, and "Python" alone throws away the fact that a project is 80%
// notebooks. Returned as sorted percentages so the page never has to do
// arithmetic on raw byte counts.
//
// Soft-fails: a repo whose breakdown cannot be read simply renders without the
// survey bar, which is a smaller loss than failing the whole build over it.
async function languageMix(fullName) {
  const res = await fetch(`https://api.github.com/repos/${fullName}/languages`, {
    headers,
  });
  if (!res.ok) return undefined;
  const bytes = await res.json();
  const total = Object.values(bytes).reduce((n, v) => n + v, 0);
  if (!total) return undefined;
  return Object.entries(bytes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([lang, n]) => ({ lang, pct: Math.round((n / total) * 1000) / 10 }));
}

// A repo counts as "recently active" if it was pushed inside this window.
// Widen it if the front of the ledger looks too thin.
const RECENT_DAYS = 45;

function isRecentlyActive(r) {
  if (!r.pushed_at) return false;
  return Date.now() - new Date(r.pushed_at) < RECENT_DAYS * 86400000;
}

// A repo is excluded by its bare name in any owner, or by `owner/name` in one.
// The bare form is what anyone reaching for this will type; the qualified form
// exists because two owners can hold the same name, and `.github` is exactly
// that case waiting to happen.
function isExcluded(r) {
  return EXCLUDE.has(r.name.toLowerCase()) || EXCLUDE.has(r.full_name.toLowerCase());
}

// Where a repo sits in profile.github.featured, or past the end of the list if
// it is not in it. This is the only hand-placed thing in the survey, which is
// why it is one small readable function rather than a clause in the comparator.
function featuredRank(name) {
  const i = FEATURED.indexOf(name);
  return i === -1 ? FEATURED.length : i;
}

// Small concurrency pool so a large account does not fire 60 requests at once.
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i]);
      }
    }),
  );
  return results;
}

async function main() {
  if (!TOKEN) {
    console.warn('sync-github: no GITHUB_TOKEN set, running unauthenticated (60 req/hr).');
  }

  const profileRes = await api(`/users/${USER}`);
  const account = await profileRes.json();

  const raw = await allRepos();
  const kept = raw.filter((r) => !r.fork && !r.archived && !r.private && !isExcluded(r));

  // Both per-repo lookups share one pool, so a large account still makes two
  // requests per repo rather than two bursts of sixty.
  const details = await mapLimit(kept, 5, async (r) => ({
    commits: await commitCount(r.full_name),
    languages: await languageMix(r.full_name),
  }));

  const repos = kept
    .map((r, i) => {
      const entry = {
        name: r.name,
        description: r.description ?? null,
        html_url: r.html_url,
        homepage: r.homepage || null,
        stargazers_count: r.stargazers_count,
        language: r.language ?? null,
        topics: (r.topics ?? []).slice().sort(),
        pushed_at: r.pushed_at,
      };
      if (typeof details[i].commits === 'number') entry.commits = details[i].commits;
      if (details[i].languages) entry.languages = details[i].languages;
      return entry;
    })
    .sort((a, b) => {
      // The hand-placed few first, in the order profile.js lists them. Push
      // date is a measurement and it does not know what anything is worth: it
      // will seat a meme scraper above a correlation engine on the strength of
      // a cron that ran this morning. Everything below this clause is still
      // computed, and this one is deliberately not.
      const fa = featuredRank(a.name);
      const fb = featuredRank(b.name);
      if (fa !== fb) return fa - fb;

      // "Redrawn nightly" should be visible in the ledger, not just claimed.
      // Anything pushed inside the recent window floats to the top in push
      // order; everything else keeps the old stars-first ordering. Same shape,
      // same fields: only the order of the array changes.
      const ra = isRecentlyActive(a);
      const rb = isRecentlyActive(b);
      if (ra !== rb) return ra ? -1 : 1;
      if (ra && rb) return new Date(b.pushed_at) - new Date(a.pushed_at);
      return (
        b.stargazers_count - a.stargazers_count ||
        new Date(b.pushed_at) - new Date(a.pushed_at) ||
        a.name.localeCompare(b.name)
      );
    });

  const data = {
    profile: {
      login: account.login,
      followers: account.followers,
      public_repos: account.public_repos,
    },
    repos,
  };

  await writeFile(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(
    `sync-github: wrote ${repos.length} repos from ${[USER, ...ORGS].join(', ')} to src/data/github.json`,
  );
}

main().catch((err) => {
  console.error('sync-github failed:', err.message);
  process.exit(1);
});
