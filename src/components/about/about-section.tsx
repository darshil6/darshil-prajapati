"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Reveal from "@/components/common/reveal";
import { site } from "@/data/site";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";

const { aboutStatement, aboutBody, metaCards } = site.personal;

/** Single-word statement lines get the serif italic treatment. */
const serifIndices = aboutStatement.reduce<number[]>((acc, line, i) => {
  if (line.trim().split(/\s+/).length === 1) acc.push(i);
  return acc;
}, []);

/** Exactly one serif line carries the accent — the middle one, deterministically. */
const accentIndex =
  serifIndices.length > 0
    ? serifIndices[Math.floor((serifIndices.length - 1) / 2)]
    : -1;

/** Desktop slots for the floating metadata — position + parallax travel (px). */
const CARD_SLOTS = [
  { position: "right-[4%] top-[12%]", range: 48 },
  { position: "left-[2%] top-[54%]", range: 72 },
  { position: "right-[9%] bottom-[12%]", range: 36 },
  { position: "right-[18%] top-[44%]", range: 60 },
];

const splitLead = (text: string, count = 4): [string, string] => {
  const words = text.split(" ");
  return [words.slice(0, count).join(" "), words.slice(count).join(" ")];
};

interface MetaCardBodyProps {
  label: string;
  value: string;
}

function MetaCardBody({ label, value }: MetaCardBodyProps) {
  return (
    <>
      <p className="text-meta-sm text-faint">{label}</p>
      <p className="mt-1.5 text-meta text-ink">{value}</p>
    </>
  );
}

interface FloatingCardProps extends MetaCardBodyProps {
  position: string;
  range: number;
  delay: number;
  progress: MotionValue<number>;
  reduced: boolean;
}

function FloatingCard({
  label,
  value,
  position,
  range,
  delay,
  progress,
  reduced,
}: FloatingCardProps) {
  const y = useTransform(progress, [0, 1], [range, -range]);

  return (
    <Reveal delay={delay} y={20} className={cn("absolute w-44", position)}>
      <motion.div
        style={reduced ? undefined : { y }}
        className="border border-line bg-surface/60 p-4"
      >
        <MetaCardBody label={label} value={value} />
      </motion.div>
    </Reveal>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      id="story"
      className="container-edge relative py-[clamp(6rem,14vh,11rem)]"
    >
      {/* Floating metadata — desktop only, scroll parallax, purely editorial */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {metaCards.map((card, i) => {
          const slot = CARD_SLOTS[i % CARD_SLOTS.length];
          return (
            <FloatingCard
              key={card.label}
              label={card.label}
              value={card.value}
              position={slot.position}
              range={slot.range}
              delay={0.15 + i * 0.08}
              progress={scrollYProgress}
              reduced={!!reduced}
            />
          );
        })}
      </div>

      <div className="relative z-10">
        <Reveal as="p" className="text-meta text-muted">
          02 / STORY — WHO AM I
        </Reveal>

        <h2 className="mt-10 max-w-5xl text-[clamp(2.4rem,6.5vw,5.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
          {aboutStatement.map((line, i) => (
            <Reveal
              key={line}
              as="span"
              delay={i * 0.08}
              y={32}
              className={cn(
                "block",
                serifIndices.includes(i) &&
                  "font-serif italic font-normal tracking-normal",
                i === accentIndex && "text-accent"
              )}
            >
              {line}
            </Reveal>
          ))}
        </h2>

        <div className="mt-16 lg:ml-[30%] lg:mt-24">
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 1, ease: [...EASE_OUT_EXPO] }}
            className="h-px max-w-2xl origin-left bg-accent/50"
          />

          <div className="mt-12 max-w-xl space-y-6">
            {aboutBody.map((paragraph, i) => {
              const [lead, rest] = splitLead(paragraph);
              return (
                <Reveal
                  key={paragraph.slice(0, 32)}
                  as="p"
                  delay={0.1 + i * 0.1}
                  className="text-lg leading-relaxed text-muted"
                >
                  <span className="text-ink">{lead}</span>
                  {rest && <>{" "}{rest}</>}
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Mobile metadata grid — no parallax */}
        <div className="mt-16 grid grid-cols-2 gap-3 lg:hidden">
          {metaCards.map((card, i) => (
            <Reveal
              key={card.label}
              delay={i * 0.06}
              className="border border-line bg-surface/60 p-4"
            >
              <MetaCardBody label={card.label} value={card.value} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
