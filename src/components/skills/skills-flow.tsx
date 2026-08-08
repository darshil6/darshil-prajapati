"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { site, getProject } from "@/data/site";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";
import Reveal from "@/components/common/reveal";
import { usePointerFine } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";

interface StarDiamondProps {
  className?: string;
}

/** Four-point star separator, drawn inline (no emoji). */
function StarDiamond({ className }: StarDiamondProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 0c1.32 6.36 4.62 9.66 12 12-7.38 2.34-10.68 5.64-12 12-1.32-6.36-4.62-9.66-12-12C7.38 9.66 10.68 6.36 12 0Z" />
    </svg>
  );
}

interface MarqueeRunProps {
  wrap?: boolean;
}

function MarqueeRun({ wrap = false }: MarqueeRunProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center",
        wrap ? "flex-wrap gap-y-4" : "w-max shrink-0"
      )}
    >
      {site.skills.map((s) => (
        <span
          key={s.name}
          className="flex items-center text-[clamp(1.8rem,4vw,3.2rem)] leading-none"
        >
          <span className="whitespace-nowrap px-[0.55em] font-extrabold uppercase tracking-tight text-ink">
            {s.name}
          </span>
          <StarDiamond className="h-[0.4em] w-[0.4em] shrink-0 text-accent" />
        </span>
      ))}
    </div>
  );
}

export default function SkillsFlow() {
  const [pinned, setPinned] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const fine = usePointerFine();
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const staticBand = mounted && !!reduced;

  const open = fine ? (hovered ?? pinned) : pinned;

  const toggle = (i: number) => {
    if (pinned === i) {
      setPinned(null);
      setHovered(null);
    } else {
      setPinned(i);
    }
  };

  return (
    <section
      id="skills"
      className="container-edge relative py-[clamp(6rem,14vh,11rem)]"
    >
      <h2 className="sr-only">Capabilities</h2>

      <div className="flex items-end justify-between gap-6">
        <Reveal as="p" className="text-meta text-muted">
          05 / CAPABILITIES
        </Reveal>
        <Reveal as="p" delay={0.08} className="text-meta-sm text-faint">
          {String(site.skills.length).padStart(2, "0")} DISCIPLINES
        </Reveal>
      </div>

      {/* Full-bleed flowing band */}
      <Reveal
        delay={0.1}
        y={24}
        className="mt-[clamp(2.5rem,6vw,4rem)] -mx-[clamp(1.25rem,4.5vw,4.5rem)]"
      >
        <div
          aria-hidden="true"
          className="group overflow-hidden border-y border-line-soft py-[clamp(1.25rem,3vw,2.25rem)]"
        >
          {staticBand ? (
            <div className="px-[clamp(1.25rem,4.5vw,4.5rem)]">
              <MarqueeRun wrap />
            </div>
          ) : (
            <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
              <MarqueeRun />
              <MarqueeRun />
            </div>
          )}
        </div>
      </Reveal>

      {/* Interactive definition list */}
      <ul className="mt-[clamp(3rem,7vw,5rem)]">
        {site.skills.map((s, i) => {
          const isOpen = open === i;
          const related = s.relatedSlug ? getProject(s.relatedSlug) : undefined;
          return (
            <li
              key={s.name}
              className={cn(
                "border-b border-line-soft",
                i === 0 && "border-t"
              )}
              onMouseEnter={fine ? () => setHovered(i) : undefined}
              onMouseLeave={fine ? () => setHovered(null) : undefined}
            >
              <Reveal y={18} delay={Math.min(i * 0.04, 0.32)}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`skill-note-${i}`}
                  onClick={() => toggle(i)}
                  className="group/skill flex min-h-[44px] w-full items-center justify-between gap-6 py-4 text-left md:py-5"
                >
                  <span className="flex items-baseline gap-4 md:gap-6">
                    <span className="text-meta-sm text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-xl font-bold uppercase tracking-tight transition-[color,transform] duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover/skill:translate-x-2 group-hover/skill:text-accent group-focus-visible/skill:translate-x-2 md:text-2xl",
                        isOpen ? "text-accent" : "text-ink"
                      )}
                    >
                      {s.name}
                    </span>
                  </span>
                  <Plus
                    aria-hidden="true"
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)]",
                      isOpen ? "rotate-45 text-accent" : "text-muted"
                    )}
                  />
                </button>
                <motion.div
                  id={`skill-note-${i}`}
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.55, ease: [...EASE_OUT_EXPO] }}
                  aria-hidden={!isOpen}
                  className="overflow-hidden"
                >
                  <div className="max-w-xl pb-6 md:pl-10">
                    <p className="leading-relaxed text-muted">{s.note}</p>
                    {related && (
                      <Link
                        href={`/work/${related.slug}`}
                        tabIndex={isOpen ? undefined : -1}
                        data-cursor="link"
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
                  </div>
                </motion.div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
