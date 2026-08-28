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
    // The h1, top-left of the map. It read 'B. KRISHNAPUR' once, which is how
    // a name is set on a title page and the wrong string for the one heading a
    // search engine reads as the subject of the page: an initial is not a name
    // anyone searches for. Written out in full it matches the title tag, the
    // schema and every external profile, which is what makes those four agree
    // they are about one person. Still letterspaced, so keep it a name and let
    // the trade beside it carry the job words.
    name: 'Bhargavaram Krishnapur',
    // Full name, used for the <title> tag and the copyright line.
    fullName: 'Bhargavaram Krishnapur',
    // Shown beside the name, top-left of the map. What you do, in the words a
    // stranger would use. The map is an argument that takes eleven screens to
    // finish, and this is the same claim in six words on the first line.
    //
    // Kept lowercase and letterspaced because it is set in the mono face, as a
    // filing annotation rather than a job title. It reads as part of the
    // document; a title-cased line here would read as a CV pasted onto a map.
    trade: 'software engineer · open source developer',
    // Was the whole of the masthead's right-hand side. Now the last line of
    // the footer, where a line about the mapmaking belongs: it is the flavour,
    // and the flavour should not be the first thing that answers "who is
    // this". The trade, above, answers that instead.
    //
    // Optional in the same way the colophon is: empty it and the footer simply
    // loses the line. Nothing else reads it, so it costs the rest of the site
    // nothing either way.
    tagline: 'software · open source · maps',
    // Browser tab title and meta description. The title carries the job words
    // as well as the name: on its own, a name only wins searches from people
    // who already know it.
    metaTitle: 'Bhargavaram Krishnapur, Software Engineer & Open Source Developer',
    // A description is a claim about the page, not a line of copy. The poetic
    // version said what the site looks like and never said who it is about, so
    // a search result for the name showed a sentence that could have described
    // anyone's portfolio. This one leads with the person and the trade, then
    // keeps the map, because the map is true and it is the reason to click.
    metaDescription:
      'Bhargavaram Krishnapur, software engineer and open-source developer. Local-first tools, machine learning and market intelligence software, laid out as a map.',
    // Under the map, before the realm begins. Who this is, in one sentence, in
    // plain words. The map says what is here, and this says who wrote it.
    //
    // It is a compression of the first paragraph of Kingdom of Dequm, not a
    // replacement for it: that section is still where the answer is given at
    // length. This exists because Dequm is 10,200px down the page, and a
    // stranger should not have to travel that far to learn whose site they are
    // standing on. Keep it to one sentence; it is a caption, not a section.
    // It leads with the work rather than with the enrolment. An earlier draft
    // opened "a computer science engineering student at Vijaybhoomi
    // University, class of 2028", which spent the most valuable line on the
    // page on the least load-bearing fact and pushed everything built into a
    // trailing clause. The degree is still in Kingdom of Dequm, where a
    // biography belongs; this line is for the work.
    standfirst:
      'I am Bhargavaram Krishnapur, founder of The Pulse Engine, building local-first open-source software: tools that run on your own machine, keep your data there, and do not ask for a subscription.',
    // The line engraved along the bottom edge of the map. {run} is replaced
    // with the real GitHub Actions run number at build time.
    mapInscription:
      'the realm of orvia · surveyed by b. krishnapur · redrawn nightly · run #{run}',
    // Footer.
    footerLine: '© 2026 b. krishnapur · built by hand · this map is not to scale',
    // A short "how this map was made" line, printed under the footer. Optional:
    // remove it and the footer simply loses the line.
    // This line used to end "no client-side script". The map now has one, so
    // it says what is actually true instead. Nothing on this site is worth
    // claiming that a visitor could disprove by opening the network tab.
    colophon: 'drawn by hand in astro · redrawn nightly by github actions · one small script, no trackers',
  },

  // ── GitHub ────────────────────────────────────────────────────────────────
  github: {
    // The personal account. Every public, non-forked, non-archived repo under
    // it is published automatically, and the follower count in the ledger is
    // read from this account rather than from the sum of the survey.
    username: 'Codex-Crusader',
    // Organisations surveyed alongside it. Work done under an org is still work
    // done, and leaving it out meant the Afon Empire quietly omitted the
    // largest thing in it. Same rules apply: public, not a fork, not archived.
    orgs: ['The-Pulse-Engine'],
    // Repos never to show. A bare name matches in any owner; `owner/name`
    // matches only there. Case is ignored either way.
    //
    // `.github` is an organisation's profile repo, not a project: no
    // description, no language, and it would render as an empty holding.
    exclude: [
      'Codex-Crusader.github.io',
      'Codex-Crusader',
      'The-Pulse-Engine/.github',
    ],
    // The handful of repositories that should open the province, in this order.
    // Everything else follows in the order the survey computes: recently
    // pushed first, then stars.
    //
    // This is the one place the ledger is ordered by hand, and deliberately so.
    // Push date is a measurement, not a judgement: it will happily seat a meme
    // scraper above a correlation engine because the scraper's cron ran this
    // morning. Keep the list short. A page where everything is featured is a
    // page where nothing is.
    //
    // Names are matched exactly against the repo name. One that matches nothing
    // is skipped, and `npm run build` prints its name on the way past.
    // Which holdings are genuinely applications, not just source.
    //
    // Every repository is SoftwareSourceCode in the graph, because every one of
    // them is source. Only some are also a thing a person installs or opens,
    // and those carry SoftwareApplication as a SECOND type on the SAME node
    // rather than as a second node. That distinction is the whole reason this
    // list is short: one project must stay one node with one @id, or the graph
    // stops describing a project and starts describing two things that happen
    // to share a name and a repository URL.
    //
    // This is a judgement and not a measurement, which is why it is typed here
    // next to `featured` rather than derived from topics. A topic is a label
    // the author chose for discovery; whether something is an application is a
    // claim about what it is, and claiming the wrong type is how a page loses
    // rich-result eligibility for nothing.
    //
    // A name matching no surveyed repository is simply not used. Leave a repo
    // out and it stays what it always was: source code, described as such.
    applications: {
      'bruhswer-the-homebrew-pseudo-browser': {
        category: 'SecurityApplication',
        os: 'Windows',
      },
      'Stack-Sight': {
        category: 'BrowserApplication',
        os: 'Chrome',
      },
      'Pulse-Engine_Market_Intelligence_Platform': {
        category: 'FinanceApplication',
      },
      'digital-footprint-cleaner': {
        category: 'SecurityApplication',
      },
      'Image-Protector': {
        category: 'MultimediaApplication',
        os: 'Windows',
      },
      'Random_Github_Repo_Finder': {
        category: 'DeveloperApplication',
      },
      'Uni-basketball-ETL-pipeline': {
        category: 'BusinessApplication',
      },
    },
    featured: [
      'Correlation-engine',
      'Pulse-Engine_Market_Intelligence_Platform',
      'digital-footprint-cleaner',
      'visitor-access-project',
    ],
  },

  // ── The writ · the downloadable résumé ────────────────────────────────────
  // The PDF itself lives in public/. Replace that file, keep the name, and the
  // new one ships on the next build.
  //
  // Nothing here is a promise the build cannot keep: src/data/resume.js checks
  // that the file is really on disk and measures its own size. If the PDF is
  // missing, the whole writ disappears from both provinces rather than shipping
  // as a broken download, the same rule as an unfinished contact row.
  resume: {
    file: 'bhargavaram-krishnapur-resume.pdf',
    // Shown over the plate at the foot of Ponstium Empire.
    label: 'THE WRIT',
    line: 'The same service, set on one sheet and fit to print.',
    linkText: 'download the writ',
    // The row this earns in Phoededia's list of roads.
    contactLabel: 'RÉSUMÉ',
    // The masthead link, on the first screen. Short: it sits beside the name
    // and must not compete with it.
    mastheadLink: 'résumé',
    // The seal drawn on the map itself, in the sea off the south-west. In the
    // map's own language, since it is lettered on the sheet beside the legend.
    sealLabel: 'The Writ',
    // Typed by hand, because a file's timestamp on a build server is the time
    // it was checked out, not the month the writ was actually redrawn. Change
    // this when you change the PDF.
    revised: 'August 2026',
  },

  // ── Section I · Ponstium Empire · work history ────────────────────────────
  //
  // The experience folio opens the realm. It used to be second, behind the
  // repositories, which put the strongest argument for the work behind a list
  // that a stranger has no way to rank yet. This one is read in the order it is
  // written; the ledger is not.
  experience: {
    heading: 'Ponstium Empire',
    // The heading in plain words, set small under it. A place name says
    // nothing to a stranger who has not read the map yet, and nothing at all
    // to a search engine. Kept lowercase because it is set in the mono face,
    // as a filing annotation rather than a second title.
    subtitle: 'professional experience',
    folio: 'FOL. I',
    navNote: 'work history',
    epigraph: 'The paper titles and the real work are recorded apart.',
    marginNote: 'measured on foot',
    intro:
      'Where I have worked and what I have run, most recent first. The title is what was on the paperwork. The line under it is what I actually did.',
    // Add or remove entries freely. Order is the order they appear.
    // Each role carries two registers of the same post, and they are one object
    // rather than two files, on purpose.
    //
    //   · `body` is the front page. One paragraph, read in passing, by someone
    //     scrolling a map.
    //   · `responsibilities`, `achievements` and `technologies` are /experience/,
    //     where a reader has already decided they want the long version.
    //
    // Keeping them in one entry is what stops the two from drifting: a date
    // corrected here is corrected in both places, and there is no second list
    // to forget. The long fields are optional in the same way an unfinished
    // contact row is: a role without them renders no such block on
    // /experience/, rather than an empty heading.
    //
    // `technologies` is genuinely absent on the roles that were not technical
    // work. A sponsorship post did not have a stack, and inventing one to fill
    // the shape of the template would be the fake-detail version of the same
    // mistake as a keyword wall.
    roles: [
      {
        title: 'Founder, The Pulse Engine',
        meta: 'Apr 2026 — present · Mumbai · hybrid',
        body:
          'An open-source developer community built on one principle: software runs on your machine, your data stays on your machine, and your tools belong to you. Shipped the first project on day one. MIT licensed, free forever. Growing a contributor base through LinkedIn, Discord and daily GitHub activity.',
        responsibilities: [
          'Set the technical direction for every project released under the organisation, and hold each one to the same rule: it has to run on a normal computer, without a paid server behind it.',
          'Run the GitHub organisation itself. Review what comes in, keep the licence the same across repositories, and keep each project documented well enough that a stranger can install it.',
          'Grow the contributor base in the open, through LinkedIn, Discord and daily activity on GitHub, rather than through a launch with nothing behind it.',
        ],
        achievements: [
          'Shipped the first project on the day the organisation was founded, so it started as working software rather than as a plan.',
          'Everything released is MIT licensed and free, with no paid tier and nothing held back.',
          'Built the flagship project, an explainable market analysis platform, to run entirely on free infrastructure: no server to rent, no database to set up, and no API key that costs money.',
        ],
        technologies: ['Python', 'Streamlit', 'pandas', 'Docker', 'GitHub Actions'],
      },
      {
        title: 'Podcast Host, VUTV',
        meta: 'Mar 2026 — present · Karjat · on-site',
        body:
          'Co-host one of the university\'s official podcast series in a three-host rotation. Curate episode topics and build structured conversation outlines, research and reach out to guests across students, faculty and professionals, and moderate episodes for clear discussion flow and audience engagement. Also handle guest prep, interview framing and episode planning.',
        responsibilities: [
          'Co-host one of the university\'s official podcast series, in a rotation of three hosts.',
          'Choose the topic for each episode and write the outline the conversation follows.',
          'Find and invite guests from across students, faculty and working professionals, and brief them before recording.',
          'Moderate the episode itself, keeping the discussion clear and keeping it moving.',
        ],
        achievements: [
          'Took episodes from a loose idea to a planned format, with a written outline and a prepared guest, rather than recording and hoping.',
        ],
      },
      {
        title: 'Strategic Research & Idea Validation Advisor, Self-Employed (Udyam Registered)',
        meta: 'Jan 2026 — present · Mumbai · remote · freelance',
        body:
          'A Udyam-registered micro-consultancy helping entrepreneurs validate business ideas before they sink months into them. Structured consultations and targeted research end in an honest, data-driven call to pursue, pivot or pause. Covers feasibility analysis, market and competitor research, strategic SWOT, financial forecasting and differentiation planning.',
        responsibilities: [
          'Run structured consultations with founders who want to know whether an idea is worth the next six months of their life.',
          'Do the research behind the answer: whether the thing can be built, who is already selling it, and what it would cost to run.',
          'Build the financial forecast and the SWOT, and work out what would make this business different from the ones already there.',
          'Give the call in plain words, and give it honestly: pursue, pivot or pause.',
        ],
        achievements: [
          'Registered the practice under Udyam, so it operates as a real registered micro-enterprise rather than as informal advice.',
          'Built the engagement around a decision rather than a document. Every consultation ends in a recommendation the founder can act on that week.',
        ],
      },
      {
        title: 'Sponsorship Manager, Vijaybhoomi E-Cell',
        meta: 'Sep 2024 — present · Karjat · on-site',
        body:
          'Sponsorship lead for the university\'s entrepreneurship cell. Raised ₹2L+ for Elevate 2.0, our flagship event, by building the prospect list, writing the pitch and running the conversations to close. Also worked on the roadmap planning that carried the team through to the finals of IIT Bombay\'s E-Summit.',
        responsibilities: [
          'Lead sponsorship for the university\'s entrepreneurship cell: build the list of companies worth approaching, write the pitch, and run the conversations through to a signed commitment.',
          'Help plan the roadmap the team competes on.',
        ],
        achievements: [
          'Raised over ₹2 lakh for Elevate 2.0, the cell\'s flagship event.',
          'Contributed to the roadmap planning that carried the team to the finals of IIT Bombay\'s E-Summit.',
        ],
      },
      {
        title: 'Technology & Operations Intern, Sanjay Electrical Enterprises',
        meta: 'May — Jun 2026 · Navi Mumbai · on-site',
        body:
          'Company-side lead on the firm\'s ERP digitisation, owning QA, billing, documentation and marketing, and delivered a recommended ERP selected after direct vendor evaluation. Designed a tap-first billing model for square-foot electrical contracts (area × rate as a fixed cap, auto-distributed across stages), logged 50+ bugs and security issues as actionable tickets for a non-technical manager, ran field assessments across three active sites, and migrated tender handling to a fully digital workflow. Also authored a practical guide to square-foot contracting and Indian compliance (RA bills, Ind AS 115, MSMED Act, GST SAC 9954).',
        responsibilities: [
          'Act as the company\'s own lead on its move to an ERP system, covering testing, billing, documentation and marketing.',
          'Evaluate ERP vendors directly and recommend one, rather than accepting the first quote.',
          'Test the software hard enough to find what was wrong with it, and write each problem up so a manager with no technical background could act on it.',
          'Assess three active sites in the field, and move tender handling off paper.',
        ],
        achievements: [
          'Designed a tap-first billing model for square-foot electrical contracts, where area multiplied by rate sets a fixed cap that is then spread across the stages of the job automatically.',
          'Logged more than 50 bugs and security issues as tickets a non-technical manager could act on.',
          'Moved tender handling to a fully digital workflow.',
          'Wrote a practical guide to square-foot contracting and the Indian compliance around it, covering RA bills, Ind AS 115, the MSMED Act and GST SAC 9954.',
        ],
        technologies: ['ERP evaluation', 'QA and bug reporting', 'Technical documentation'],
      },
      {
        title: 'Brand Partnership Management Intern, MedInventory',
        meta: 'Jan — Apr 2026 · internship',
        body:
          'Led end-to-end sponsorship acquisition for a company-hosted event, from prospect research through partner onboarding. Identified and evaluated brands and individuals able to sponsor or add strategic value, prepared pitch materials and partner briefs, and coordinated sponsor communications, timelines and deliverables through to execution.',
        responsibilities: [
          'Run sponsorship for a company-hosted event, from the first list of prospects through to a partner who has signed and been brought on board.',
          'Work out which brands and individuals could sponsor, or bring something useful beyond money.',
          'Write the pitch materials and the partner briefs.',
          'Keep sponsor communication, timelines and deliverables on track through to the event itself.',
        ],
        achievements: [
          'Owned the whole sponsorship pipeline for the event rather than one stage of it.',
        ],
      },
      {
        title: 'Outreach Manager, FundNexus',
        meta: 'Jun — Dec 2025 · Mumbai',
        body:
          'Advanced and closed early-stage engagements, and built a central deal-tracker consolidating pipeline status, next actions and owners, which cut duplicate follow-ups. Standardised outreach and deal-ops with lightweight playbooks and handoff templates, sourced and qualified 30+ startups, added 250+ relevant connections, and managed legal document workflows (term sheets, NDAs, data requests) for cleaner closings. Also assembled the pitch deck leadership used at a hackathon.',
        responsibilities: [
          'Move early-stage engagements forward and close them.',
          'Find and qualify startups worth talking to, and build the network to reach them.',
          'Handle the legal paperwork around a closing: term sheets, NDAs and data requests.',
        ],
        achievements: [
          'Built a central deal tracker holding pipeline status, the next action and the person who owns it, which cut duplicate follow-ups.',
          'Standardised how outreach and deal operations were run, using short playbooks and handoff templates instead of everyone inventing their own.',
          'Sourced and qualified more than 30 startups, and added more than 250 relevant connections.',
          'Assembled the pitch deck leadership presented at a hackathon.',
        ],
      },
      {
        title: 'Operations Co-Head, Kanyathon (Mumbai Division)',
        meta: 'Oct 2024 — Dec 2025 · Mumbai · on-site',
        body:
          'Co-ran operations for the Mumbai division of a charity run, leading 80 volunteers to the start line on a one-month timeline. Ran 100+ CSR outreaches that brought in ₹20L+ of sponsorship, and owned execution end to end: volunteer allocation, vendor and ground logistics, and day-of coordination across the course.',
        responsibilities: [
          'Co-run operations for the Mumbai division of a charity run, on a one-month timeline.',
          'Allocate volunteers, handle vendors and ground logistics, and coordinate the course on the day.',
          'Run corporate outreach for sponsorship.',
        ],
        achievements: [
          'Led 80 volunteers to the start line inside a one-month window.',
          'Ran more than 100 CSR outreaches, which brought in over ₹20 lakh of sponsorship.',
        ],
      },
      {
        title: 'Freelance Resume Writer, Self-employed',
        meta: 'Jan 2023 — Jul 2025 · Mumbai · remote',
        body:
          'Tailored resumes, cover letters and LinkedIn profiles for clients across career stages, with ATS optimisation to get them past the filters. Helped 50+ clients land interviews.',
        responsibilities: [
          'Write and rework resumes, cover letters and LinkedIn profiles for clients at every stage of a career.',
          'Tune each one for the applicant tracking systems that read it before a person does.',
        ],
        achievements: [
          'Helped more than 50 clients reach the interview stage.',
        ],
      },
      {
        title: 'Student Volunteer, DBM India (NIT)',
        meta: 'May — Jun 2025 · Mumbai · on-site',
        body:
          'Co-created an education pipeline for Grades 1–5 for children in Mumbai slum communities. Ran field research across Deonar, Gautam Nagar and Bhim Nagar, collecting 50+ student interest profiles, wrote psychology-based interaction guidelines for future volunteers and teacher guidelines for low-literacy classrooms, and presented the final proposals to DBM\'s leadership for phased rollout.',
        responsibilities: [
          'Help build an education pipeline for Grades 1 to 5, for children in Mumbai slum communities.',
          'Do the field research it rests on, across Deonar, Gautam Nagar and Bhim Nagar.',
          'Write the guidance the next set of volunteers and teachers would actually use.',
        ],
        achievements: [
          'Collected more than 50 student interest profiles from field research.',
          'Wrote interaction guidelines for future volunteers, grounded in psychology, and teaching guidelines for classrooms with low literacy.',
          'Presented the final proposals to DBM\'s leadership for a phased rollout.',
        ],
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

  // ── Section II · Afon Empire · projects ───────────────────────────────────
  projects: {
    heading: 'Afon Empire',
    subtitle: 'open source projects',
    folio: 'FOL. II',
    // Sub-label under the province name in the mobile territory list.
    // Not "github profile" any more: the province is no longer one account's
    // page. It is that account and every organisation in github.orgs, surveyed
    // together, and a label naming one of them would be describing a smaller
    // place than the one it links to.
    navNote: 'repositories',
    // Optional italic line under the heading, and a marginal mark by the ledger.
    epigraph: 'These lands were charted by the source, not by hand.',
    marginNote: 'triangulated from the register',
    // First letter is set as the drop cap automatically.
    intro:
      'Public repositories, mine and The Pulse Engine\'s. Everything here is open source, and most of it started as something I needed and could not find. The figures in the ledger come from the GitHub API, not from me typing them in.',
    // This ledger is filled in from the live API. The labels are yours; the
    // values are computed. Leave the keys alone unless you edit the layout.
    // The order is not computed all the way down: github.featured seats a few
    // repositories at the head of the province, and the note says so, because
    // the rest of this page is careful about the difference between a
    // measurement and a decision.
    ledgerNote: 'Figures drawn nightly from the source. The first few holdings are placed by hand; the rest are ordered by the survey.',
  },

  // ── Section III · Republic of Corum · photographs ─────────────────────────
  gallery: {
    heading: 'Republic of Corum',
    subtitle: 'photography',
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
    subtitle: 'about bhargavaram krishnapur',
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
    // ── /about/ · the long version ──────────────────────────────────────────
    //
    // The three paragraphs above are the front page: a stranger scrolling a map,
    // who gets one province of biography and should not be handed a CV. This is
    // the page they land on when they have decided they want more, and it is
    // deliberately not the same text set larger.
    //
    // Nothing here repeats `paragraphs`. Where the two cover the same ground the
    // wording is different and the detail is new, because two pages that say the
    // same thing in the same words are one page indexed twice, and the weaker
    // copy is the one that ranks.
    //
    // Skills are grouped by hand, and that is a judgement rather than a
    // measurement, so the page prints it next to one that is measured: the
    // languages the survey actually found across the repositories. A reader can
    // see which list is a claim and which is a count. That split is the whole
    // reason the hand-written half is allowed to exist at all.
    page: {
      metaTitle: 'About Bhargavaram Krishnapur, software engineer in Mumbai',
      metaDescription:
        'Bhargavaram Krishnapur is a software engineer and open-source developer in Mumbai, founder of The Pulse Engine, building local-first tools that run on your own machine. Skills, education, interests and links.',
      folio: 'FOL. IV',
      standfirst:
        'The long version: what I build, what I know, where I studied, and how to reach me.',
      paragraphs: [
        'I build software that runs where the person using it is sitting. That is the thread through nearly everything on this site, and it is a technical position before it is a philosophical one: a tool that does its work on your own machine has no server to go down, no bill to stop paying, and no copy of your data anywhere you cannot delete it. Most of what I have written started because I wanted that version of something and could only find the version that wanted an account.',
        'The Pulse Engine is the organisation I started around that idea, and its first project is the one I would point at first. It reads market prices and news together and prints a single score, but the part that took the longest was not the score. It was making the thing explain itself: every reading names which of its six components moved it and by how much, so a reader can disagree with the reasoning rather than trusting a number. A tool that cannot say how it reached an answer is asking to be believed, and I would rather build one that can be argued with.',
        'The rest of the work spreads out from there. A correlation scanner that publishes what pure noise produces alongside its own findings, so a result has something to be measured against. A hardened browser that says NOT ENFORCEABLE out loud when it cannot actually enforce something, instead of showing a green tick. A neuroevolution sandbox that rewrites its own network while you watch. A chess engine that learns from playing itself. They look unrelated until you notice they are all the same instinct: build the thing, then make it show its working.',
        'I am in my computer science engineering degree at Vijaybhoomi University, class of 2028. A fair amount of what I know came from the degree and a fair amount came from writing a transformer from scratch, character tokenizer through BPE and RoPE, to find out whether I understood the internals or only the diagrams. I recommend the second method for anything you think you already understand.',
        'Away from the terminal I play Soulsborne games, read Sanskrit and Buddhist terminology, own a Samoyed with strong opinions about the front door, and run at hours no reasonable person keeps. I answer email, usually within a couple of days, and I am always glad to talk to someone building something.',
      ],
      // Grouped by hand. Every entry is backed by something public on this site
      // or in the survey: if a skill is listed here and no repository, role or
      // article demonstrates it, it should come out rather than stay as a claim.
      skills: [
        {
          area: 'Languages',
          items: ['Python', 'JavaScript', 'HTML and CSS', 'SQL'],
        },
        {
          area: 'Machine learning',
          items: [
            'Neural networks from scratch',
            'Transformers, tokenizers through RoPE',
            'Neuroevolution and simulated annealing',
            'Monte Carlo tree search, AlphaZero-style self-play',
            'scikit-learn',
            'Sentiment analysis',
          ],
        },
        {
          area: 'Data and pipelines',
          items: [
            'ETL pipelines',
            'pandas',
            'Time series analysis',
            'Statistical testing and multiple-comparison correction',
            'Data leakage detection',
            'Backtesting',
          ],
        },
        {
          area: 'Web and interfaces',
          items: ['Flask', 'Streamlit', 'Astro', 'Tkinter', 'Chrome extensions, Manifest V3'],
        },
        {
          area: 'Security and privacy',
          items: [
            'Browser hardening',
            'Threat modelling',
            'Windows Firewall scoping',
            'Metadata and EXIF stripping',
            'Local-first and no-telemetry design',
          ],
        },
        {
          area: 'Practice',
          items: [
            'Git and GitHub Actions',
            'Docker',
            'CI as free infrastructure',
            'Technical writing and documentation',
            'UX research: interviews, card sorts, tree tests',
          ],
        },
      ],
      education: [
        {
          qualification: 'B.Tech, Computer Science Engineering',
          institution: 'Vijaybhoomi University',
          meta: '2024 — 2028 · Karjat, Maharashtra',
          note:
            'Currently enrolled, class of 2028. Alongside the degree I run the university entrepreneurship cell\u2019s sponsorship, and co-host one of its official podcast series.',
        },
      ],
      // Kept because a person is not only their stack, and kept short because
      // this is the part of a profile that most easily becomes filler.
      interests: [
        ['Soulsborne games', 'The design argument interests me as much as the games do: difficulty used as a way of teaching rather than as a wall.'],
        ['Sanskrit and Buddhist terminology', 'Reading, slowly. Precise vocabulary for things most languages leave vague.'],
        ['Running', 'At hours no reasonable person keeps.'],
        ['A Samoyed', 'With strong opinions about the front door.'],
      ],
    },
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
    subtitle: 'contact and links',
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
      ['GITLAB', 'gitlab.com/bhargavaramkrishnapur', 'https://gitlab.com/bhargavaramkrishnapur'],
      // The handle rather than the name, because that is what the profile is
      // actually called. Every road in this list is also a sameAs in the
      // schema, which is the point of adding it: an identity is a set of
      // profiles that point at each other, and the site owns the half that
      // points back.
      ['REDDIT', 'reddit.com/user/Codex_Crusader', 'https://www.reddit.com/user/Codex_Crusader/'],
    ],
    ledger: [
      ['response', '~2 days'],
      ['best channel', 'email'],
      ['timezone', 'UTC+5:30'],
      ['open to', 'collaboration'],
      ['nda', 'fine by me'],
    ],
    // This used to read "Links are checked nightly." Nothing checks them:
    // check-profile.js only notices a row left blank, and the nightly run
    // resurveys the repositories, not these three addresses. Same rule as the
    // colophon: nothing on this site should claim what a visitor could
    // disprove. What is actually true is that an unfinished row never ships.
    ledgerNote: 'No contact form. A link is only listed here once it goes somewhere.',
  },
};
