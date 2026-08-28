// ─────────────────────────────────────────────────────────────────────────────
//  THE CHRONICLES · the writing.
//
//  charters.js is one entry per project. This is one entry per article, and it
//  is a separate file for the same reason charters.js is: profile.js promises
//  "change a string, commit, done", and it cannot keep that promise if it has
//  ten thousand words of prose in it.
//
//  An article is written to be read by a person, not assembled to be indexed.
//  Every one of these is about work that exists somewhere public, and the rule
//  is the same rule the charters keep: nothing in an article should be a claim
//  the work does not already make about itself.
//
//  ── Linking to projects ────────────────────────────────────────────────────
//
//  `projects` lists REPOSITORY NAMES, not charter slugs, and this is deliberate.
//  A slug is an address, and an address is an implementation detail that can be
//  renamed on a whim. The repository name is the identity the whole site is
//  already keyed to: charters.js matches on it, the survey matches on it, and
//  the JSON-LD graph gives one project one @id built from it. Referring to a
//  project by the same name everything else refers to it by is what stops a
//  rename from silently emptying a page of its links.
//
//  The link is two-way and written once. An article names the projects it is
//  about, and each charter works out its own "related articles" by asking this
//  file which articles named it. There is no second list to maintain on the
//  charter side, so the two halves cannot disagree.
//
//  A name the survey does not report is printed by `npm run build` and its link
//  is dropped, the article keeping its prose. It does not fail the build: a name
//  matching nothing is either a typo or a repository that has since been
//  archived, renamed or excluded, and from inside the build those two look
//  identical. Failing would let an archived repo kill a nightly deploy nobody is
//  watching. Same rule charters.js already keeps for a missing repository.
//
//  ── Figures ────────────────────────────────────────────────────────────────
//
//  Reading time and word count are NOT typed here. They are counted from the
//  body at build time by src/data/chronicle.js, on the same principle as the
//  résumé's file size: a figure a reader uses to make a decision should be
//  measured rather than remembered.
// ─────────────────────────────────────────────────────────────────────────────

