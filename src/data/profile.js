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
    // Browser tab title and meta description. The title carries the job words
    // as well as the name: on its own, a name only wins searches from people
    // who already know it.
    metaTitle: 'Bhargavaram Krishnapur — Software Engineer & Open Source Developer',
    metaDescription:
      'Open-source software, local-first tools and photographs, laid out as a map.',
    // The line engraved along the bottom edge of the map. {run} is replaced
    // with the real GitHub Actions run number at build time.
    mapInscription:
      'the realm of orvia · surveyed by b. krishnapur · redrawn nightly · run #{run}',
    // Footer.
    footerLine: '© 2026 b. krishnapur · built by hand · this map is not to scale',
    // A short "how this map was made" line, printed under the footer. Optional:
    // remove it and the footer simply loses the line.
    colophon: 'drawn by hand in astro · redrawn nightly by github actions · no client-side script',
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
    // Optional italic line under the heading, and a marginal mark by the ledger.
    epigraph: 'These lands were charted by the source, not by hand.',
    marginNote: 'triangulated from the register',
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
    epigraph: 'The paper titles and the real work are recorded apart.',
    marginNote: 'measured on foot',
    intro:
      'Where I have worked and what I have run, most recent first. The title is what was on the paperwork. The line under it is what I actually did.',
    // Add or remove entries freely. Order is the order they appear.
    roles: [
      {
        title: 'Founder, The Pulse Engine',
        meta: 'Apr 2026 — present · Mumbai · hybrid',
        body:
          'An open-source developer community built on one principle: software runs on your machine, your data stays on your machine, and your tools belong to you. Shipped the first project on day one. MIT licensed, free forever. Growing a contributor base through LinkedIn, Discord and daily GitHub activity.',
      },
      {
        title: 'Podcast Host, VUTV',
        meta: 'Mar 2026 — present · Karjat · on-site',
        body:
          'Co-host one of the university\'s official podcast series in a three-host rotation. Curate episode topics and build structured conversation outlines, research and reach out to guests across students, faculty and professionals, and moderate episodes for clear discussion flow and audience engagement. Also handle guest prep, interview framing and episode planning.',
      },
      {
        title: 'Strategic Research & Idea Validation Advisor, Self-Employed (Udyam Registered)',
        meta: 'Jan 2026 — present · Mumbai · remote · freelance',
        body:
          'A Udyam-registered micro-consultancy helping entrepreneurs validate business ideas before they sink months into them. Structured consultations and targeted research end in an honest, data-driven call to pursue, pivot or pause. Covers feasibility analysis, market and competitor research, strategic SWOT, financial forecasting and differentiation planning.',
      },
      {
        title: 'Technology & Operations Intern, Sanjay Electrical Enterprises',
        meta: 'May — Jun 2026 · Navi Mumbai · on-site',
        body:
          'Company-side lead on the firm\'s ERP digitisation, owning QA, billing, documentation and marketing, and delivered a recommended ERP selected after direct vendor evaluation. Designed a tap-first billing model for square-foot electrical contracts (area × rate as a fixed cap, auto-distributed across stages), logged 50+ bugs and security issues as actionable tickets for a non-technical manager, ran field assessments across three active sites, and migrated tender handling to a fully digital workflow. Also authored a practical guide to square-foot contracting and Indian compliance (RA bills, Ind AS 115, MSMED Act, GST SAC 9954).',
      },
      {
        title: 'Brand Partnership Management Intern, MedInventory',
        meta: 'Jan — Apr 2026 · internship',
        body:
          'Led end-to-end sponsorship acquisition for a company-hosted event, from prospect research through partner onboarding. Identified and evaluated brands and individuals able to sponsor or add strategic value, prepared pitch materials and partner briefs, and coordinated sponsor communications, timelines and deliverables through to execution.',
      },
      {
        title: 'Outreach Manager, FundNexus',
        meta: 'Jun — Dec 2025 · Mumbai',
        body:
          'Advanced and closed early-stage engagements, and built a central deal-tracker consolidating pipeline status, next actions and owners, which cut duplicate follow-ups. Standardised outreach and deal-ops with lightweight playbooks and handoff templates, sourced and qualified 30+ startups, added 250+ relevant connections, and managed legal document workflows (term sheets, NDAs, data requests) for cleaner closings. Also assembled the pitch deck leadership used at a hackathon.',
      },
      {
        title: 'Freelance Resume Writer, Self-employed',
        meta: 'Jan 2023 — Jul 2025 · Mumbai · remote',
        body:
          'Tailored resumes, cover letters and LinkedIn profiles for clients across career stages, with ATS optimisation to get them past the filters. Helped 50+ clients land interviews.',
      },
      {
        title: 'Student Volunteer, DBM India (NIT)',
        meta: 'May — Jun 2025 · Mumbai · on-site',
        body:
          'Co-created an education pipeline for Grades 1–5 for children in Mumbai slum communities. Ran field research across Deonar, Gautam Nagar and Bhim Nagar, collecting 50+ student interest profiles, wrote psychology-based interaction guidelines for future volunteers and teacher guidelines for low-literacy classrooms, and presented the final proposals to DBM\'s leadership for phased rollout.',
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
    epigraph: 'These plates were kept, not composed.',
    marginNote: 'no compass, only light',
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
    epigraph: 'This one province alone is written by a living hand.',
    marginNote: 'the cartographer, in person',
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
    epigraph: 'Only the roads here actually reach the author.',
    marginNote: 'all roads kept clear',
    intro:
      'Ways to reach me. Email is fastest. I read everything and answer most of it within a few days.',
    // label / display text / href. Add or remove rows freely.
    // label / what the visitor reads / where it goes.
    // A row with an empty href is skipped entirely, so an unfinished line never
    // ships as a dead link. Fill it in and it appears.
    links: [
      ['EMAIL', 'bhargavaramkrishnapur@gmail.com', 'mailto:bhargavaramkrishnapur@gmail.com'],
      ['GITHUB', 'github.com/Codex-Crusader', 'https://github.com/Codex-Crusader'],
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
