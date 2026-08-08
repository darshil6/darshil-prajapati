import type { SiteData } from "./types";

/**
 * ─────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH
 * Every piece of content on the site lives here.
 * Replace names, links, projects and copy in this
 * one file — no component hardcodes content.
 * ─────────────────────────────────────────────
 */

export const site: SiteData = {
  personal: {
    name: "Darshil Prajapati",
    firstName: "Darshil",
    role: "Full Stack AI Engineer",
    identityLine: [
      "AI Engineer",
      "Full-Stack Developer",
      "Creative Technologist",
    ],
    location: "Ahmedabad, India",
    availability: "Open to interesting work",
    email: "prajapatidarshil85@gmail.com",
    phone: "+91 63591 58857",
    heroLines: ["I BUILD", "SYSTEMS THAT", "LISTEN & THINK."],
    aboutStatement: [
      "I'M INTERESTED IN",
      "THE SPACE BETWEEN",
      "LANGUAGE,",
      "INTERFACES",
      "AND MACHINES.",
    ],
    aboutBody: [
      "I build intelligent systems end to end — chatbots that actually remember, voice agents that pick up the phone, and builder tools that generate real content instead of lorem ipsum.",
      "Most of my work lives where retrieval, speech and automation meet: RAG pipelines on vector search, speech-to-speech loops tuned for low latency, and backends that stay calm under all of it. I like turning complicated ideas into interfaces that feel obvious.",
    ],
    metaCards: [
      { label: "Currently", value: "Building AI systems" },
      { label: "Focus", value: "LLMs / RAG / Voice" },
      { label: "Location", value: "Ahmedabad, India" },
      { label: "Status", value: "Open to interesting work" },
    ],
  },

  socials: [
    { label: "Email", href: "mailto:prajapatidarshil85@gmail.com" },
    // TODO: replace with your real profile URLs
    { label: "LinkedIn", href: "https://www.linkedin.com/in/prajapatidarshil" },
    { label: "GitHub", href: "https://github.com/darshil6" },
  ],

  projects: [
    {
      slug: "builder-suite",
      index: "01",
      title: "AI Builder Suite",
      oneLiner:
        "Email, survey and form builders that generate real, usable content on demand.",
      category: "AI Product Engineering",
      year: "2025",
      role: "Full Stack AI Engineer",
      stack: ["LangChain", "LangGraph", "React", "Node.js", "MongoDB"],
      visual: "builder",
      hue: 76,
      caseStudy: {
        statement:
          "A family of builder modules where AI drafts the content and humans stay in control.",
        problem:
          "Builder tools usually hand you an empty canvas. Users stare at blank email templates, surveys and forms, and most give up before writing a first question. The content — not the layout — is the hard part.",
        approach:
          "Treat generation as a graph, not a single prompt. Each builder (email, survey, form) runs a LangGraph flow that plans structure first, then fills sections with context-aware content, then exposes every piece as an editable block. The AI proposes; the user disposes.",
        build: [
          "Designed LangGraph flows that decompose a brief into structure → sections → copy, with retries and validation at each node.",
          "Built customizable input schemas so generated surveys and forms map onto real field types, logic and validation instead of plain text.",
          "Shipped the editing surface in React with optimistic updates, and persisted builder state in MongoDB via a Node.js service layer.",
          "Kept generation latency acceptable by streaming section-level results instead of waiting for whole documents.",
        ],
        outcome:
          "Blank-canvas paralysis is gone: users start from a complete, structured draft and edit down instead of writing up. The same graph architecture now powers three builder modules from one codebase.",
        metrics: [
          { label: "Builder modules", value: "03" },
          { label: "Generation", value: "Streamed" },
          { label: "Architecture", value: "LangGraph" },
        ],
      },
    },
    {
      slug: "conversational-os",
      index: "02",
      title: "Conversational OS",
      oneLiner:
        "A multi-template chatbot system with retrieval, memory and tools — support agent one day, workflow assistant the next.",
      category: "Applied AI / RAG",
      year: "2025",
      role: "Full Stack AI Engineer",
      stack: ["RAG", "Qdrant", "LangChain", "Node.js", "React"],
      visual: "chat",
      hue: 160,
      caseStudy: {
        statement:
          "One chatbot engine, many personalities — grounded in a knowledge base instead of vibes.",
        problem:
          "Every team wanted a different bot: customer support here, an internal workflow assistant there. Building each one from scratch meant duplicated retrieval code, inconsistent memory handling, and answers that drifted from the actual documentation.",
        approach:
          "Build the engine once, template the personality. A single RAG framework handles retrieval, contextual memory and tool calls; templates define tone, scope and which tools a bot may reach for. New use cases become configuration, not code.",
        build: [
          "Architected retrieval services on Qdrant vector search so bots query the knowledge base on the fly with low latency.",
          "Implemented contextual memory so conversations survive topic changes without re-explaining everything.",
          "Added a tooling layer that lets bots take actions — look up records, trigger workflows — instead of only answering.",
          "Exposed the whole system through a Node.js API with a React chat surface, deployed across multiple client use cases.",
        ],
        outcome:
          "Spinning up a new grounded chatbot went from a project to a configuration task. Support and workflow-assistant templates run on the same engine, querying the same retrieval layer.",
        metrics: [
          { label: "Templates", value: "Multi" },
          { label: "Retrieval", value: "Qdrant" },
          { label: "Memory", value: "Contextual" },
        ],
      },
    },
    {
      slug: "voice-engine",
      index: "03",
      title: "Voice Engine",
      oneLiner:
        "A voice AI that answers calls, routes them, books appointments and talks to the knowledge base — in real time.",
      category: "Voice Intelligence",
      year: "2025",
      role: "Full Stack AI Engineer",
      stack: [
        "OpenAI Realtime API",
        "ElevenLabs",
        "Qdrant",
        "Node.js",
        "MongoDB",
      ],
      visual: "voice",
      hue: 20,
      caseStudy: {
        statement:
          "A phone call is the least forgiving interface there is — silence is failure.",
        problem:
          "Businesses miss calls, and callers hate hold music and phone trees. A voice agent has to understand speech, decide, and respond fast enough that the pause feels human — while actually doing things: routing, booking, answering from real data.",
        approach:
          "Engineer the pipeline around latency budgets. Speech-to-text, reasoning and text-to-speech each get a budget; anything that can stream, streams. The agent connects to the same vector-search knowledge base as the chatbots, so voice and chat never disagree.",
        build: [
          "Built speech-to-text → LLM → text-to-speech pipelines on the OpenAI Realtime API and ElevenLabs for low-latency conversation.",
          "Implemented call handling: routing to humans and departments, plus appointment booking against real calendars.",
          "Wired retrieval into the loop so the agent answers from the knowledge base mid-call via Qdrant.",
          "Kept the backend on Node.js and MongoDB with an architecture that scales per-call without warm-up penalties.",
        ],
        outcome:
          "Calls get answered every time. The agent routes, books appointments and answers domain questions with response gaps short enough that conversations feel natural rather than transactional.",
        metrics: [
          { label: "Pipeline", value: "STT→LLM→TTS" },
          { label: "Latency", value: "Low" },
          { label: "Booking", value: "Automated" },
        ],
      },
    },
    {
      slug: "voice-studio",
      index: "04",
      title: "Voice Studio",
      oneLiner:
        "An AI voice generator that turns scripts into narrations and voice-overs automatically.",
      category: "Generative Audio",
      year: "2025",
      role: "Full Stack AI Engineer",
      stack: ["ElevenLabs", "Node.js", "React", "MongoDB"],
      visual: "audio",
      hue: 265,
      caseStudy: {
        statement:
          "Voice-over used to mean a studio, a microphone and a week. Now it means a paragraph and a button.",
        problem:
          "Teams needed narrations and voice-overs for content constantly — product walkthroughs, marketing, tutorials — and recording them manually made audio the slowest asset in every pipeline.",
        approach:
          "Make speech generation a module, not a chore. A clean interface over generative voice: paste or generate a script, pick a voice, get production-ready audio — with the boring parts (chunking, retries, storage) handled invisibly.",
        build: [
          "Built the generation module on ElevenLabs with script chunking so long narrations render reliably.",
          "Designed a React interface for script editing, voice selection and instant preview.",
          "Handled audio storage and delivery through the Node.js backend with MongoDB tracking each generation.",
        ],
        outcome:
          "Audio stopped being a bottleneck. Narrations that took days of coordination now render in minutes, consistently, in the same voice.",
        metrics: [
          { label: "Turnaround", value: "Minutes" },
          { label: "Output", value: "Narration / VO" },
          { label: "Engine", value: "ElevenLabs" },
        ],
      },
    },
    {
      slug: "reputation-engine",
      index: "05",
      title: "Reputation Engine",
      oneLiner:
        "AI-written responses to Google Business reviews — on-brand, flexible and fast.",
      category: "AI Automation",
      year: "2025",
      role: "Full Stack AI Engineer",
      stack: ["Google Business Profile", "LLM", "Node.js", "React"],
      visual: "reviews",
      hue: 205,
      caseStudy: {
        statement:
          "Every unanswered review is a public conversation a business is losing.",
        problem:
          "Businesses know they should respond to every Google review — grateful for the good ones, careful with the bad ones — but at volume it's the first task that gets dropped, and generic copy-paste replies read worse than silence.",
        approach:
          "Generate responses that sound like the business, not like a bot. The system reads the review's sentiment and content, drafts a response in a configurable voice, and keeps a human approve-or-edit step where it matters.",
        build: [
          "Integrated the Google Business Profile API to pull reviews and publish responses in place.",
          "Built flexible response generation — tone, length and policy are configuration, so one engine serves many businesses.",
          "Shipped the review dashboard in React on a Node.js backend for triage, editing and one-click publishing.",
        ],
        outcome:
          "Response coverage went from sporadic to systematic. Businesses answer every review in their own voice, and negative reviews get careful, de-escalating replies instead of silence.",
        metrics: [
          { label: "Coverage", value: "Every review" },
          { label: "Voice", value: "Configurable" },
          { label: "Publishing", value: "One-click" },
        ],
      },
    },
  ],

  labs: [
    {
      id: "001",
      title: "Cursor Field",
      description: "A particle field that leans toward the cursor.",
      kind: "cursor",
    },
    {
      id: "002",
      title: "Generative Type",
      description: "Glyphs that scramble and settle like a decoder.",
      kind: "type",
    },
    {
      id: "003",
      title: "Waveform Study",
      description: "Synthetic speech, drawn instead of heard.",
      kind: "waveform",
    },
    {
      id: "004",
      title: "Vector Space",
      description: "Nearest neighbours in a tiny embedding universe.",
      kind: "vectors",
    },
    {
      id: "005",
      title: "Latency Race",
      description: "STT → LLM → TTS, visualised as a race against silence.",
      kind: "latency",
    },
  ],

  experience: [
    {
      year: "2021",
      label: "Started",
      role: "B.E. Information Technology",
      org: "Government Engineering College, Modasa",
      details: [
        "Began engineering at GEC Modasa.",
        "First lines of Python; first broken servers.",
      ],
    },
    {
      year: "2024",
      label: "Deep dive",
      role: "Independent work",
      org: "Self-directed",
      details: [
        "Went deep on LLMs — RAG prototypes, LangChain experiments, early voice pipelines.",
        "Learned that latency is a feature.",
      ],
    },
    {
      year: "2025",
      label: "Graduated / Shipped",
      role: "Full Stack AI Engineer",
      org: "La Net Team Software Solutions, Surat",
      details: [
        "Graduated B.E. IT (CGPA 7.33).",
        "Joined La Net Team — shipped AI builder modules, the RAG chatbot engine and the voice AI system.",
      ],
      relatedSlug: "voice-engine",
    },
    {
      year: "2026",
      label: "Current",
      role: "Full Stack AI Engineer",
      org: "La Net Team Software Solutions",
      details: [
        "Scaling voice and retrieval systems in production.",
        "Open to selected collaborations.",
      ],
      relatedSlug: "conversational-os",
    },
  ],

  skills: [
    {
      name: "AI Engineering",
      note: "LLM apps end to end — prompts are the easy part.",
      relatedSlug: "builder-suite",
    },
    {
      name: "RAG Systems",
      note: "Retrieval pipelines that answer from your data, not the internet.",
      relatedSlug: "conversational-os",
    },
    {
      name: "Voice Interfaces",
      note: "Speech-to-speech loops where silence is the enemy.",
      relatedSlug: "voice-engine",
    },
    {
      name: "LangChain / LangGraph",
      note: "Agent graphs with retries, tools and checkpoints.",
      relatedSlug: "builder-suite",
    },
    {
      name: "Vector Search",
      note: "Qdrant in production — indexing, filtering, tuning recall.",
      relatedSlug: "conversational-os",
    },
    {
      name: "Node.js",
      note: "The backbone of every backend I ship.",
    },
    {
      name: "React",
      note: "Interfaces that stay out of the way.",
    },
    {
      name: "Python / ML",
      note: "Where the modelling and the glue code live.",
    },
    {
      name: "MongoDB / SQL",
      note: "State has to live somewhere honest.",
    },
  ],

  desk: {
    building: "An agentic voice pipeline that books real appointments",
    reading: "Designing Machine Learning Systems — Chip Huyen",
    listening: "Instrumental focus playlists, mostly on repeat",
    learned: "LangGraph checkpointing — resumable agent state",
    thought: "The best AI interface is the one that feels like a good listener.",
  },

  manifesto: {
    headline: ["GOOD SYSTEMS", "SHOULD FEEL", "OBVIOUS AFTER", "THEY SHIP."],
    principles: [
      { index: "01", text: "Remove what doesn't matter." },
      { index: "02", text: "Latency is a design decision." },
      { index: "03", text: "Build for people, not demos." },
      {
        index: "04",
        text: "Technology should disappear into the experience.",
      },
    ],
  },

  contact: {
    hook: ["HAVE A GOOD", "IDEA?"],
    cta: "Start a conversation",
  },

  footer: {
    headline: ["LET'S MAKE", "SOMETHING", "WORTH", "REMEMBERING."],
  },
};

export const getProject = (slug: string) =>
  site.projects.find((p) => p.slug === slug);

export const getNextProject = (slug: string) => {
  const i = site.projects.findIndex((p) => p.slug === slug);
  if (i === -1) return undefined;
  return site.projects[(i + 1) % site.projects.length];
};
