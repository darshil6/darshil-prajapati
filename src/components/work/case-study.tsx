"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/common/reveal";
import ProjectVisual from "@/components/work/project-visual";
import { site } from "@/data/site";
import type { Project } from "@/data/types";
import { EASE_OUT_EXPO, cn } from "@/lib/utils";

interface CaseStudyProps {
  project: Project;
  next: Project;
}

interface ParallaxVisualProps {
  project: Project;
  className: string;
}

/** ProjectVisual with a subtle scroll-linked settle (scale 1.04 → 1). */
function ParallaxVisual({ project, className }: ParallaxVisualProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.55], [1.04, 1]);

  return (
    <div ref={ref} data-cursor="zoom">
      <motion.div
        style={{ scale: reduced ? 1 : scale }}
        className="will-change-transform"
      >
        <ProjectVisual
          visual={project.visual}
          hue={project.hue}
          title={project.title}
          className={className}
        />
      </motion.div>
    </div>
  );
}

interface ChapterProps {
  index: string;
  label: string;
  children: React.ReactNode;
}

/** Two-column editorial chapter: sticky mono label + giant outlined index. */
function Chapter({ index, label, children }: ChapterProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-32">
          <Reveal>
            <h2 className="text-meta text-muted">{label}</h2>
            <span
              aria-hidden
              className="text-stroke mt-3 block font-extrabold leading-none tracking-tight text-[clamp(3.5rem,9vw,7.5rem)]"
            >
              {index}.
            </span>
          </Reveal>
        </div>
      </div>
      <div className="lg:col-span-8">{children}</div>
    </section>
  );
}

export default function CaseStudy({ project, next }: CaseStudyProps) {
  const { caseStudy } = project;
  const copyrightYear =
    site.experience[site.experience.length - 1]?.year ?? project.year;

  const meta = [
    { label: "YEAR", value: project.year },
    { label: "ROLE", value: project.role },
    { label: "DISCIPLINE", value: project.category },
    { label: "TOOLS", value: project.stack.join(", ") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [...EASE_OUT_EXPO] }}
    >
      {/* ---- Header ---- */}
      <header className="container-edge pt-32 lg:pt-40">
        <div className="flex items-baseline justify-between gap-4">
          <Link
            href="/#work"
            className="text-meta link-underline text-muted transition-colors hover:text-ink"
          >
            ← ALL WORK
          </Link>
          <p className="text-meta text-faint">
            CASE {project.index} /{" "}
            {String(site.projects.length).padStart(2, "0")}
          </p>
        </div>

        <h1 className="mt-10 break-words font-extrabold uppercase leading-[0.95] tracking-tight text-[clamp(2rem,8vw,7rem)]">
          {project.title}
        </h1>

        <p className="font-serif mt-7 max-w-2xl text-2xl italic font-normal leading-snug text-muted md:text-3xl">
          {caseStudy.statement}
        </p>

        <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-7 border-y border-line py-7 md:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="text-meta-sm text-faint">{m.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {/* ---- Hero visual ---- */}
      <section
        aria-label="Project visual"
        className="container-edge mt-14 md:mt-20"
      >
        <Reveal y={36}>
          <ParallaxVisual project={project} className="aspect-[16/9]" />
        </Reveal>
      </section>

      {/* ---- Story chapters ---- */}
      <div className="container-edge mt-[clamp(5rem,12vh,9rem)] space-y-[clamp(5rem,12vh,8.5rem)]">
        <Chapter index="A" label="THE PROBLEM">
          <Reveal delay={0.08}>
            <p className="max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              {caseStudy.problem}
            </p>
          </Reveal>
        </Chapter>

        <Chapter index="B" label="THE APPROACH">
          <Reveal delay={0.08}>
            <p className="max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              {caseStudy.approach}
            </p>
          </Reveal>
        </Chapter>

        <Chapter index="C" label="THE BUILD">
          <ol className="max-w-2xl">
            {caseStudy.build.map((step, i) => (
              <Reveal
                key={i}
                as="li"
                delay={i * 0.07}
                className={cn(
                  "flex gap-6 border-b border-line-soft py-6",
                  i === 0 && "pt-0",
                )}
              >
                <span className="text-meta pt-1 text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-relaxed text-muted md:text-lg">
                  {step}
                </p>
              </Reveal>
            ))}
          </ol>
        </Chapter>

        <Chapter index="D" label="THE OUTCOME">
          <Reveal delay={0.08}>
            <p className="max-w-2xl text-base leading-relaxed text-ink/90 md:text-lg">
              {caseStudy.outcome}
            </p>
          </Reveal>
        </Chapter>
      </div>

      {/* ---- Metrics ---- */}
      <section
        aria-label="Project metrics"
        className="container-edge mt-[clamp(5rem,12vh,9rem)]"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {caseStudy.metrics.map((metric, i) => (
            <Reveal key={metric.label} delay={i * 0.08}>
              <div className="border border-line p-6">
                <p className="font-extrabold tracking-tight text-[clamp(1.6rem,3vw,2.4rem)]">
                  {metric.value}
                </p>
                <p className="text-meta-sm mt-2 text-muted">{metric.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- Closing visual ---- */}
      <section
        aria-label="Project visual, detail"
        className="container-edge mt-[clamp(4rem,10vh,7rem)] pb-[clamp(5rem,12vh,9rem)]"
      >
        <Reveal y={36}>
          <ParallaxVisual project={project} className="aspect-[16/10]" />
        </Reveal>
      </section>

      {/* ---- Next project ---- */}
      <Reveal y={20}>
        <Link
          href={`/work/${next.slug}`}
          data-cursor="view"
          data-cursor-label="NEXT →"
          className="group block border-t border-line"
        >
          <div className="container-edge py-[clamp(4rem,12vh,8rem)]">
            <p className="text-meta text-muted transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent">
              NEXT PROJECT
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="block break-words font-extrabold uppercase leading-[0.95] tracking-tight text-[clamp(2rem,7vw,6rem)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-focus-visible:translate-x-3">
                {next.title}
              </span>
              <ArrowRight
                aria-hidden
                className="h-8 w-8 -translate-x-4 text-accent opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:h-12 md:w-12"
              />
            </div>
          </div>
        </Link>
      </Reveal>

      <div className="container-edge flex justify-center border-t border-line-soft py-10">
        <Link
          href="/#work"
          className="text-meta link-underline text-muted transition-colors hover:text-ink"
        >
          BACK TO ALL WORK
        </Link>
      </div>

      {/* ---- Minimal footer strip ---- */}
      <footer className="container-edge flex flex-wrap items-center justify-between gap-4 border-t border-line-soft py-6">
        <p className="text-meta-sm text-faint">
          © {copyrightYear} {site.personal.name}
        </p>
        <a
          href={`mailto:${site.personal.email}`}
          className="text-meta-sm link-underline text-muted transition-colors hover:text-ink"
        >
          {site.personal.email}
        </a>
      </footer>
    </motion.div>
  );
}
