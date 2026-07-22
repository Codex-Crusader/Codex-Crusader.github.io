// ─────────────────────────────────────────────────────────────────────────────
//  EVERYTHING ABOUT YOU LIVES IN THIS FILE.
//
//  Edit here, commit, and the site rebuilds. You never have to touch the
//  components or the map to change wording, dates, links or ledger figures.
//
//  Two things are NOT in this file, on purpose, because they update themselves:
//    · Repositories  -> pulled from the GitHub API by scripts/sync-github.js
//    · Photographs   -> scanned out of assets/photos/ by scripts/scan-photos.js
//
//  A contact row with an empty href is skipped at render time, so a line you
//  have not finished never ships as a dead link.
// ─────────────────────────────────────────────────────────────────────────────

export default {
  // ── Masthead, sitting above the map ───────────────────────────────────────
  site: {
    // Shown top-left of the map. Keep it short, it is letterspaced.
    name: 'B. KRISHNAPUR',
    // Full name, used for the <title> tag and the copyright line.
    fullName: 'Bhargavaram Krishnapur',
    // Shown top-right of the map.
    tagline: 'software · open source · maps',
    // Browser tab title and meta description.
    metaTitle: 'Bhargavaram Krishnapur',
    metaDescription:
      'Open-source software, local-first tools and photographs, laid out as a map.',
    // The line engraved along the bottom edge of the map. {run} is replaced
    // with the real GitHub Actions run number at build time.
    mapInscription:
      'the realm of orvia · surveyed by b. krishnapur · redrawn nightly · run #{run}',
    // Footer.
    footerLine: '© 2026 b. krishnapur · built by hand · this map is not to scale',
  },

  // ── GitHub ────────────────────────────────────────────────────────────────
  github: {
    // Every public, non-forked, non-archived repo on this account is published
    // automatically. Change the username and the whole Afon Empire changes.
    username: 'Codex-Crusader',
    // Repos never to show, by exact name. The portfolio repo itself belongs here.
    exclude: ['Codex-Crusader.github.io', 'Codex-Crusader'],
  },

  // ── Section I · Afon Empire · projects ────────────────────────────────────
  projects: {
    heading: 'Afon Empire',
    folio: 'FOL. I',
    // Sub-label under the province name in the mobile territory list.
    navNote: 'github profile',
    // First letter is set as the drop cap automatically.
    intro:
      'Public repositories. Everything here is open source, and most of it started as something I needed and could not find. The figures in the ledger come from the GitHub API, not from me typing them in.',
    // This ledger is filled in from the live API. The labels are yours; the
    // values are computed. Leave the keys alone unless you edit the layout.
    ledgerNote: 'Figures drawn nightly from the source. Not maintained by hand.',
  },

  // ── Section II · Ponstium Empire · work history ───────────────────────────
  experience: {
    heading: 'Ponstium Empire',
    folio: 'FOL. II',
    navNote: 'work history',
    intro:
      'Where I have worked and what I have run, most recent first. The title is what was on the paperwork. The line under it is what I actually did.',
    // Add or remove entries freely. Order is the order they appear.
    roles: [
      {
        title: 'Technology & Operations Intern, Sanjay Electrical Enterprises',
        meta: '2026 · Navi Mumbai · six weeks',
        body:
          'Built an ERP demo in React and Vite with a tap-first field app and a desktop admin console, digitised BOQs and tenders for four Mumbai sites, shipped the production website on Next.js and Sanity, and wrote a WhatsApp field-report bot. Also found a stored XSS bug in the old stack and reported it.',
      },
      {
        title: 'Founder, PulseEngine',
        meta: '2025 — present · open-source community',
        body:
          'Local-first, privacy-respecting, MIT-licensed tools. No subscriptions, no cloud lock-in, no data harvesting. First project is a market intelligence platform tracking 24 assets off 12 RSS feeds, running entirely on a laptop with no paid APIs.',
      },
      {
        title: 'VP of Sustainability, Student Council',
        meta: '2025 — present · Vijaybhoomi University',
        body:
          'Elected role. Sustainability policy and programmes across campus.',
      },
      {
        title: 'Co-lead, Kanyathon',
        meta: '2025 — present · Mumbai Division',
        body:
          'Charity marathon. Ran the Mumbai division: 100+ CSR outreaches, 30 volunteers, ₹24,000 in first-day sales.',
      },
      {
        title: 'Outreach Manager, FundNexus',
        meta: '2025 · remote',
        body: 'Partner outreach and pipeline.',
      },
      {
        title: 'Sponsorship Manager, Vijaybhoomi E-Cell',
        meta: '2025 · Vijaybhoomi University',
        body: 'Sponsorship for campus entrepreneurship programming.',
      },
    ],
    ledger: [
      ['studying', 'CSE, 2024–28'],
      ['founded', 'PulseEngine'],
      ['internships', '3'],
      ['best rank', '17 / 4,000'], // IIT Bombay NEC 2025
      ['status', 'student'],
    ],
    ledgerNote: 'Dates are accurate to the month. Everything else is exact.',
  },

  // ── Section III · Republic of Corum · photographs ─────────────────────────
  gallery: {
    heading: 'Republic of Corum',
    folio: 'FOL. III',
    navNote: 'photos',
    intro:
      'Photographs I took. No theme and no series, just the ones I kept. Drop a file into assets/photos and it appears here on the next build.',
    // The grid is generated from the folder. These two ledger rows are counted
    // for you; anything you add below shows up verbatim underneath them.
    ledgerExtra: [
      ['edited in', 'Darktable'],
    ],
    ledgerNote: 'Displayed at reduced resolution. Location data stripped.',
  },

  // ── Section IV · Kingdom of Dequm · about ─────────────────────────────────
  about: {
    heading: 'Kingdom of Dequm',
    folio: 'FOL. IV',
    navNote: 'who i am',
    // Each string is one paragraph. The first letter of the first paragraph
    // becomes the drop cap.
    paragraphs: [
      'I am a computer science engineering student at Vijaybhoomi University, class of 2028, and I build things because I want them to exist. Mostly that means local-first software: tools that run on your own machine, keep your data there, and do not ask for a subscription.',
      'PulseEngine is the open-source community I started around that idea. Everything under it is MIT licensed and runs without paid infrastructure, usually on GitHub Actions and a free API tier. Before that I wrote a transformer from scratch, character tokenizer through BPE and RoPE, mostly to find out whether I understood the internals or only the diagrams.',
      'Away from the terminal: Soulsborne games, Sanskrit and Buddhist terminology, a Samoyed, and running at hours no reasonable person keeps.',
    ],
    ledger: [
      ['based in', 'Mumbai, IN'],
      ['timezone', 'IST / UTC+5:30'],
      ['reading', 'Fate, HSR, lore'],
      ['licence', 'MIT, mostly'],
      ['open to', 'chats'],
    ],
    ledgerNote: 'This section is written by a person and updated by hand.',
  },

  // ── Section V · Phoededia · contact ───────────────────────────────────────
  contact: {
    heading: 'Phoededia',
    folio: 'FOL. V',
    navNote: 'links + email',
    intro:
      'Ways to reach me. Email is fastest. I read everything and answer most of it within a few days.',
    // label / display text / href. Add or remove rows freely.
    // label / what the visitor reads / where it goes.
    // A row with an empty href is skipped entirely, so an unfinished line never
    // ships as a dead link. Fill it in and it appears.
    links: [
      ['EMAIL', 'bhargavaramkrishnapur@gmail.com', 'mailto:bhargavaramkrishnapur@gmail.com'],
      ['GITHUB', 'github.com/Codex-Crusader', 'https://github.com/Codex-Crusader'],
      ['PULSEENGINE', 'github.com/The-Pulse-Engine', 'https://github.com/The-Pulse-Engine'],
      ['COMMUNITY', 'pulseengine.streamlit.app', 'https://pulseengine.streamlit.app'],
      ['LINKEDIN', 'linkedin.com/in/bhargavaram-krishnapur', 'https://www.linkedin.com/in/bhargavaram-krishnapur/'],
    ],
    ledger: [
      ['response', '~2 days'],
      ['best channel', 'email'],
      ['timezone', 'UTC+5:30'],
      ['open to', 'collaboration'],
      ['nda', 'fine by me'],
    ],
    ledgerNote: 'No contact form. Links are checked nightly.',
  },
};
