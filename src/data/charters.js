// ─────────────────────────────────────────────────────────────────────────────
//  THE CHARTERS · one page per holding worth a page of its own.
//
//  profile.js is the short half of the site: headings, one-line notes, ledger
//  rows. This is the long half, and it lives apart from that file for one
//  reason: six charters of prose would be four fifths of profile.js, and the
//  file whose whole promise is "change a string, commit, done" should not need
//  scrolling past three thousand words to reach the contact rows.
//
//  A repository gets a page because prose exists for it here. That is the
//  whole rule. It is deliberately not github.featured: that list means "opens
//  the province" and the map re-surveys itself around it, so hanging a second
//  meaning on it would move settlements every time a page was written.
//
//  `repo` must match a repository name from the survey exactly. One that
//  matches nothing is skipped, and `npm run build` prints its name, the same
//  rule as a featured name that matches nothing.
//
//  Everything here is written from the project's own README and its own
//  measurements. Nothing in a charter should be a claim the repository does
//  not already make about itself.
//
//  Required per entry: repo, slug, title, folio, numeral, seoTitle, standfirst
//  and body. `built` and `limits` are optional and their sections simply do
//  not render without them, on the same rule as an unfinished contact row.
//
//  One caution about `ledgerExtra`, and about any figure inside the prose.
//  Everything above those rows on a charter page is counted at build time off
//  the GitHub API; everything in them is quoted from a README. A quoted number
//  goes stale silently when the README moves, and nothing here will notice. Do
//  not quote a figure that changes often.
// ─────────────────────────────────────────────────────────────────────────────