export default [
  // ── I ────────────────────────────────────────────────────────────────────
  {
    slug: 'local-first-software',
    title: 'Local-first software',
    folio: 'CHRONICLE I',
    numeral: 'I',
    published: '2026-08-28',
    seoTitle: 'Local-first software: why your tools should run on your own machine',
    standfirst:
      'Most software you use today runs on someone else’s computer. Local-first software runs on yours. Here is what that changes, what it costs, and why nearly everything I build works this way.',
    epigraph: 'A tool you cannot run offline is a tool somebody can switch off.',
    projects: ['Stack-Sight', 'bruhswer-the-homebrew-pseudo-browser', 'digital-footprint-cleaner'],
    tags: ['local-first', 'privacy', 'software design'],
    sections: [
      {
        heading: null,
        paragraphs: [
          'Think about the apps you opened today. Your notes, your email, your to-do list, the thing you track your money in. Almost all of them work the same way. You type something in, it goes over the internet to a company’s computer, and that computer sends back what you see on screen. Your data lives there. The program lives there. You are renting access to both.',
          'That arrangement is so normal now that it is easy to forget it is a choice. Local-first software makes the other choice. The program runs on your machine. Your files sit on your disk. The internet is something the software can use when it is there, not something it needs in order to start.',
        ],
      },
      {
        heading: 'What actually goes wrong with the other way',
        paragraphs: [
          'This is not really about privacy, although privacy is part of it. It is about who is in control, and there are four specific things that can be taken away from you.',
          'The company can shut down. When it does, the software stops working. Not "stops getting updates", stops working, because the part that did the thinking was never on your computer. People have lost years of notes this way.',
          'The price can change. You did not buy the tool, you are renting it, and rent goes up. If your work is inside it, moving out is expensive enough that most people just pay.',
          'The software can change under you. A feature you depended on gets removed and there is no old version to stay on. You did not install it, so you cannot decline the update.',
          'And your data is somewhere you cannot reach. You can usually ask for a copy. Whether you get it in a format anything else can open is a different question.',
          'None of this requires anyone to behave badly. A company can be entirely well-meaning and still get bought, run out of money, or decide your use case is not worth supporting any more.',
        ],
      },
      {
        heading: 'What local-first actually means',
        paragraphs: [
          'The name is doing a lot of work, so it is worth being precise. Local-first does not mean offline-only, and it does not mean anti-internet. It means the local copy is the real one.',
          'Your machine holds the actual data, not a cached view of data that really lives elsewhere. The software opens and works with no network. If it syncs, syncing is a feature that makes it better, not a requirement that makes it run. And if every server involved vanished overnight, you would still have your files and a program that opens them.',
          'That last one is the test I actually use. Delete the company, and ask what you are left with. If the answer is nothing, it was never your software.',
        ],
      },
      {
        heading: 'What it costs',
        paragraphs: [
          'I would rather be honest about this than sell it, because local-first is genuinely harder in three places.',
          'Syncing between devices is difficult. When a server owns the data it also decides what is true. Without one, two devices can each change the same thing while apart, and something has to work out what happened when they meet. There are good techniques for this now, but it is real work.',
          'Installing is harder than opening a tab. A web app runs anywhere with a browser. Local software has to be built for each operating system, and someone has to be willing to install it.',
          'Some things genuinely need a server. Anything where people collaborate live, or where the heavy computation cannot fit on a laptop, is not a good fit. Pretending otherwise gets you a worse version of a web app.',
          'So the honest position is not that local-first is always right. It is that it is right far more often than it is used, and the reason it is not used more has more to do with business models than with engineering.',
        ],
      },
      {
        heading: 'How this shows up in what I build',
        paragraphs: [
          'Nearly everything I have written follows this rule, and it shapes the architecture rather than sitting on top of it as a feature.',
          'Stack-Sight is a Chrome extension that organises your browsing into stacks and tells you which subscriptions you are paying for and never opening. Working that out requires knowing what you visit, which is about as sensitive as data gets. It never leaves your browser. There is no account, and there is nothing for me to see even if I wanted to.',
          'The Digital Footprint Cleaner helps you find and remove your personal information from public websites. A cloud version of that tool would need you to hand over the exact information you are trying to get rid of, which is a strange thing to ask.',
          'Bruhswer is a hardened browser for Windows that enforces its protections on your machine, with your firewall. A privacy tool that phones home is not a privacy tool.',
          'And the Pulse Engine, which reads markets and news, does its whole analysis on your computer and keeps its history as files on your disk. That was not a philosophical decision at the start so much as a practical one: it meant there was no server to rent and no database to pay for, which is what let it be free and stay free.',
          'That is the pattern I keep finding. The constraint that looks like a limitation is usually the thing that makes the project survivable. Software that needs no money to run does not need to start charging you later.',
        ],
      },
    ],
  },

  // ── II ───────────────────────────────────────────────────────────────────
  {
    slug: 'explainable-market-intelligence',
    title: 'Making a market signal explain itself',
    folio: 'CHRONICLE II',
    numeral: 'II',
    published: '2026-08-28',
    seoTitle: 'Explainable market intelligence: building a signal that shows its working',
    standfirst:
      'The Pulse Engine reads prices and news and prints one number. The number was the easy part. Making it say how it got there took far longer, and that is the part that makes it worth anything.',
    epigraph: 'A reading is worth nothing if it cannot say how it was taken.',
    projects: ['Pulse-Engine_Market_Intelligence_Platform'],
    tags: ['market intelligence', 'explainability', 'Python'],
    sections: [
      {
        heading: null,
        paragraphs: [
          'There is a particular kind of financial tool that shows you a number and expects you to be impressed. It says BUY, or it gives a confidence of 87%, and it does not tell you why. You are supposed to trust it because the interface looks expensive.',
          'I find this genuinely irritating, and not only because it is often wrong. It is because a number you cannot argue with is useless even when it is right. If I cannot see the reasoning, I cannot tell the difference between a good call and a lucky one, and I cannot learn anything from either.',
          'The Pulse Engine is my attempt at the other thing. It still prints one score, from minus ten to plus ten. But every score can be taken apart.',
        ],
      },
      {
        heading: 'Two streams, kept separate on purpose',
        paragraphs: [
          'The system reads two independent things on every cycle.',
          'The first is price. Thirty days of open, high, low, close and volume from Yahoo Finance, which gives the ordinary technical picture: which way the thing is moving, how fast, and whether it looks stretched.',
          'The second is news. Up to three hundred articles from twelve chosen RSS feeds, fetched at the same time rather than one after another.',
          'The important design decision is that these are never quietly blended into one mush. They are measured separately and combined at a step you can look at, because when the two disagree that disagreement is information. Prices rising while coverage turns negative is a different situation from both moving together, and a system that averages them away has thrown out the interesting part.',
        ],
      },
      {
        heading: 'Reading the news without being fooled by it',
        paragraphs: [
          'News is messier than price, in two specific ways.',
          'The same story gets filed by six different outlets. If you count all six you have not found six pieces of evidence, you have found one story shouted six times. The engine compares articles against each other using Jaccard similarity, which is a simple measure of how much two pieces of text overlap, and counts near-identical stories once.',
          'The second problem is that general-purpose sentiment tools do not understand finance. The engine uses VADER, which scores text as positive or negative, but VADER on its own reads a phrase like "bond yields plunge" as bad news because "plunge" is a bad word in ordinary English. In markets it is not necessarily bad at all. So a financial word list is injected into it, teaching it what these words mean in this context.',
          'This is worth stating plainly: this is a word-list approach, not a language model. It is fast, cheap, and you can audit exactly why it scored something the way it did. It will also miss sarcasm and unusual phrasing. That is a real limitation and it is written on the project page rather than hidden.',
        ],
      },
      {
        heading: 'Six components, and why each one is kept visible',
        paragraphs: [
          'The final score is built from six parts: trend direction, price momentum, RSI, news sentiment, trend strength, and the wider market or sector context.',
          'Each asset class weights those six differently, because a commodity and a technology stock do not react to the same signals in the same proportion, and pretending they do is how you get a system that works on one thing and quietly fails on another.',
          'Here is the part that took the longest. Every signal carries a built explanation naming which of the six components moved it and by how much. Not a general description of the method, an explanation of that specific reading on that specific day.',
          'It changes what the tool is for. Instead of "the system says buy", you get "this is positive mainly because trend strength and momentum are high, while sentiment is slightly negative". Now you can disagree with it. You can decide the sentiment reading is more important than the model thinks. The tool has stopped being an oracle and started being a colleague who shows their work.',
          'Eight categories of event are also detected separately, so that something like a central bank decision does not disappear into an average of general news.',
        ],
      },
      {
        heading: 'Letting it be checked',
        paragraphs: [
          'Explaining a single reading is not enough. A system can explain itself clearly and still be wrong every time.',
          'So the engine keeps its history. Snapshots are written to compressed files on disk, kept in full detail for seven days, in reduced form for thirty, and deleted at sixty. A backtester then measures hit rate by signal strength, which answers the question that actually matters: when this thing says strongly positive, what usually happens next?',
          'That number is allowed to be disappointing. The point of building it is that the platform can be checked against its own record rather than believed because of its interface.',
        ],
      },
      {
        heading: 'The constraint that shaped everything',
        paragraphs: [
          'One rule sat underneath all of this: it had to run without paid infrastructure. No server to rent, no database to provision, no API key that costs money.',
          'That constraint explains most of the architecture. The history is files on disk rather than a hosted database, because a database is a subscription and a subscription is a thing that can lapse. Twenty-four assets are rescanned every thirty minutes by a background thread inside the application itself rather than by a scheduling service.',
          'And it is not financial advice. It produces a reading and its reasoning. The decision stays with the person reading it, which is the entire reason the reasoning has to be visible.',
        ],
      },
    ],
  },

  // ── III ──────────────────────────────────────────────────────────────────
  {
    slug: 'transformer-from-scratch',
    title: 'Writing a transformer from scratch',
    folio: 'CHRONICLE III',
    numeral: 'III',
    published: '2026-08-28',
    seoTitle: 'Writing a transformer from scratch: tokenizer, BPE and RoPE, and what I learned',
    standfirst:
      'I built a transformer from nothing, starting at the character tokenizer and working up through BPE and RoPE. Not to produce anything useful, but to find out whether I understood the internals or only the diagrams.',
    epigraph: 'You do not understand a diagram until you have had to make one work.',
    projects: [],
    tags: ['machine learning', 'transformers', 'Python'],
    sections: [
      {
        heading: null,
        paragraphs: [
          'You can read about transformers for a long time and come away feeling like you understand them. There is a diagram everyone uses. There are boxes labelled attention and feed-forward, arrows going up the page, and a caption explaining that the model attends to relevant parts of the input.',
          'I could reproduce that diagram from memory. Then I tried to write one, and found out that I could not.',
          'This is a specific and slightly humiliating experience I would recommend to anyone. There is a gap between being able to describe how something works and being able to make it work, and the only reliable way to find out which side of that gap you are on is to try to build the thing.',
        ],
      },
      {
        heading: 'Starting lower than you want to',
        paragraphs: [
          'The temptation is to start in the middle, at the attention mechanism, because that is the interesting part. I started at the bottom instead, with tokenization, which is the unglamorous business of turning text into numbers.',
          'The simplest version is character-level. Every character gets a number. It is easy to write and easy to reason about, and it teaches you the problem with itself very quickly: your sequences become enormous. A short paragraph becomes hundreds of steps, and since attention cost grows with the square of the sequence length, you feel that immediately.',
          'That is what makes byte pair encoding, or BPE, make sense. BPE looks at your text and finds the pairs of symbols that occur most often, then merges them into single units, over and over. Common words end up as one token. Rare words break into pieces. Nobody chooses the vocabulary by hand; it falls out of the statistics of the text.',
          'Writing that yourself is genuinely clarifying. You stop thinking of tokens as a technicality and start seeing them as a decision that shapes everything above it.',
        ],
      },
      {
        heading: 'The part where position becomes a problem',
        paragraphs: [
          'Here is the thing the diagram does not make obvious. Attention has no idea what order anything is in.',
          'It compares every position to every other position, all at once. That is what makes it fast, because there is no left-to-right loop. It is also why, without help, "the dog bit the man" and "the man bit the dog" look identical to it. The mechanism sees a bag of words.',
          'So position has to be added deliberately. The original approach adds a positional signal to each token before attention runs. It works, but it treats position as something bolted on at the start.',
          'RoPE, rotary position embedding, does something cleverer. Instead of adding position, it rotates the vectors by an angle that depends on where the token sits. When two tokens are then compared, the maths works out so that what matters is the difference between their angles, which is to say the distance between them. Position stops being an absolute stamp and becomes a relative relationship, which is usually what you actually care about. Word five relating to word three matters; whether they are at five and three or at 105 and 103 usually does not.',
          'I could not have explained that before writing it. I had read it. Reading it is not the same.',
        ],
      },
      {
        heading: 'What actually goes wrong',
        paragraphs: [
          'The failures are rarely conceptual. They are shapes.',
          'An enormous amount of the work is keeping track of which dimension is which: batch, sequence position, attention head, feature. Matrices happily multiply in the wrong order and give you a number rather than an error, and the model trains, and the loss goes down a bit, and everything looks fine while being subtly wrong.',
          'The mask is the other classic. When a model is learning to predict the next word, it must not be allowed to see the words after it. Get the mask wrong and the model performs beautifully, because it is reading the answer. It is the same failure I later hit in a completely different project on basketball data, where the model was reading the box score of a game it was meant to be predicting. Different field, identical mistake: the model was given information it would not have at the moment it has to guess.',
          'That pattern is worth internalising. When results look too good, the first suspicion should be that something has leaked, not that you are a genius.',
        ],
      },
      {
        heading: 'Was it worth it',
        paragraphs: [
          'The thing I built is not useful. It is small, it is slow, and anything I might actually want to use is better served by a library written by people with far more time and hardware.',
          'That was never the point. The point was to find out whether I understood this, and the answer turned out to be no, followed by yes.',
          'What changed is not that I memorised more. It is that the words became load-bearing. "Attention" stopped being a box on a diagram and became a specific operation with specific costs and specific ways of going wrong. When I read a paper now, I read it as something someone had to implement.',
          'I would recommend the method for anything you believe you already understand. It is uncomfortable and it is fast, and it tells you the truth.',
        ],
      },
    ],
  },

  // ── IV ───────────────────────────────────────────────────────────────────
  {
    slug: 'neuroevolution',
    title: 'Neuroevolution: networks that grow instead of learn',
    folio: 'CHRONICLE IV',
    numeral: 'IV',
    published: '2026-08-28',
    seoTitle: 'Neuroevolution in Python: evolving a neural network instead of training it',
    standfirst:
      'Almost every neural network is trained by backpropagation. There is another way: let the network mutate its own structure and keep whatever works. Quantum Neural Horror does that, and lets you watch it happen.',
    epigraph: 'No gradient. No teacher. Just mutation and whatever survives.',
    projects: ['Quantum-Neural-Horror'],
    tags: ['neuroevolution', 'machine learning', 'Python'],
    sections: [
      {
        heading: null,
        paragraphs: [
          'When people talk about training a neural network, they nearly always mean one thing. The network makes a guess, you measure how wrong it was, and then you work backwards through the network to find out how each individual number contributed to that error. Then you nudge every number slightly in the direction that would have been less wrong. Repeat a few million times.',
          'That is backpropagation, and it works extraordinarily well. It is why modern machine learning exists.',
          'It also has a requirement that is easy to miss: everything has to be differentiable. You need to be able to calculate, for every part of the network, which direction reduces the error. That constraint quietly decides a lot. It is why network shapes are usually fixed before training starts, and why the menu of activation functions is short.',
          'Neuroevolution throws that requirement away.',
        ],
      },
      {
        heading: 'The other approach',
        paragraphs: [
          'The idea is closer to breeding than to teaching. You make a network. You measure how good it is at the task, which is called its fitness. Then you make changed copies of it, keep the ones that score better, and do it again.',
          'There is no gradient, and nothing works backwards. The network is never told which of its parts was responsible for a mistake. It is only ever told whether the whole thing did better or worse.',
          'That sounds hopelessly inefficient, and for many problems it is. But it buys something significant: because nothing has to be differentiable, anything at all can be changed. Not just the weights, but the shape of the network, how many layers it has, how they connect, and which activation function each part uses. In backpropagation those are decisions a human makes in advance. Here they can evolve.',
          'That is what Quantum Neural Horror does. It mutates its own topology, its activation functions and its weights, all at once, using evolutionary operators and simulated annealing rather than gradients.',
        ],
      },
      {
        heading: 'What simulated annealing is doing here',
        paragraphs: [
          'The name comes from metalwork. You heat metal so its atoms move freely, then cool it slowly so they settle into a strong arrangement. Cool it too fast and it locks into a bad one.',
          'The search does the same thing. Early on it is willing to accept changes that make things worse, which sounds counterproductive and is the entire point. A search that only ever accepts improvements walks uphill until it reaches the top of the nearest small hill and then stops, with no way of knowing there is a mountain behind it. Accepting the occasional bad move is how it gets back down and goes looking.',
          'As the run goes on, that willingness shrinks. The search becomes fussier and settles. Broad exploration early, careful refinement late.',
        ],
      },
      {
        heading: 'Why watching it matters',
        paragraphs: [
          'The project shows fitness and complexity changing live, and this is more than decoration.',
          'Numbers in a log tell you a run went well or badly. Watching it tells you what kind of badly. You see fitness climb quickly and then flatten, and you can see whether the network is still changing shape underneath while the score stands still. You see complexity grow, and you get to ask the useful question: is it getting better because it is getting smarter, or just because it is getting bigger?',
          'That question, whether improvement is real or just extra capacity, is one of the recurring problems in machine learning, and here it is visible rather than inferred.',
        ],
      },
      {
        heading: 'When this is actually the right tool',
        paragraphs: [
          'It would be dishonest to present this as a competitor to gradient descent for ordinary work. If your problem is differentiable and you have data, backpropagation will beat this comfortably, and it will not be close.',
          'Evolution earns its place where gradients are unavailable. When you cannot compute a derivative at all. When the thing you want to optimise is the architecture rather than the weights. When your measure of success is a single score from a simulation with no smooth path back through it.',
          'And it is an unusually good way to learn. Backpropagation hides the search behind calculus, which is efficient and rather opaque. Evolution puts the search in front of you: try things, keep what works, occasionally accept something worse so you do not get stuck. Watching a network rewrite itself makes the whole business of optimisation feel less like magic and more like something you could have thought of.',
        ],
      },
    ],
  },

  // ── V ────────────────────────────────────────────────────────────────────
  {
    slug: 'browser-hardening',
    title: 'Browser hardening, and saying what you cannot enforce',
    folio: 'CHRONICLE V',
    numeral: 'V',
    published: '2026-08-28',
    seoTitle: 'Browser hardening on Windows: fail-closed startup and honest security claims',
    standfirst:
      'Bruhswer is a hardened browser for Windows. The most useful thing in it is not a protection. It is the words NOT ENFORCEABLE, printed whenever it cannot actually do what it claims.',
    epigraph: 'A green tick you have not earned is worse than no tick at all.',
    projects: ['bruhswer-the-homebrew-pseudo-browser', 'Image-Protector'],
    tags: ['security', 'privacy', 'browser hardening'],
    sections: [
      {
        heading: null,
        paragraphs: [
          'Most security software has the same problem, and it is not a technical one. It is that the interface always says yes.',
          'You install the thing. It shows you a list of protections with green ticks beside them. Everything looks handled. What the interface does not tell you is which of those protections is genuinely being enforced right now on your machine, and which one silently failed to apply because a setting was already controlled by something else, or because the process lacked permission, or because your operating system version does that differently.',
          'The green tick is the same either way. That is the actual vulnerability, because a person who believes they are protected behaves differently from a person who knows they are not.',
        ],
      },
      {
        heading: 'The rule',
        paragraphs: [
          'Bruhswer is built around one rule: verify what it can enforce, and say NOT ENFORCEABLE out loud when it cannot.',
          'It sounds like a small thing, and it changes the whole character of the tool. It means the interface is allowed to disappoint you. It means a claim on screen is a statement about the machine you are sitting at, not a description of what the software intended.',
          'It is also harder to build than the alternative, because it is not enough to apply a setting. You have to go back and check that it took effect, and you have to handle the case where it did not, and you have to be willing to report that failure to the user instead of quietly moving on.',
        ],
      },
      {
        heading: 'Fail closed, not open',
        paragraphs: [
          'The same idea runs through startup, where it matters most.',
          'When something goes wrong during setup, software has two options. It can fail open, starting anyway in a reduced state, which is convenient and means the user is now browsing with protections they think are on. Or it can fail closed, refusing to start until it is in the state it promised.',
          'Bruhswer fails closed. If the hardened environment cannot be established, you do not get a degraded browser, you get a refusal and a reason.',
          'This is the correct trade for a security tool and it is worth being clear about why. The cost of failing closed is inconvenience. The cost of failing open is that somebody does something risky in a browser they believed was hardened. Those costs are not comparable, so the choice is not really a balance.',
        ],
      },
      {
        heading: 'What it actually does',
        paragraphs: [
          'Underneath, it is Microsoft Edge, hardened, rather than a browser engine written from scratch. That is deliberate. Writing a browser engine badly is far more dangerous than configuring a well-maintained one carefully, and the rendering engine is exactly the part you do not want a hobbyist inventing.',
          'Network access is restricted by scoping rules through the Windows Firewall, so local network access can be blocked at the operating system rather than requested politely from inside the browser. Downloads go into quarantine instead of straight into your documents, because a download is the most common way something unwanted arrives. Sessions are disposable, so what accumulates during browsing does not persist by default.',
          'And it does not phone home. There is no telemetry. A privacy tool that reports on you is not a privacy tool, no matter how good the reason sounds.',
        ],
      },
      {
        heading: 'The same honesty problem, in a smaller tool',
        paragraphs: [
          'I ran into a version of this again in Image Protector, which adds controlled distortion to images so they read normally to a person and worse to an automated system scraping or analysing them.',
          'The temptation there is to claim it makes images unusable to machine learning. That would be a lie. It makes them harder to use, against some methods, to a degree that depends entirely on what is being run against them. So the project says that instead. It says it obfuscates against automated scraping and basic analysis, and it does not promise to defeat a determined, well-resourced attacker, because it cannot.',
          'This is the discipline the whole area needs and mostly does not have. Security claims are the easiest claims in software to make and among the hardest to verify, which is precisely why the honest version is worth building. A tool that tells you where its protection ends leaves you able to make a decision. A tool that shows you a green tick has made the decision for you, and it has made it on no evidence.',
        ],
      },
    ],
  },

  // ── VI ───────────────────────────────────────────────────────────────────
  {
    slug: 'coding-war-crimes',
    title: 'Coding war crimes: learning from deliberately terrible code',
    folio: 'CHRONICLE VI',
    numeral: 'VI',
    published: '2026-08-28',
    seoTitle: 'Coding war crimes: teaching software engineering with deliberately bad code',
    standfirst:
      'Most advice about writing good code arrives as a rule you are told to follow. This is the opposite: write the terrible version on purpose, measure exactly what it costs, and let the rule be the conclusion instead of the premise.',
    epigraph: 'A rule you have only been told is a rule you will break under pressure.',
    projects: ['coding-war-crimes', 'Uni-basketball-ETL-pipeline'],
    tags: ['software engineering', 'computer science', 'teaching'],
    sections: [
      {
        heading: null,
        paragraphs: [
          'Every programmer has been handed the same list. Do not repeat yourself. Keep functions small. Do not use global variables. Do not nest loops if you can avoid it. Name things properly.',
          'The list is correct. It is also close to useless in the form it is usually given, because it arrives as a set of commandments with no accompanying reason. You memorise it, you follow it while someone is watching, and the first time you are tired and behind schedule you break every rule on it, because a rule you have only been told is not something you believe.',
          'Coding War Crimes is a collection of deliberately terrible code, written on purpose, with the cost of each crime written next to it.',
        ],
      },
      {
        heading: 'Why bad examples teach better',
        paragraphs: [
          'Show someone clean, well-structured code and they will nod. It looks like every other piece of good code they have seen, and it teaches almost nothing, because nothing about it is surprising.',
          'Show someone a function that does the right thing in the worst possible way, and the reaction is different. There is a moment of recognition, usually uncomfortable, because most of us have written something close to it.',
          'That recognition is what makes the lesson stick. You are not learning a rule, you are diagnosing a specific patient. And crucially, you can see what it cost, because each entry carries the complexity analysis alongside it: what happens to this code when the input gets ten times bigger.',
          'That is the difference between "avoid nested loops" as advice and watching a comparison go from a thousand operations to a million because someone added an inner loop that looked harmless. One is a preference. The other is arithmetic.',
        ],
      },
      {
        heading: 'The correct version has to be next to it',
        paragraphs: [
          'This is the part that decides whether a collection like this is educational or just entertainment, and there is plenty of the second kind on the internet.',
          'Each entry carries the correct version beside the terrible one. That turns the anti-pattern into an argument for the rule rather than a list to memorise. You see the bad code, you see what it costs, and you see the alternative and what it costs instead. The rule stops being an instruction from an authority and becomes the obvious conclusion from evidence you just looked at.',
          'It is also a much better format for remembering. "Do not do X" is a floating prohibition. "Do not do X because it turns a linear operation into a quadratic one, here is the version that does not" is a small argument, and arguments survive contact with a deadline better than commandments do.',
        ],
      },
      {
        heading: 'The mistakes that survive experience',
        paragraphs: [
          'The interesting crimes are not the beginner ones. Nobody needs a repository to be told that single-letter variable names are bad.',
          'The interesting ones are the mistakes that look reasonable while you are making them. Code that is correct on your test data and quietly wrong on real data. Optimisations that make the common case faster and the rare case catastrophic. Abstractions added to prevent duplication that never arrived, which now cost more to understand than the duplication would have.',
          'The best example I have of this is not in that repository at all. In a basketball prediction pipeline I built, an early model scored an AUC of 0.9666, which is close to excellent. It was cheating. One of its features held what a team shot during the game, so it was reading the result of the match it claimed to be predicting.',
          'Nothing about that code looked wrong. It was well organised, it ran, it produced a number that suggested it was working better than expected. The mistake was conceptual, and the only reason it was caught is that the number was too good, which is a terrible detection method to have to rely on. Fixing it dropped the score to about 0.74. The pipeline now runs an automatic leakage check before any model sees the data, because the lesson only becomes durable when it turns into something the code enforces.',
        ],
      },
      {
        heading: 'The actual point',
        paragraphs: [
          'What I want from this, and from writing generally, is for the reasoning to be portable.',
          'You cannot memorise enough rules to cover every situation you will meet. But if you understand what a particular mistake costs and why, you can recognise the shape of it somewhere new, in a language you have not used, in a problem nobody wrote a rule for.',
          'That is why the complexity analysis is in there rather than a verdict. A verdict tells you what to do this time. An argument tells you how to think about the next one.',
        ],
      },
    ],
  },
];
