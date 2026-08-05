# The realm of Orvia

Portfolio site. Astro, static output, deployed to GitHub Pages by a workflow
that runs on every push and once a night.

One small script ships, and only for the map: the pointer tilt, the sheen and
the province cartouches. Everything else is CSS. The script is strictly
enhancement — with it blocked the map is still a complete set of links, the
sheen stays invisible and the cartouche stays hidden.

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
| The writ's size and whether it exists | `public/`, via `src/data/resume.js` |

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

## Replacing the writ (the résumé)

Overwrite `public/bhargavaram-krishnapur-resume.pdf`, keeping the filename, and
update `resume.revised` in `profile.js`. That is the whole procedure.

The PDF surfaces in three places, all fed from the one `resume` block in
`profile.js`:

| Where | What it is |
| --- | --- |
| Foot of Ponstium Empire | The writ plate — the download itself |
| Phoededia's list of roads | A row reading `codex-crusader.github.io/resume` |
| `/resume` | A short address for cards and signatures |

`src/data/resume.js` stats the file at build time, so the size shown next to the
link is measured rather than typed, and it cannot disagree with the file people
actually download.

If the PDF is missing the writ removes itself — from the plate, the contact row,
the sitemap and the short page — instead of shipping a link to a 404. `npm run
build` prints a warning naming the file it could not find, but does not fail.
Same rule as an unfinished contact row.

The filename is deliberately not `resume.pdf`: it lands in a downloads folder
under the name of the person it belongs to.

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
public/                 copied verbatim, including the writ (the résumé PDF)
src/
  data/profile.js       ← everything about you
  data/resume.js        the writ, checked and measured against public/
  data/holdings.js      legend marks and material colours for the repos
  components/Holding.astro     one repository, drawn as a holding
  data/section-textures.json   per-spread parchment, from the design
  components/OrviaMap.astro    the map, one component
  components/Lorebook.astro    one lorebook spread, reused five times
  pages/index.astro     the page
  pages/404.astro       Terra Incognita, for addresses that are not provinces
  pages/resume.astro    /resume, a short road to the writ
  styles/global.css     the design's stylesheet, screen and print
```

## The three pages

`index.astro` is the site. The other two exist because a visitor can arrive at
an address that is not the front page:

- **`404.astro`** — GitHub Pages serves `404.html` for anything it does not
  recognise. Without it a mistyped URL drops the visitor onto GitHub's grey
  error page, outside the realm with no way back. This one lists the five
  provinces instead. It is `noindex`, and it is not in the sitemap.
- **`resume.astro`** — `/resume`, hopping to the PDF via `<meta http-equiv=
  "refresh">`. That is HTML, not script, so the no-JavaScript rule stands; a
  visible link sits under it for anyone whose browser ignores the refresh. The
  sitemap lists the PDF itself rather than this page — one address per document.

## Printing

The site is shaped like a document, so `@media print` in `global.css` lets it
print like one: the fixed frame goes (fixed positioning reprints on every
sheet), the parchment goes, the map and every "return to map" link go, the
margin ledger drops below its section instead of beside it, and repository names
print their URLs. Roles and photographs are kept off page boundaries.

## Things not to add

Still off the table: dark mode, a theme toggle, a contact form, a CMS, a sticky
nav, and any JavaScript scroll library. Navigation is CSS anchor scrolling.

Motion is allowed now, but only on these terms, which are what keep it from
becoming the scroll-jacking the original rule was written to prevent:

- **Reveals are scroll-driven CSS**, not a scroll listener. No JavaScript runs
  as the page moves, so there is nothing to jank.
- **Every animation is behind `@supports` and a `prefers-reduced-motion` guard**,
  and no animation may leave content at `opacity: 0` if its timeline never
  runs. That is why the reveals are scoped to `.reveal` — the 404 and `/resume`
  are single cards on pages that may not scroll, and they opt out entirely.
- **Print pins everything to its finished state.** A print job has no
  scrollport, so an unpinned view() animation would commit opacity 0 to paper.

## The atlas

The repositories are drawn onto the map as settlements inside the Afon Empire,
and none of it is a fixed asset. `src/data/settlements.js` reads the province's
own border path out of `OrviaMap.astro` at build time and does the cartography:
point-in-polygon to stay inside the border, distance-to-edge so nothing crowds
the coastline, and farthest-point sampling so the settlements spread instead of
clumping. Add a repo and the next nightly run re-surveys the province and
redraws it to fit.

Rank comes from commit count — city, town, village — and decides how each one is
drawn, the way a real map grades a settlement.

**Labels are graded too, and that is the part worth understanding.** Twelve repo
names, some 27 characters long, do not fit legibly inside a province 395 units
wide. That is a density problem and no amount of cleverer placement solves it;
the first version spread them perfectly and they still overprinted each other
and the province's own name. So cities and towns are named on the sheet, and
villages stay dots until you point at one or zoom in past 1.8×.

Two things that will bite anyone editing this:

- **`text-anchor` is inherited.** The province names carry no anchor attribute
  and are centred by a parent `<g>`, which the keep-out scanner cannot see. It
  covers both anchorings instead of parsing the group tree. Over-blocking costs
  a few candidate sites; under-blocking put a settlement across "AFON EMPIRE".
- **Paths must stay M/L/Z.** The parser reads raw number pairs, so a curve
  command would silently scatter settlements into the sea. It checks, and bails
  to no settlements rather than guessing.

Zoom is pinch or ctrl+wheel only. **A bare wheel always belongs to the page** —
the map never takes the scroll away from someone trying to read past it.

## A note on the map

Province names are drawn into the SVG as `<text>`. If you rename a section in
`profile.js`, update the matching label in `src/components/OrviaMap.astro` so
the map and the folio agree.

The five rust-outlined provinces are anchor links. In the handoff their hover
states were `style-hover` attributes, which only the design tool understands;
they are now real CSS rules in `global.css` with the same values.