export default [
  // ── I ────────────────────────────────────────────────────────────────────
  {
    repo: 'Pulse-Engine_Market_Intelligence_Platform',
    slug: 'pulse-engine',
    title: 'The Pulse Engine',
    folio: 'CHARTER I',
    // The mark in the corner. Set apart from the folio line so the two are
    // not printed twice over each other.
    numeral: 'I',
    // The <title> tag. Plain words a stranger would search, and the project's
    // real name first, because a name is the only thing anyone types twice.
    seoTitle: 'The Pulse Engine · explainable market intelligence, local-first',
    // The meta description and the standfirst under the heading, one sentence.
    standfirst:
      'An open-source market analysis platform that merges price data with news sentiment into one explainable signal, runs the whole scan on your own machine, and shows its working for every score it prints.',
    epigraph: 'A reading is worth nothing if it cannot say how it was taken.',
    body: [
      'The Pulse Engine reads two independent streams on every cycle and refuses to blend them silently. Thirty days of OHLCV price history comes from Yahoo Finance. Up to three hundred articles come from twelve curated RSS feeds, fetched in parallel, deduplicated by Jaccard similarity so the same wire story filed by six outlets counts once, and scored with VADER sentiment carrying an injected financial lexicon, because a general-purpose sentiment model reads "bond yields plunge" as bad news.',
      'Those two streams become a composite score from -10 to +10, weighted across six components: trend direction, price momentum, RSI, news sentiment, trend strength and market or sector context. Each asset class carries its own weighting profile, since a commodity and a tech stock do not respond to the same signals in the same proportion. Twenty-four assets across commodities, cryptocurrency, tech stocks and market indices are rescanned every thirty minutes by a background daemon thread, so the dashboard never blocks on a scan it did not ask for.',
      'The part that took the longest is the explanation, not the score. Every signal carries a built explanation naming which of the six components moved it and by how much, and eight event categories are detected separately so a central-bank decision does not disappear into a sentiment average. Snapshots are written to compressed JSON on disk under a tiered retention policy, full detail for seven days, reduced for thirty, deleted at sixty, and a backtester evaluates hit rate by signal strength so the platform can be checked against its own history rather than trusted on the strength of its interface.',
      'It runs without paid infrastructure. There is no server to rent, no database to provision, and no API key that costs money. That is the constraint the whole architecture is built around, and it is the reason the historical store is files on disk rather than something that would need a subscription to stay alive.',
    ],
    limits: {
      heading: 'What it is not',
      items: [
        'Not financial advice, and not a recommendation engine. It produces a reading and its reasoning; the decision stays with the reader.',
        'The sentiment engine is lexicon-based, not a language model. It is fast, auditable and cheap to run, and it will misread sarcasm and unusual phrasing.',
        'A signal is a description of what the six components did, not a forecast. The backtester exists so its hit rate can be argued with.',
      ],
    },
    built: ['Python', 'Streamlit', 'yfinance', 'VADER sentiment', 'pandas', 'Docker'],
    ledgerExtra: [
      ['assets scanned', '24'],
      ['rss feeds', '12'],
      ['scan interval', '30 min'],
      ['signal range', '-10 to +10'],
    ],
  },

  // ── II ───────────────────────────────────────────────────────────────────
  {
    repo: 'Correlation-engine',
    slug: 'correlation-engine',
    title: 'Correlation Engine',
    folio: 'CHARTER II',
    // The mark in the corner. Set apart from the folio line so the two are
    // not printed twice over each other.
    numeral: 'II',
    seoTitle: 'Correlation Engine · a daily correlation scan that publishes its own noise baseline',
    standfirst:
      'A daily correlation scan across news, markets and government data that prints, with equal visual weight, what the identical pipeline finds in pure noise. It has published zero edges so far, and that is the correct result.',
    epigraph: 'Run enough searches and something always confesses. The question is what noise confesses to.',
    body: [
      'Most correlation dashboards are machines for generating false claims: test enough pairs and something significant always falls out. This one runs the search anyway, twenty-six daily time series, every pair, every lag from minus seven to plus seven days, and then shows what the same pipeline finds in phase-randomised fake data with no real relationships in it at all.',
      'On a typical day that is about 4,875 hypothesis tests. At raw p below 0.05 roughly 244 of them pass by chance, because that is what p below 0.05 means. The placebo panel, running the identical pipeline on IAAFT surrogates twenty times a day, still finds around ninety-nine significant edges per run after false-discovery correction. Those two numbers sit next to the real result on the site, because if they look alike the reader should trust nothing, and the tool would rather say so than impress anybody.',
      'To be published, an edge survives four filters. Stationarity first: difference until the ADF test passes, remove the weekday cycle, and run Spearman on changes rather than levels, which kills the spurious correlations between any two things that both happen to trend. Then Benjamini-Hochberg across every test in the run with an effect-size floor. Then stability, the same pair with the same sign in at least ten of the last fourteen runs, which removes most survivors. Then the placebo panel. Published edges also carry a partial correlation with VIX changes conditioned out, labelled holds, fades, or weekends rather than stress, as context and never as a fifth filter.',
      'Every observation and every claim has been committed to the repository since day one, so the entire track record is auditable in the git log rather than asserted in a footer. It runs on GitHub Actions at 06:30 UTC with no server, no database and no paid API, and the site it rebuilds is static.',
    ],
    limits: {
      heading: 'Known limits, stated on the site itself',
      items: [
        'Selection bias survives the gate. The founding pool of series was chosen by a person with priors; a 60-day gate stops results-driven additions but cannot make the first choice neutral. The pool file history is the disclosure.',
        'The q-values are approximate, because a pair\'s fifteen lags are positively dependent rather than independent. That is one of the reasons the placebo panel exists.',
        'Sparse-event series, such as executive orders that are zero on most days, are the pool\'s statistically weakest members even after the weekday adjustment.',
        'It finds patterns, never causes. Government announcements usually respond to events, so even a clean lead-lag ordering routinely points backwards.',
      ],
    },
    built: ['Python', 'GitHub Actions', 'pandas', 'SciPy', 'statsmodels', 'GDELT', 'FRED'],
    ledgerExtra: [
      ['series tracked', '26'],
      ['tests per day', '4,875'],
      ['noise finds', '~99 / run'],
      ['edges published', '0'],
      ['servers', '0'],
    ],
  },

  // ── III ──────────────────────────────────────────────────────────────────
  {
    repo: 'digital-footprint-cleaner',
    slug: 'digital-footprint-cleaner',
    title: 'Digital Footprint Cleaner',
    folio: 'CHARTER III',
    // The mark in the corner. Set apart from the folio line so the two are
    // not printed twice over each other.
    numeral: 'III',
    seoTitle: 'Digital Footprint Cleaner · find your exposure and generate the removal requests',
    standfirst:
      'A local-only web app that finds where your personal information is exposed online, tells you honestly when a check failed rather than calling it clean, and generates the data-removal requests under the law that actually applies to you.',
    epigraph: 'Telling someone they are not listed, when the check merely failed, is the worst thing a privacy tool can do.',
    body: [
      'A plain web search surfaces mentions of a person. The real exposure is the data brokers and people-search sites that aggregate an address, a phone number, an age and a list of relatives into one page, and those pages do not rank well in a general search. So a scan here is a plan of narrow searches rather than one broad query: name variants, a location-scoped pass, site-scoped checks against ten platforms, public-record sweeps, and a deep check that queries each broker\'s own domain individually to find the listing a broad scan misses.',
      'Narrowing factors, an employer or a school or an age, are scored against every result so a different person with the same name in another state sinks instead of being reported as your exposure. They are deliberately never added to the query itself: extra search terms AND against a full-text index, so a factor-stuffed query finds fewer pages rather than more. Every result is banded strong, likely or possible with the matched facts shown, and pages that never name the subject are separated out rather than counted toward a score.',
      'The design decision the whole tool turns on is that every check reports one of three states, not two: found, not found, or unknown. Unknown means the check was blocked, throttled or timed out, and it is coloured differently everywhere it appears. Platforms that answer unreliably, and there are several that return a 200 for every handle that exists or does not, are not requested at all rather than guessed at. A deep scan says "9 of 11 checks completed" and names the two that did not, so a throttled sweep can never be read as a clean result.',
      'It runs on your own machine and refuses any request whose Host header is not localhost, which is what blocks DNS rebinding: without that check, any page open in your browser can reach a service bound to 127.0.0.1 and be treated as same-origin, and CSRF tokens do not stop it. There is no JavaScript at all, disclosure panels and the confidence filter are details and summary elements and :checked CSS, which is what lets the Content-Security-Policy stay as strict as it is. An optional passcode uses PBKDF2-SHA256 with a per-install salt, and when no passcode is set the header says Unlocked, so nobody is left assuming a protection that is not there.',
      'Removal is treated as a correspondence rather than a click. Petitions cite the legal basis you choose, GDPR or CCPA and CPRA or India\'s DPDP Act, with the right statute and deadline, and a local tracker records who was written to, what they said, and what still needs chasing. Brokers re-list people after three to six months, which is where the long game actually is.',
    ],
    limits: {
      heading: 'What is still true',
      items: [
        'The deep check is bounded. It covers the first eight brokers inside a 25-second budget, because the search backend throttles hard, and the rest are reported as skipped rather than clean.',
        'Broker removals are not permanent. Data typically reappears, which is the reason the tracker exists.',
        'It is still in development, and the repository says so rather than implying a finished product.',
      ],
    },
    built: ['Python', 'Flask', 'HTML', 'CSS', 'PBKDF2-SHA256', 'pytest'],
    ledgerExtra: [
      ['brokers listed', '30+'],
      ['platforms checked', '17'],
      ['tests passing', '362'],
      ['javascript', 'none'],
    ],
  },

  // ── IV ───────────────────────────────────────────────────────────────────
  {
    repo: 'bruhswer-the-homebrew-pseudo-browser',
    slug: 'bruhswer',
    title: 'bruhswer',
    folio: 'CHARTER IV',
    // The mark in the corner. Set apart from the folio line so the two are
    // not printed twice over each other.
    numeral: 'IV',
    seoTitle: 'bruhswer · a hardened browser wrapper that refuses to launch on an unproven control',
    standfirst:
      'A Windows browser wrapper that measures a fixed set of security properties before it will let the browser start, refuses to launch if any of them cannot be proved, and reports the things it cannot enforce as not enforceable instead of showing green.',
    epigraph: 'If it cannot be proved, the software says UNKNOWN.',
    body: [
      'bruhswer runs Microsoft Edge inside a set of controls it verifies on every launch, and it is honest that this makes it a wrapper. One unelevated Python process launches the browser, hosts its real window in its own frame, and measures the same fixed list of properties every time: a program-scoped Windows Firewall rule keeping the browser off your router and LAN, a confined profile with real ACL probes, a download quarantine directory, and a signature check on the browser binary. There is a single fail-closed decision point, and it will not accept UNKNOWN as PASS.',
      'The interesting question about a browser is never whether it is secure, which is unanswerable. It is which specific things were verified and how. So every verdict carries an evidence column, shown in the software\'s own interface as well as in its documentation, and the four kinds of evidence are kept apart: measured now, meaning bruhswer observed the property itself during this check; read-back, meaning it read a setting back from Windows just now; earlier measurement, meaning an experiment established it once on this hardware and nothing has re-run it; and reasoned, meaning it was derived from other facts and nothing was measured at all.',
      'The firewall rows are the case that forced that distinction. bruhswer reads the rule back live and can honestly say it is present, enabled, scoped to the browser and covering every range. That the rule actually stops the browser rests on a separate experiment that nothing re-runs. Both statements are true, they are different claims, and a single green dot was making the stronger one on the weaker one\'s evidence.',
      'The IPv6 rule is the same lesson applied a second time. bruhswer sets an outbound block for the IPv6 local ranges and verifies every launch that the rule is present and correctly scoped, but the IPv4 rule was measured empirically, router reachable, then blocked, then reachable again as the rule went on and came off, and there is no equivalent IPv6 result. A probe sent from bruhswer\'s own process would prove nothing, because the rules are scoped to the browser executable. So that panel reads RULE SET, EFFECT NOT MEASURED. It used to read BLOCKED, with exactly the same confidence as the rows that were actually measured, and that was an overclaim.',
    ],
    limits: {
      heading: 'What it does not do, and says so on screen',
      items: [
        'Localhost is reachable and bruhswer cannot stop it. Windows Firewall does not filter loopback traffic, and no rule changes that. Nineteen different routes in were tested and every one got through. It is reported as NOT ENFORCEABLE everywhere it is visible, and a regression test fails the build if it is ever described as anything else.',
        'It does not sandbox the browser process. Profile isolation protects browser state, not host access.',
        'It does not make anyone anonymous, and it is not a VM, a sandbox or a privacy product. It never claims to be.',
        'DNS encryption is reported as UNKNOWN, because it cannot be confirmed without a capture driver.',
      ],
    },
    built: ['Python', 'Tkinter', 'Windows Firewall', 'Windows ACLs', 'Microsoft Edge'],
    ledgerExtra: [
      ['platform', 'Windows'],
      ['elevation', 'not required'],
      ['network client', 'none'],
      ['listener', 'none'],
    ],
  },

  // ── V ────────────────────────────────────────────────────────────────────
  {
    repo: 'Quantum-Neural-Horror',
    slug: 'quantum-neural-horror',
    title: 'Quantum Neural Horror',
    folio: 'CHARTER V',
    // The mark in the corner. Set apart from the folio line so the two are
    // not printed twice over each other.
    numeral: 'V',
    seoTitle: 'Quantum Neural Horror · a neuroevolution sandbox that rewrites its own topology',
    standfirst:
      'A neuroevolution sandbox in one Python file: a network that adds and removes its own neurons, evolves its activation functions by genetic selection, and draws every step of it while it runs.',
    epigraph: 'Written to find out whether the internals were understood, or only the diagrams.',
    body: [
      'Backpropagation is not the only way to search for an architecture, and this is the other way, run rather than described. The network modifies its own topology while training, adding and removing neurons, and its activation functions are selected genetically rather than chosen up front. Simulated annealing with Metropolis-Hastings acceptance lets it take a worse step to escape a local minimum, which is the whole reason a topology search is not simply hill climbing.',
      'The design constraint is that it all fits in one file and draws itself. Five live matplotlib panels show the search as it happens rather than after it: the architecture as it changes shape, the loss, the mutation history, and the complexity measures the run tracks about itself. Watching an architecture search is a different kind of understanding from reading its final accuracy, and that is the point of the project rather than a decoration on it.',
      'Underneath the presentation it is ordinary, careful machine-learning engineering. L2 and complexity penalties keep the topology search from simply growing the network until it memorises the data, which is the failure mode a self-modifying architecture walks into first. It is a teaching object and a sandbox, not a model anyone should deploy, and the repository is clear about that.',
    ],
    limits: {
      heading: 'What it is for',
      items: [
        'A sandbox and a demonstration, not a production trainer. It is small on purpose and reads end to end.',
        'The consciousness and meta-cognition panels are named as a joke in the repository. They are complexity measures over the evolving topology, not a claim about the network.',
      ],
    },
    built: ['Python', 'NumPy', 'matplotlib'],
    ledgerExtra: [
      ['files', 'one'],
      ['backpropagation', 'none'],
      ['live panels', '5'],
    ],
  },

  // ── VI ───────────────────────────────────────────────────────────────────
  {
    repo: 'visitor-access-project',
    slug: 'campus-visitor-access',
    title: 'Campus Visitor Access',
    folio: 'CHARTER VI',
    // The mark in the corner. Set apart from the folio line so the two are
    // not printed twice over each other.
    numeral: 'VI',
    seoTitle: 'Campus Visitor Access · a UX research study of a university entry system',
    standfirst:
      'A product ideation study of visitor entry at Vijaybhoomi University: three interviews, eight card sorts and five tree tests, ending at a modelling problem rather than at a redesigned form.',
    epigraph: 'The form is genuinely irritating. It is not the problem.',
    body: [
      'A parent travelled three hours to visit her son, started the check-in form an hour before she arrived so she would not be caught out, and still ended up standing in the rain outside the gate. She got in when somebody inside the university made a phone call. The system had nothing to do with it. This study is about why that happens.',
      'Entry runs through a third-party visitor management system. A visitor fills in six screens at the gate, then waits for a host to approve the request before a pass arrives over WhatsApp. Fixing the form moves the emotion line on the journey map from minus one to zero while the trough stays at minus five, which is the finding that decided the rest of the work.',
      'The approval step has no accountable owner, no time bound and no failure path. If the named person does not act, nothing is rejected: the request is held, then silently cancelled, and the visitor begins again. The guards cannot rescue anyone either, because they do not know who the correct approver is; they call a shortlist and hope somebody answers. Silence is the failure mode, and silence has no recovery path.',
      'Underneath that sits a modelling problem. The system knows about visitors and it knows about approvers, but it does not know about the relationship that motivated the visit, so the person you came to see has no standing to let you in. The recommendation is a timer: if the first approver has not responded inside an agreed window the request reassigns itself to a named fallback, with the visitor doing nothing and re-entering nothing. It is the one state the current system does not have, and it is already what the guards improvise over the phone.',
      'Fieldwork ran from 31 July to 5 August 2026 and every participant is anonymised. The study site is plain HTML and CSS with no JavaScript, no dependencies and no build step, which is the same reason this portfolio is built the way it is.',
    ],
    limits: {
      heading: 'Scope',
      items: [
        'Research, sensemaking and information architecture. No interface was designed, deliberately: the work was to find where the system breaks and show the reasoning that got there.',
        'A small sample, stated plainly rather than generalised: three interviews, eight valid card sorts, five tree tests.',
      ],
    },
    built: ['HTML', 'CSS', 'Card sorting', 'Tree testing', 'Journey mapping'],
    ledgerExtra: [
      ['interviews', '3'],
      ['card sorts', '8'],
      ['tree tests', '5'],
      ['javascript', 'none'],
    ],
  },
];
