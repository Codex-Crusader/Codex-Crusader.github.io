# The realm of Orvia

Portfolio site. Astro, static output, deployed to GitHub Pages by a workflow
that runs on every push and once a night.

One small script ships, and only for the map: the pointer tilt, the sheen and
the province cartouches. Everything else is CSS. The script is strictly
enhancement: with it blocked the map is still a complete set of links, the
sheen stays invisible and the cartouche stays hidden.

---

## The three files you normally edit

**`src/data/profile.js`**

Name, tagline, about text, work history, contact links, ledger figures and
section headings all live in that one file. Change a string, commit, done. You
never have to open a component to change wording.

**`src/data/charters.js`**

The long half. One entry per project that has earned a page of its own at
`/projects/<slug>/`: the prose, the honest limits, the stack, and the handful
of figures that are quoted rather than counted. It is a second file rather than
another block in `profile.js` because six charters of prose would be four
fifths of that file, and the one whose promise is "change a string, commit,
done" should not need scrolling past three thousand words to reach the contact
rows.

A repository gets a page because prose exists for it here. That is the whole
rule, and it is deliberately not `github.featured`: that list means "opens the
province" and the map re-surveys itself around it, so a second meaning hung on
it would move settlements every time a page was written. `repo` must match a
surveyed repository name exactly; one that matches nothing is skipped and
`npm run build` prints it.

**`src/data/writing.js`**

One entry per article at `/writing/<slug>/`. Same division of labour as
`charters.js`: prose here, everything measurable computed at build time.

The field worth understanding is `projects`, which lists **repository names**,
not charter slugs. A slug is an address and an address can be renamed; the
repository name is the identity the whole site is already keyed to. The link is
written once and works in both directions: an article names the projects it
covers, and every charter derives its own "Related articles" by asking
`src/data/chronicle.js` which articles named it. There is no second list on the
charter side, so the two cannot disagree.

A project name matching no surveyed repository **fails the build**, rather than
warning. That is harsher than the rule for a missing charter repository, and
deliberately: a missing repository is the world changing under the site, while a
name that matches nothing is a typo in a file somebody just edited. The check is
skipped when the survey is empty, so a fresh offline clone still builds.

Reading time and word count are counted from the prose, never typed.

Three things are deliberately **not** in any of them, because they maintain
themselves:

| Content | Where it comes from |
| --- | --- |
| Repositories (Afon Empire) | GitHub API, the account and its orgs, via `scripts/sync-github.js` |
| Photographs (Republic of Corum) | `assets/photos/`, via `scripts/scan-photos.js` |
| Project screenshots | `assets/screenshots/<slug>/`, via `scripts/scan-screenshots.js` |
| The writ's size and whether it exists | `public/`, via `src/data/resume.js` |
| Reading time and word count of an article | the prose, via `src/data/chronicle.js` |
| The social share card | the built map, via `scripts/draw-cover.js` |

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

The survey covers `profile.github.username` and every organisation in
`profile.github.orgs`, as one list. Forks, archived repos and anything listed in
`profile.github.exclude` are skipped. An exclusion is a bare name to skip it
under any owner, or `owner/name` to skip it under one; an org's `.github`
profile repo wants the second form, since it is public, has no description and
would otherwise draw as an empty holding.

Order is `profile.github.featured` first, in the order that array lists them,
then anything pushed in the last 45 days by push date, then the rest by stars.
Featuring is the one hand-placed thing in the province, and it exists because
push date is a measurement with no opinion: it will seat a meme scraper above a
correlation engine because a cron ran that morning. A featured name that matches
no repo is skipped, and `npm run build` prints it.

The repo description becomes the body text, so a thin description is fixed on
GitHub rather than here, and the site picks it up on the next run. Stars,
language, commit count and last update fill the margin ledger.

## Adding an article

Write an entry in `src/data/writing.js` and it appears at `/writing/<slug>/`,
in the chronicles index, in the sitemap, and on the charter page of every
project it names. Nothing else to wire up.

Name the projects by their **repository name**, exactly as the survey reports
it, not by their charter slug. `npm run build` fails and prints the surveyed
names if one does not match.

## Adding a screenshot

Drop an image into `assets/screenshots/<charter-slug>/`. That is the whole
procedure. It is resized to 480 / 960 / 1280px WebP, stripped of metadata, and
rendered in a Screenshots section on that charter. A charter with no folder
renders no section rather than an empty heading.

**Name the file for what it shows.** The filename becomes both the alt text and
part of the URL: `exposure-report.jpg` becomes "Exposure report", which is
useful to a screen reader and to an image search. `img2.png` becomes "Img2",
which is neither.

A folder whose name matches no charter is reported by the build and skipped,
rather than published as a set of images belonging to nothing.

## Replacing the writ (the résumé)

Overwrite `public/bhargavaram-krishnapur-resume.pdf`, keeping the filename, and
update `resume.revised` in `profile.js`. That is the whole procedure.

The PDF surfaces in three places, all fed from the one `resume` block in
`profile.js`:

