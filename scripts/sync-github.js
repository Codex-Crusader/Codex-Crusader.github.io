// Pulls every public repository for the configured account and writes
// src/data/github.json. Runs in CI before `astro build`.
//
// There is no hardcoded repo list anywhere. Create a public repo on GitHub and
// it shows up on the site after the next scheduled run.
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
const EXCLUDE = new Set(profile.github.exclude.map((n) => n.toLowerCase()));
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

async function allRepos() {
  const out = [];
  for (let page = 1; page <= 20; page++) {
    const res = await api(`/users/${USER}/repos?per_page=100&page=${page}&type=owner&sort=pushed`);
    const batch = await res.json();
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

// Cheap commit count: ask for one commit per page and read the page number the
// Link header points at as "last". One request per repo, no cloning.
async function commitCount(name) {
  const res = await fetch(
    `https://api.github.com/repos/${USER}/${name}/commits?per_page=1`,
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

// A repo counts as "recently active" if it was pushed inside this window.
// Widen it if the front of the ledger looks too thin.
const RECENT_DAYS = 45;

function isRecentlyActive(r) {
  if (!r.pushed_at) return false;
  return Date.now() - new Date(r.pushed_at) < RECENT_DAYS * 86400000;
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
  const kept = raw.filter(
    (r) => !r.fork && !r.archived && !r.private && !EXCLUDE.has(r.name.toLowerCase()),
  );

  const counts = await mapLimit(kept, 5, (r) => commitCount(r.name));

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
      if (typeof counts[i] === 'number') entry.commits = counts[i];
      return entry;
    })
    .sort((a, b) => {
      // "Redrawn nightly" should be visible in the ledger, not just claimed.
      // Anything pushed inside the recent window floats to the top in push
      // order; everything else keeps the old stars-first ordering. Same shape,
      // same fields — only the order of the array changes.
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
  console.log(`sync-github: wrote ${repos.length} repos to src/data/github.json`);
}

main().catch((err) => {
  console.error('sync-github failed:', err.message);
  process.exit(1);
});
