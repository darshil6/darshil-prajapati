"use client";

import { useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/common/reveal";
import { site } from "@/data/site";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";
import { useMediaQuery, usePointerFine } from "@/hooks/use-media-query";

/** Deterministic pseudo-random — never Math.random in render. */
const pr = (i: number, s = 1) => {
  const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/* ── Tiny geometric glyphs — thin ink strokes, one accent detail ── */

function CubeGlyph() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true">
      <path d="M9 1 L2 5 V14 L9 18 L16 14 V5 Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <path d="M2 5 L9 9 L16 5 M9 9 V18" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <path d="M9 1 L16 5" style={{ stroke: "var(--color-accent)" }} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function BookGlyph() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
      <path
        d="M10 3 C8 1.6 5 1.4 1.5 2.2 V11 C5 10.2 8 10.4 10 11.8 C12 10.4 15 10.2 18.5 11 V2.2 C15 1.4 12 1.6 10 3 Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M10 3 V11.8" stroke="currentColor" strokeWidth="1" />
      <path d="M12.5 5.2 C14 4.7 15.3 4.6 16.3 4.8" style={{ stroke: "var(--color-accent)" }} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function WaveGlyph() {
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
      <path
        d="M1 5.5 V8.5 M4 3.5 V10.5 M10 4.5 V9.5 M13 2.5 V11.5 M16 5 V9 M19 6 V8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M7 1 V13" style={{ stroke: "var(--color-accent)" }} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function SparkGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1 C8.6 4.9 11.1 7.4 15 8 C11.1 8.6 8.6 11.1 8 15 C7.4 11.1 4.9 8.6 1 8 C4.9 7.4 7.4 4.9 8 1 Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M12.9 1.6 V3.8 M11.8 2.7 H14" style={{ stroke: "var(--color-accent)" }} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function AsteriskGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5 V14.5 M2.4 4.75 L13.6 11.25 M13.6 4.75 L2.4 11.25"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="1.3" style={{ fill: "var(--color-accent)" }} />
    </svg>
  );
}

/* ── Desk objects ── */

interface DeskObject {
  key: string;
  label: string;
  body: string;
  serif?: boolean;
  glyph: ReactNode;
  pos: { left: string; top: string };
}

const OBJECTS: DeskObject[] = [
  {
    key: "building",
    label: "BUILDING",
    body: site.desk.building,
    glyph: <CubeGlyph />,
    pos: { left: "2%", top: "5%" },
  },
  {
    key: "reading",
    label: "READING",
    body: site.desk.reading,
    glyph: <BookGlyph />,
    pos: { left: "58%", top: "2%" },
  },
  {
    key: "listening",
    label: "LISTENING",
    body: site.desk.listening,
    glyph: <WaveGlyph />,
    pos: { left: "30%", top: "36%" },
  },
  {
    key: "learned",
    label: "RECENTLY LEARNED",
    body: site.desk.learned,
    glyph: <SparkGlyph />,
    pos: { left: "63%", top: "55%" },
  },
  {
    key: "thought",
    label: "RANDOM THOUGHT",
    body: site.desk.thought,
    serif: true,
    glyph: <AsteriskGlyph />,
    pos: { left: "6%", top: "62%" },
  },
];

interface DeskCardProps {
  item: DeskObject;
  className?: string;
  style?: CSSProperties;
}

function DeskCard({ item, className, style }: DeskCardProps) {
  return (
    <div
      className={cn("rounded-[2px] border border-line bg-surface p-5", className)}
      style={style}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-meta-sm text-faint">{item.label}</p>
        <span className="shrink-0 text-ink/70">{item.glyph}</span>
      </div>
      <p
        className={cn(
          "mt-4 text-ink",
          item.serif
            ? "font-serif text-lg font-normal italic leading-snug"
            : "text-sm leading-relaxed"
        )}
      >
        {item.body}
      </p>
    </div>
  );
}

/* ── Section ── */

export default function DigitalDesk() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [topKey, setTopKey] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const pointerFine = usePointerFine();
  const isDesktop = useMediaQuery("(min-width: 1024px)") && pointerFine;

  return (
    <section
      id="desk"
      className="container-edge relative py-[clamp(6rem,14vh,11rem)]"
    >
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="text-meta text-muted">04 / NOTES — THE DESK</p>
            <h2 className="mt-5 text-[clamp(2.4rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-tight text-ink">
              NOW
            </h2>
          </div>
          <p className="flex items-center gap-2.5 pb-2 text-meta text-faint">
            <span
              className="inline-block size-1.5 animate-pulse-dot bg-accent"
              aria-hidden="true"
            />
            UPDATED / RECENTLY
          </p>
        </div>
      </Reveal>

      {isDesktop ? (
        <div
          ref={containerRef}
          className="relative mt-16 h-[72vh] max-h-[880px] min-h-[620px]"
        >
          <span className="absolute left-0 top-0 font-mono text-[10px] text-faint/60" aria-hidden="true">
            +
          </span>
          <span className="absolute right-0 top-0 font-mono text-[10px] text-faint/60" aria-hidden="true">
            +
          </span>
          <span className="absolute bottom-0 left-0 font-mono text-[10px] text-faint/60" aria-hidden="true">
            +
          </span>

          {OBJECTS.map((item, i) => {
            const rotate = (pr(i + 1, 7) - 0.5) * 5;
            const floatDuration = 5 + pr(i + 1, 13) * 2;
            const floatDelay = pr(i + 1, 29) * 1.5;
            return (
              <motion.div
                key={item.key}
                data-cursor="link"
                className="absolute w-[300px] cursor-grab select-none xl:w-[330px]"
                style={{
                  left: item.pos.left,
                  top: item.pos.top,
                  rotate,
                  zIndex: topKey === item.key ? 20 : 1 + i,
                  boxShadow: "0px 0px 0px rgba(0,0,0,0)",
                }}
                initial={{ opacity: 0 }}
                whileInView={{
                  opacity: 1,
                  transition: {
                    duration: 0.9,
                    ease: [...EASE_OUT_EXPO],
                    delay: 0.1 + i * 0.08,
                  },
                }}
                viewport={{ once: true, margin: "-10% 0px" }}
                drag
                dragConstraints={containerRef}
                dragElastic={0.12}
                dragMomentum={false}
                whileDrag={{
                  scale: 1.03,
                  boxShadow: "0px 14px 36px rgba(0,0,0,0.35)",
                }}
                onDragStart={() => setTopKey(item.key)}
              >
                <motion.div
                  animate={reduced ? undefined : { y: [0, -5, 0, 5, 0] }}
                  transition={{
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: floatDelay,
                  }}
                >
                  <DeskCard item={item} />
                </motion.div>
              </motion.div>
            );
          })}

          <p className="absolute bottom-0 right-0 select-none text-meta-sm text-faint">
            DRAG THE OBJECTS
          </p>
        </div>
      ) : (
        <div className="mt-14 flex flex-col gap-5">
          {OBJECTS.map((item, i) => (
            <Reveal
              key={item.key}
              delay={i * 0.07}
              className={cn("w-full max-w-[340px]", i % 2 === 1 && "self-end")}
            >
              <DeskCard
                item={item}
                style={{ transform: `rotate(${(pr(i + 1, 3) - 0.5) * 1.6}deg)` }}
              />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