| Where | What it is |
| --- | --- |
| Foot of Ponstium Empire | The writ plate, the download itself |
| Phoededia's list of roads | A row reading `codex-crusader.github.io/resume` |
| `/resume` | A short address for cards and signatures |

`src/data/resume.js` stats the file at build time, so the size shown next to the
link is measured rather than typed, and it cannot disagree with the file people
actually download.

If the PDF is missing the writ removes itself, from the plate, the contact row,
the sitemap and the short page, instead of shipping a link to a 404. `npm run
build` prints a warning naming the file it could not find, but does not fail.
Same rule as an unfinished contact row.

The filename is deliberately not `resume.pdf`: it lands in a downloads folder
under the name of the person it belongs to.

## The share card

Nothing to do. `scripts/draw-cover.js` runs after `astro build` and draws
`og-cover.png` from the map in the built page, so the picture that appears when
the link is pasted anywhere is the same sheet the site is showing that day. Add
a repository and the card gains a town on the next run.

It was a hand-exported file once. That file was committed in July, the realm
grew settlements in August, and for two weeks every share showed a map of an
empty country. A survey that redraws itself nightly should not have a still
photograph of itself attached.

Two details, both of which are the same problem. A rasteriser has no
stylesheet, so anything the design hides in CSS would print at full strength:

- The map carries **two hint labels**, one for a pointer and one for a thumb.
  The card keeps the pointer wording and drops the other, or they overprint.
- **Village labels are dropped.** On the site they stay hidden until pointed at,
  because a dozen repository names at once is an unreadable map. Left in, they
  rebuild the exact pile the grading exists to prevent.

The card is a palette PNG: 113 KB, against 752 KB for the same image as
truecolour, with no visible banding in the parchment. It is written into `dist/`
and never committed. `public/og-cover.png` stays as the fallback for a build
that cannot draw one: if the page has no map in it, the script warns, keeps
that file and lets the build pass.

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
npm run shots       # writes public/screenshots/ and src/data/screenshots.json
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
assets/photos/          drop photos here
assets/screenshots/     one folder per charter slug, drop screenshots there
public/photos/          generated WebP variants (gitignored)
public/screenshots/     generated WebP variants (gitignored)
scripts/
  sync-github.js        repos -> src/data/github.json
  scan-photos.js        photos -> public/photos/ + src/data/photos.json
  scan-screenshots.js   screenshots -> public/screenshots/ + screenshots.json
  ensure-data.js        empty stubs so a fresh clone can build
  draw-cover.js         the built map -> dist/og-cover.png, the share card
public/                 copied verbatim, including the writ (the résumé PDF)
src/
  data/profile.js       ← everything about you
  data/charters.js      ← one entry per project page
  data/writing.js       ← one entry per article
  data/chronicle.js     articles, measured, and the article <-> project index
  data/software.js      how a repo is typed in the JSON-LD, resolved once
  data/resume.js        the writ, checked and measured against public/
  data/holdings.js      legend marks and material colours for the repos
  components/Holding.astro     one repository, drawn as a holding
  data/section-textures.json   per-spread parchment, from the design
  components/OrviaMap.astro    the map, one component
  components/Lorebook.astro    one lorebook spread, reused five times
  layouts/Sheet.astro          frame, parchment and head, for the pages that
                               are not the map
  pages/index.astro     the page
  pages/404.astro       Terra Incognita, for addresses that are not provinces
  pages/resume.astro    /resume, a short road to the writ
  pages/projects/index.astro   the register of holdings
  pages/projects/[slug].astro  one charter, per entry in charters.js
  pages/about.astro            /about/, the long biography
  pages/experience.astro       /experience/, the work history unpacked
  pages/writing/index.astro    the chronicles
  pages/writing/[slug].astro   one article, per entry in writing.js
  styles/global.css     the design's stylesheet, screen and print
