import { defineConfig } from 'astro/config';

// GitHub Pages.
//   · User site  (Codex-Crusader.github.io)  -> leave `base` undefined.
//   · Project site (…github.io/portfolio/)   -> set base to '/portfolio/'.
// Both can be overridden from the workflow without touching this file.
export default defineConfig({
  site: process.env.SITE_URL || 'https://Codex-Crusader.github.io',
  base: process.env.SITE_BASE || '/',
  output: 'static',
  build: { inlineStylesheets: 'always' },
  // No client-side JavaScript ships from this site. Navigation is CSS anchor
  // scrolling only.
});
