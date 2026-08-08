export interface Social {
  label: string;
  href: string;
}

export type ProjectVisual =
  | "builder" // stacked UI blocks composition
  | "chat" // conversational thread composition
  | "voice" // waveform / call composition
  | "audio" // audio generation composition
  | "reviews"; // rating / response composition

export interface Project {
  slug: string;
  index: string; // "01"
  title: string;
  oneLiner: string;
  category: string;
  year: string;
  role: string;
  stack: string[];
  visual: ProjectVisual;
  /** Accent hue used inside the generated placeholder visual (not the site accent). */
  hue: number;
  caseStudy: {
    statement: string;
    problem: string;
    approach: string;
    build: string[];
    outcome: string;
    metrics: { label: string; value: string }[];
  };
}

export type LabKind = "cursor" | "type" | "waveform" | "vectors" | "latency";

export interface LabExperiment {
  id: string; // "001"
  title: string;
  description: string;
  kind: LabKind;
}

export interface ExperienceEntry {
  year: string;
  label: string;
  role: string;
  org: string;
  details: string[];
  relatedSlug?: string;
}

export interface Skill {
  name: string;
  note: string;
  relatedSlug?: string;
}

export interface SiteData {
  personal: {
    name: string;
    firstName: string;
    role: string;
    identityLine: string[];
    location: string;
    availability: string;
    email: string;
    phone: string;
    heroLines: string[];
    aboutStatement: string[];
    aboutBody: string[];
    metaCards: { label: string; value: string }[];
  };
  socials: Social[];
  projects: Project[];
  labs: LabExperiment[];
  experience: ExperienceEntry[];
  skills: Skill[];
  desk: {
    building: string;
    reading: string;
    listening: string;
    learned: string;
    thought: string;
  };
  manifesto: {
    headline: string[];
    principles: { index: string; text: string }[];
  };
  contact: {
    hook: string[];
    cta: string;
  };
  footer: {
    headline: string[];
  };
}
