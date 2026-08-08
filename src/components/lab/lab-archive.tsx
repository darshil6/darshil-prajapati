"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { site } from "@/data/site";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";
import { useMediaQuery, usePointerFine } from "@/hooks/use-media-query";
import Reveal from "@/components/common/reveal";
import { LabPreview } from "@/components/lab/lab-previews";

export default function LabArchive() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const pointerFine = usePointerFine();
  const isLg = useMediaQuery("(min-width: 1024px)");
  const desktop = pointerFine && isLg;
  const activeLab = site.labs.find((l) => l.id === activeId);

  return (
    <section
      id="lab"
      className="container-edge relative py-[clamp(6rem,14vh,11rem)]"
    >
      <Reveal>
        <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
          <h2 className="text-meta text-muted">03 / LAB — EXPERIMENTS</h2>
          <p className="text-meta text-faint">
            <span className="hidden lg:pointer-fine:inline">HOVER TO RUN</span>
            <span className="lg:pointer-fine:hidden">TAP TO RUN</span>
          </p>
        </div>
      </Reveal>

      <div
        className={cn(
          desktop &&
            "lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-16"
        )}
      >
        <ul
          onMouseLeave={desktop ? () => setActiveId(null) : undefined}
          onBlur={
            desktop
              ? (e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null))
                    setActiveId(null);
                }
              : undefined
          }
        >
          {site.labs.map((lab, i) => {
            const isActive = activeId === lab.id;
            return (
              <Reveal
                as="li"
                key={lab.id}
                delay={i * 0.06}
                className="border-b border-line-soft"
              >
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={
                    desktop ? "lab-live-panel" : `lab-inline-${lab.id}`
                  }
                  data-cursor="view"
                  data-cursor-label="RUN"
                  onMouseEnter={
                    desktop ? () => setActiveId(lab.id) : undefined
                  }
                  onFocus={desktop ? () => setActiveId(lab.id) : undefined}
                  onClick={() =>
                    setActiveId(desktop ? lab.id : isActive ? null : lab.id)
                  }
                  className="group grid w-full grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-x-4 py-5 text-left md:grid-cols-[4.5rem_minmax(0,1fr)_15rem_auto] md:gap-x-8 md:py-6"
                >
                  <span
                    className={cn(
                      "text-meta-sm transition-colors duration-300",
                      isActive ? "text-accent" : "text-faint"
                    )}
                  >
                    LAB {lab.id}
                  </span>
                  <span
                    className={cn(
                      "text-[clamp(1.4rem,3.2vw,2.4rem)] font-bold uppercase leading-[1.05] tracking-tight transition-[transform,color] duration-500 [transition-timing-function:var(--ease-out-expo)]",
                      isActive
                        ? "translate-x-1.5 text-ink"
                        : "text-ink/85 group-hover:text-ink"
                    )}
                  >
                    {lab.title}
                  </span>
                  <span className="hidden text-sm leading-snug text-muted md:block">
                    {lab.description}
                  </span>
                  <span className="flex items-center gap-2 justify-self-end">
                    <span
                      className={cn(
                        "text-meta-sm transition-colors duration-300",
                        isActive ? "text-accent" : "text-faint"
                      )}
                    >
                      RUN
                    </span>
                    <Plus
                      aria-hidden="true"
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)]",
                        isActive ? "rotate-45 text-accent" : "text-faint"
                      )}
                    />
                  </span>
                </button>

                {!desktop && (
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        id={`lab-inline-${lab.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.6,
                          ease: [...EASE_OUT_EXPO],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="plate-dark relative mb-5 aspect-video overflow-hidden border border-line bg-surface">
                          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-3 pt-2.5">
                            <span className="text-meta-sm text-muted">
                              LAB {lab.id} / LIVE
                            </span>
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot"
                            />
                          </div>
                          <LabPreview kind={lab.kind} active />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </Reveal>
            );
          })}
        </ul>

        {desktop && (
          <Reveal delay={0.15} className="relative hidden lg:block">
            <div
              id="lab-live-panel"
              className="plate-dark sticky top-[clamp(5rem,16vh,9rem)] mt-10 h-[260px] w-full max-w-[380px] overflow-hidden border border-line bg-surface"
            >
              <AnimatePresence>
                {activeLab ? (
                  <motion.div
                    key={activeLab.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [...EASE_OUT_EXPO] }}
                  >
                    <LabPreview kind={activeLab.kind} active />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 pt-2.5">
                      <span className="text-meta-sm text-muted">
                        LAB {activeLab.id} / LIVE
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [...EASE_OUT_EXPO] }}
                  >
                    <span className="text-meta-sm text-faint">
                      IDLE — HOVER TO RUN
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
