# The realm of Orvia

Portfolio site. Astro, static output, zero client-side JavaScript, deployed to
GitHub Pages by a workflow that runs on every push and once a night.

---

## The only file you normally edit

**`src/data/profile.js`**

Name, tagline, about text, work history, contact links, ledger figures and
section headings all live in that one file. Change a string, commit, done. You
never have to open a component to change wording.

Two things are deliberately **not** in it, because they maintain themselves:

| Content | Where it comes from |
| --- | --- |
| Repositories (Afon Empire) | GitHub API, via `scripts/sync-github.js` |
| Photographs (Republic of Corum) | `assets/photos/`, via `scripts/scan-photos.js` |

### Unfinished rows are safe

A contact row with an empty `href` is filtered out before rendering, so a line
you have not finished yet never ships as a dead link. `npm run build` prints a
reminder naming any blank rows, but does not fail. The `best channel` ledger row
names the first channel that is actually filled in, so it cannot promise a
channel that does not exist.

---

## Adding a repository

Nothing to do. Create a public repo on GitHub and it appears after the next
nightly run, or immediately if you push to `main` or hit *Run workflow*.

Forks, archived repos and anything listed in `profile.github.exclude` are
skipped. Order is stars descending, then most recently pushed. The repo
description becomes the body text; stars, language, commit count and last
update fill the margin ledger.

## Adding a photograph

Drop a `.jpg`, `.jpeg`, `.png` or `.webp` into `assets/photos/`. That is the
whole procedure.

At build time each file is rotated according to its EXIF orientation, **stripped
of all metadata**, and re-encoded as 480 / 960 / 1600px WebP for `srcset`.
Phone photos carry GPS coordinates, so the stripping is a privacy requirement,
not an optimisation. Nothing is ever upscaled, and the recorded orientation is
used so portraits are not cropped through faces.

Alt text and the caption are derived from the filename, so name files in
readable slugs: `karjat-morning-fog.jpg` becomes "Karjat morning fog".

---

## Running it locally

```bash
npm install
npm run refresh     # sync GitHub + process photos + build
npm run preview     # serve dist/ at localhost:4321
```

Or piecemeal:

```bash
npm run sync        # writes src/data/github.json
npm run photos      # writes public/photos/ and src/data/photos.json
npm run dev         # live reload
```

`npm run build` works on a fresh clone with no network: `scripts/ensure-data.js`
drops in empty stubs and the two dynamic sections render an empty-state line.

Unauthenticated GitHub API calls are capped at 60 per hour. If `npm run sync`
returns 403 locally, export a personal access token as `GITHUB_TOKEN`. In CI the
built-in `GITHUB_TOKEN` is used and no secret needs configuring.

---

## Deployment

`.github/workflows/deploy.yml` handles everything: checkout, Node 20 with npm
cache, `npm ci`, sync, photo scan, build, upload, deploy.

One-time setup:

1. Repository **Settings → Pages → Source → GitHub Actions**.
2. If this is a *project* page (`username.github.io/portfolio/`) rather than a
   *user* page, add repository variables `SITE_BASE` = `/portfolio/` and
   `SITE_URL` = `https://username.github.io`. For a user page, leave both unset.

Generated data is never committed back. Each run fetches, builds and deploys in
one pass, so the commit history stays clean. `github.run_number` is passed in as
`PUBLIC_RUN_NUMBER` and stamped into the inscription along the bottom edge of
the map.

If the GitHub API errors, the build fails loudly rather than quietly shipping an
empty projects section.

---

## Layout of the repo

```
assets/photos/          drop photos here, the only input folder
public/photos/          generated WebP variants (gitignored)
scripts/
  sync-github.js        repos -> src/data/github.json
  scan-photos.js        photos -> public/photos/ + src/data/photos.json
  ensure-data.js        empty stubs so a fresh clone can build
src/
  data/profile.js       ← everything about you
  data/section-textures.json   per-spread parchment, from the design
  components/OrviaMap.astro    the map, one component
  components/Lorebook.astro    one lorebook spread, reused five times
  pages/index.astro     the page
  styles/global.css     the design's stylesheet
```

## Things not to add

The design is deliberately finished. No dark mode, no theme toggle, no scroll
animations, no contact form, no CMS, no sticky nav, and no JavaScript scroll
library: navigation is CSS anchor scrolling and nothing else.

## A note on the map

Province names are drawn into the SVG as `<text>`. If you rename a section in
`profile.js`, update the matching label in `src/components/OrviaMap.astro` so
the map and the folio agree.

The five rust-outlined provinces are anchor links. In the handoff their hover
states were `style-hover` attributes, which only the design tool understands;
they are now real CSS rules in `global.css` with the same values.