```

## The charters

`/projects/` is the register: every repository at one address, the six with
charters first and the rest linking back to their holding on the map. Each
charter is `/projects/<slug>/`, and it is the same folio spread the front page
uses, printed on the Afon Empire's own parchment.

They exist because a province is an anchor, and an anchor is not an address.
Nobody can link to one holding, no search result can point at one project, and
a repository description is one sentence. The map is unchanged and still the
site; these are the pages underneath it.

Three things are true of every charter and worth keeping true:

- **Everything measured still comes off the survey.** Stars, commits, language
  mix, topics and the neighbouring-holdings links are all read from
  `github.json` at build time. Only the prose is written by hand.
- **The spread does not reveal.** Reveals are scroll-driven CSS, and a charter
  may not scroll, so `Lorebook` takes `reveal={false}` here for the same
  reason the 404 and `/resume` opt out entirely.
- **One address per repository.** A holding with a charter is identified in the
  structured data by its charter URL, on the front page as well as on its own,
  so the graph describes one project rather than two that share a name.

## The pages

`index.astro` is the site. The rest exist because a visitor can arrive at an
address that is not the front page, or wants one project rather than all of
them:

- **`404.astro`**: GitHub Pages serves `404.html` for anything it does not
  recognise. Without it a mistyped URL drops the visitor onto GitHub's grey
  error page, outside the realm with no way back. This one lists the five
  provinces instead. It is `noindex`, and it is not in the sitemap.
- **`resume.astro`**: `/resume/`, the résumé as a real page. It was a
  `<meta http-equiv="refresh">` hop to the PDF once, which made it an address
  rather than a document: nothing to read, nothing to rank, and nothing at all
  for anyone who cannot comfortably open a PDF, which on a phone is most people.
  The PDF is still there as the download, and the canonical moved here with the
  content. Everything on it is read from `profile.js`, so it cannot disagree
  with the site around it.

  The PDF gate still applies, but only to the PDF. A missing file removes the
  download row, not the page: the page is the primary document now and the file
  is the attachment, so gating the writing on the presence of its own PDF would
  be the wrong way round.
- **`about.astro`**: `/about/`, the Kingdom of Dequm at length, with the
  skills, education and interests the map has nowhere to put. It does not repeat
  the front page: `profile.about.paragraphs` stays on the map and
  `profile.about.page.paragraphs` is written for here. Two pages carrying the
  same sentences are one page indexed twice, and the weaker copy is the one that
  ranks.
- **`experience.astro`**: `/experience/`, the same ten posts with the
  paragraph unpacked into responsibilities, achievements and technologies. Those
  fields live on the **same role object** in `profile.js` that the front page
  reads, so a date corrected in one place is corrected in both. A role with no
  `technologies` renders no such block; several of these posts were not
  technical work and inventing a stack to fill the template would be the
  fake-detail version of a keyword wall.
- **`writing/index.astro`** and **`writing/[slug].astro`**: the chronicles
  and the articles, generated from `writing.js` through `chronicle.js`.
- **`projects/index.astro`** and **`projects/[slug].astro`**: the register and
  the charters, above. Both are in the sitemap, generated from `charters.js`
  and the survey together, so a charter whose repository has gone leaves the
  sitemap on the same run it leaves the site.

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
  runs. That is why the reveals are scoped to `.reveal`: the 404 and `/resume`
  are single cards on pages that may not scroll, and they opt out entirely.
- **Print pins everything to its finished state.** A print job has no
  scrollport, so an unpinned view() animation would commit opacity 0 to paper.

## The atlas

Every province is surveyed from the data it is actually about, and none of it is
a fixed asset:

| Province | Settlements | Label |
| --- | --- | --- |
| Afon Empire | repositories | repo name |
| Ponstium Empire | posts held | the organisation |
| Republic of Corum | photographs | the plate's caption |
| Kingdom of Dequm | one seat | the cartographer |
| Phoededia | roads out | the channel |

`src/data/settlements.js` reads each province's own border path out of
`OrviaMap.astro` at build time and does the cartography:
point-in-polygon to stay inside the border, distance-to-edge so nothing crowds
the coastline, and farthest-point sampling so the settlements spread instead of
clumping. Add a repo and the next nightly run re-surveys the province and
redraws it to fit.

Rank (city, town, village) is by standing *within its own province*, not
against an absolute number: what counts as a city among twelve repositories is
not what counts as one among four roads. It decides how each settlement is
drawn, the way a real map grades one.

Labelling runs across the whole realm in one pass, not province by province, so
a name near a border clears its neighbours across that border too.

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

Zoom is pinch or ctrl+wheel only. **A bare wheel always belongs to the page**:
the map never takes the scroll away from someone trying to read past it.

## The structured data

One `@graph` on the front page, and the whole value of it is the joins:
`Person`, `WebSite` and `ProfilePage` carry stable `@id`s that everything
else points at. The rule that matters is **one node per project**. A repository
with a charter is identified by its charter URL on the front page as well as on
its own, so the graph describes one project rather than two things that share a
name.

That rule is why a repository which is genuinely an application takes
`SoftwareApplication` as a *second type on the same node*, rather than getting
a node of its own:

```json
"@type": ["SoftwareSourceCode", "SoftwareApplication"]
```

`src/data/software.js` resolves that in one place, because the front page and
the charter both publish the same `@id` and they only hold together while they
agree about what the thing is. Which repositories count is a short hand-kept
list in `profile.github.applications`, next to `featured`, since "is this an
application" is a judgement rather than a measurement.

The other pages each declare their own type and point at the same person:
`/about/` is an `AboutPage`, `/writing/` a `Blog`, each article a
`TechArticle`, and every page below the root carries a `BreadcrumbList`. The
front page stays the only `ProfilePage`, and no page re-declares the Person: it
references `#person` by id.

## A note on the map

Province names are drawn into the SVG as `<text>`. If you rename a section in
`profile.js`, update the matching label in `src/components/OrviaMap.astro` so
the map and the folio agree.

The five rust-outlined provinces are anchor links. In the handoff their hover
states were `style-hover` attributes, which only the design tool understands;
they are now real CSS rules in `global.css` with the same values.
