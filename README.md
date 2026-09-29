# codex-crusader.github.io

Personal portfolio of Bhargavaram Krishnapur. High-fantasy theme. One static HTML page, no build step, no trackers.

## What moves

- A fixed "stage" behind the page. Each chapter has its own painting. The paintings cross-fade, zoom and drift as you scroll and move the mouse.
- Embers and motes of light float over the page. They speed up when you scroll. The mouse leaves a spark trail, and a click makes a burst.
- Hero: the name letters rise in on load and scatter on scroll. Three mountain layers and the moon move at different speeds.
- A word band that speeds up, tilts and reverses with the scroll direction.
- Chapter titles rise letter by letter. Large Roman numerals drift behind them.
- The Oath: words light up one by one as you scroll. The framed painting turns and a light sweeps across it.
- Hall of Relics: the section pins and you scroll sideways. Cards swing in, tilt in 3D under the mouse, and the relics float.
- The Road: the path draws itself, a torch walks along it, and banners unfurl at each stop.
- Honours: the wax seal spins in, numbers count up, and pennants drop and sway.
- Memories: frames move at different speeds (parallax). Hover straightens a frame. Click opens it large.
- The Chronicler: the ring of text turns with the scroll.
- Contact: a raven flies across the section as you scroll.
- The astrolabe in the top bar turns with the scroll and shows the chapter number.
- Press **Ctrl K** (or **⌘ K**, or **/**) to open the Summon menu and jump to any chapter or project.

If a visitor turns on "reduce motion" in their system settings, all motion stops and the content stays readable.

## Files

| File | Purpose |
|---|---|
| `index.html` | The site. All content, CSS and JavaScript are in this file. |
| `art/stage/` | The 8 background paintings, one for each chapter. |
| `art/relics/` | The 15 museum objects shown on the project cards. |
| `art/plates/` | The framed paintings (Titan's Goblet, Knight, Death, and the Devil). |
| `photos/` | Your photos. |
| `writing/` | The blog ("The Chronicles"): an index, 10 posts, `feed.xml` (RSS), shared `blog.css` and `blog.js`. |
| `writing/img/` | Screenshots from your repos, used in the posts. |
| `writing/og/` | One link-preview image per post. |
| `blog/` | Redirects `/blog/` to `/writing/`. |
| `404.html` | Sends old links (`/experience/`, `/projects/...`, `/resume/`) to the correct section. |
| `bhargavaram-krishnapur-resume.pdf` | The résumé. Replace this file to update it. |
| `og-cover.png` | Link preview image for LinkedIn, WhatsApp and X. 1200 × 630 px. |
| `favicon.svg`, `apple-touch-icon.png` | Icons. |
| `robots.txt`, `sitemap.xml` | For search engines. |
| `.nojekyll` | Stops GitHub Pages from running Jekyll. |

## About the art

All art is public domain, released as **CC0** by the Cleveland Museum of Art and The Metropolitan Museum of Art. You can host it, change it and use it with no permission. The Colophon section at the bottom of the page credits each work and links to its museum page. Keep that section. It is not a legal requirement, but it is correct practice.

Do not add game art (Elden Ring, Bloodborne and so on). It is copyrighted, and GitHub can remove the repository after a takedown notice.

## Libraries

GSAP 3.12.5 with ScrollTrigger (cdnjs) and Lenis 1.1.13 (unpkg). These load from a CDN. If they fail to load, the page still shows all content without motion.

## Deploy to GitHub Pages

1. Save the old site on a backup branch: `git checkout -b astro-archive && git push -u origin astro-archive`.
2. Go back to `main`. Remove the old files. Copy all files from this folder into the repository root.
3. Commit and push.
4. Go to **Settings → Pages**. Set **Source** to **Deploy from a branch**, branch `main`, folder `/ (root)`.
5. Delete the old Pages workflow in `.github/workflows/` if it is still there.

## Get found in search

1. Open Google Search Console. The verification tag is already in `index.html`.
2. Submit `https://codex-crusader.github.io/sitemap.xml`.
3. Use **URL Inspection** on the home page and select **Request indexing**.
4. Put the site link on your GitHub profile, LinkedIn and The Pulse Engine org.

## The blog and SEO

The blog lives at `/writing/`, the same address as the old site's writing section. The six old posts keep their URLs and their text, word for word, so any search ranking they already have carries over. Four new posts are added:

- `correlation-engine-noise-baseline`
- `data-leakage-basketball-model`
- `alphazero-chess-engine-python`
- `campus-visitor-access-ux-study`

The new posts are written in your voice from the facts in each project's README. **Read them before you publish.** Change anything that does not sound like you.

What each post page does for search:

- A unique title, description and canonical URL.
- `BlogPosting` and `BreadcrumbList` structured data, linked to the `Person` on the home page, with the project repository as `SoftwareSourceCode`.
- Open Graph and Twitter tags with a 1200 × 630 preview image.
- Real screenshots and diagrams with alt text, listed in `sitemap.xml` as image entries.
- Internal links: home → blog, project cards → posts, posts → projects, posts → related posts.
- An RSS feed at `/writing/feed.xml`.

After you deploy, submit the sitemap again in Search Console, and use URL Inspection on the blog index and one new post.

## Add a post

The posts are generated by a small Python script, which is not in this folder. To add a post by hand, copy one post folder in `writing/`, change the text and the `<head>` tags, and add a card to `writing/index.html`, a line to `feed.xml` and a `<url>` to `sitemap.xml`.

## Update content

- **Projects:** find `<div class="slot">` in `index.html`. Copy one block and change the text. Set `data-repo` to the exact GitHub repo name. The star count and rarity then update from the GitHub API. Put a new relic image in `art/relics/`.
- **Rarity:** set by stars. Legendary 10+, Epic 5–9, Rare 2–4, Common 1.
- **Experience:** copy one `<article class="stop">` block. The road redraws itself.
- **Photos:** add a `.webp` file to `photos/` and copy one `<figure>` line in the Memories section. Remove location data first.
