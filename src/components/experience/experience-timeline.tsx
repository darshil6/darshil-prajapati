"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { site, getProject } from "@/data/site";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";
import Reveal from "@/components/common/reveal";

export default function ExperienceTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(site.experience.length - 1);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const entry = site.experience[active];
  const activeRelated = entry?.relatedSlug
    ? getProject(entry.relatedSlug)
    : undefined;

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="container-edge relative py-[clamp(6rem,14vh,11rem)]"
    >
      <h2 className="sr-only">Timeline</h2>

      <div className="flex items-end justify-between gap-6">
        <Reveal as="p" className="text-meta text-muted">
          06 / TIMELINE
        </Reveal>
        <Reveal as="p" delay={0.08} className="text-meta-sm text-faint">
          {site.experience[0]?.year} —{" "}
          {site.experience[site.experience.length - 1]?.year}
        </Reveal>
      </div>

      {/* Desktop: horizontal editorial band */}
      <div className="mt-[clamp(2.5rem,6vw,4rem)] hidden lg:block">
        <Reveal y={30}>
          <motion.div
            style={reduced ? undefined : { x }}
            className="flex items-end justify-between gap-8 border-y border-line-soft py-[clamp(2rem,4vw,3rem)]"
          >
            {site.experience.map((e, i) => {
              const isActive = i === active;
              return (
                <button
                  key={e.year}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(i)}
                  data-cursor="link"
                  className="group min-h-[44px] text-left"
                >
                  <span
                    className={cn(
                      "relative block font-extrabold tracking-tight leading-[0.95] text-[clamp(2.6rem,6vw,4.6rem)] transition-colors duration-500 [transition-timing-function:var(--ease-out-expo)]",
                      isActive
                        ? "text-ink"
                        : "text-ink/40 group-hover:text-ink/70"
                    )}
                  >
                    {e.year}
                    {isActive && (
                      <motion.span
                        layoutId="year-rule"
                        transition={{
                          duration: 0.6,
                          ease: [...EASE_OUT_EXPO],
                        }}
                        className="absolute -bottom-2 left-0 right-0 h-[2px] bg-accent"
                      />
                    )}
                  </span>
                  <span
                    className={cn(
                      "mt-4 block text-meta transition-colors duration-500",
                      isActive
                        ? "text-accent"
                        : "text-muted group-hover:text-ink"
                    )}
                  >
                    {e.label}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </Reveal>

        <div aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {entry && (
              <motion.div
                key={entry.year}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.55, ease: [...EASE_OUT_EXPO] }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-12 gap-8 pt-[clamp(2rem,4vw,3rem)]">
                  <div className="col-span-5 xl:col-span-4">
                    <p className="text-meta-sm text-faint">
                      {entry.year} — {entry.label}
                    </p>
                    <h3 className="mt-3 text-xl font-bold tracking-tight text-ink xl:text-2xl">
                      {entry.role}
                    </h3>
                    <p className="mt-1 font-bold text-ink/70">{entry.org}</p>
                  </div>
                  <div className="col-span-7 max-w-2xl xl:col-span-8">
                    <div className="space-y-2">
                      {entry.details.map((d) => (
                        <p key={d} className="leading-relaxed text-muted">
                          {d}
                        </p>
                      ))}
                    </div>
                    {activeRelated && (
                      <Link
                        href={`/work/${activeRelated.slug}`}
                        data-cursor="link"
                        className="link-underline mt-5 inline-flex items-center gap-1.5 text-meta text-ink transition-colors duration-300 hover:text-accent"
                      >
                        Related: {activeRelated.title}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-3 w-3"
                          strokeWidth={1.5}
                        />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile: vertical stack, everything visible */}
      <div className="mt-[clamp(2.5rem,6vw,4rem)] lg:hidden">
        {site.experience.map((e, i) => {
          const related = e.relatedSlug ? getProject(e.relatedSlug) : undefined;
          return (
            <Reveal
              key={e.year}
              y={24}
              delay={0.05}
              className={cn(
                "border-b border-line-soft py-8",
                i === 0 && "border-t"
              )}
            >
              <p className="font-extrabold tracking-tight leading-none text-[clamp(2.4rem,9vw,3.4rem)] text-ink">
                {e.year}
              </p>
              <p className="mt-2 text-meta text-muted">{e.label}</p>
              <h3 className="mt-4 font-bold text-ink">{e.role}</h3>
              <p className="font-bold text-ink/70">{e.org}</p>
              <div className="mt-3 space-y-2">
                {e.details.map((d) => (
                  <p key={d} className="leading-relaxed text-muted">
                    {d}
                  </p>
                ))}
              </div>
              {related && (
                <Link
                  href={`/work/${related.slug}`}
                  className="link-underline mt-4 inline-flex items-center gap-1.5 text-meta text-ink transition-colors duration-300 hover:text-accent"
                >
                  Related: {related.title}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-3 w-3"
                    strokeWidth={1.5}
                  />
                </Link>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
