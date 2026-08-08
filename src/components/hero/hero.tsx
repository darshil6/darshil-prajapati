"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { site } from "@/data/site";
import { usePointerFine } from "@/hooks/use-media-query";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";

const LINE_COUNT = 14;

/* Mirrors the preloader (src/components/loader/preloader.tsx): same
   sessionStorage key; delays cover its count 1.1s + hold 0.15s + 0.6s exit
   (reduced motion: 0.3s hold + 0.3s fade) so the intro plays after the
   curtain lifts on first visit instead of hidden behind it. */
const LOADED_KEY = "dp:loaded";
const PRELOADER_DELAY = 1.7;
const PRELOADER_DELAY_REDUCED = 0.65;

const FLOAT_LABELS = [
  {
    text: "N 23.0225°",
    factor: 7,
    delay: 1.15,
    className: "right-[22%] top-[24%] hidden md:block",
  },
  {
    text: "E 72.5714°",
    factor: 12,
    delay: 1.25,
    className: "right-[6%] top-[44%]",
  },
  {
    text: "SYS:VOICE/RAG",
    factor: 16,
    delay: 1.35,
    className: "bottom-[30%] left-[4%] hidden sm:block",
  },
  {
    text: "LAT:LOW",
    factor: 9,
    delay: 1.45,
    className: "bottom-[24%] right-[13%]",
  },
] as const;

interface FloatingLabelProps {
  text: string;
  factor: number;
  delay: number;
  active: boolean;
  className?: string;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}

function FloatingLabel({
  text,
  factor,
  delay,
  active,
  className,
  sx,
  sy,
}: FloatingLabelProps) {
  const x = useTransform(sx, (v) => v * factor);
  const y = useTransform(sy, (v) => v * factor);
  return (
    <motion.span
      aria-hidden
      className={cn(
        "text-meta-sm pointer-events-none absolute z-10 select-none text-faint",
        className
      )}
      style={{ x, y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 1, delay, ease: [...EASE_OUT_EXPO] }}
    >
      {text}
    </motion.span>
  );
}

interface LineFieldProps {
  skewY: MotionValue<number>;
  y: MotionValue<number>;
}

function LineField({ skewY, y }: LineFieldProps) {
  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute inset-x-0 -inset-y-[6%] will-change-transform"
        style={{ skewY, y }}
      >
        <svg
          className="h-full w-full text-ink/5"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {Array.from({ length: LINE_COUNT }, (_, i) => {
            const ly = ((i + 1) / (LINE_COUNT + 1)) * 100;
            return (
              <line
                key={i}
                x1="0"
                x2="100"
                y1={ly}
                y2={ly}
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
      </motion.div>
      <div className="absolute inset-y-0 left-[72%] w-px bg-accent opacity-25" />
    </div>
  );
}

export default function Hero() {
  const pointerFine = usePointerFine();
  const prefersReduced = useReducedMotion();
  const interactive = pointerFine && !prefersReduced;

  /* Hold the entrance until we know whether the preloader will run this
     visit; null = undecided (server + first client render stay on initial). */
  const [introDelay, setIntroDelay] = useState<number | null>(null);
  const ready = introDelay !== null;
  const base = introDelay ?? 0;

  useEffect(() => {
    let seen = false;
    try {
      seen = !!window.sessionStorage.getItem(LOADED_KEY);
    } catch {
      /* storage unavailable */
    }
    if (seen) {
      setIntroDelay(0);
      return;
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setIntroDelay(reduced ? PRELOADER_DELAY_REDUCED : PRELOADER_DELAY);
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 16, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 60, damping: 16, mass: 0.7 });

  const headX = useTransform(sx, (v) => v * -10);
  const headY = useTransform(sy, (v) => v * -10);
  const fieldSkew = useTransform(sy, (v) => v * 1.4);
  const fieldY = useTransform(sy, (v) => v * 10);

  useEffect(() => {
    if (!interactive) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      mx.set(0);
      my.set(0);
    };
  }, [interactive, mx, my]);

  const lines = site.personal.heroLines;
  const lastIndex = lines.length - 1;

  return (
    <section
      className="container-edge relative flex min-h-svh flex-col justify-between overflow-hidden pb-[clamp(1.5rem,4vh,2.75rem)] pt-[clamp(6rem,12vh,8.5rem)]"
      aria-label="Introduction"
    >
      <LineField skewY={fieldSkew} y={fieldY} />

      <motion.div
        className="text-meta relative z-10 flex items-center justify-between text-faint"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{
          duration: 0.9,
          delay: 0.9 + base,
          ease: [...EASE_OUT_EXPO],
        }}
      >
        <span>PORTFOLIO / 2026</span>
        <span>V.1.0</span>
      </motion.div>

      {FLOAT_LABELS.map((label) => (
        <FloatingLabel
          key={label.text}
          text={label.text}
          factor={label.factor}
          delay={label.delay + base}
          active={ready}
          className={label.className}
          sx={sx}
          sy={sy}
        />
      ))}

      <div className="relative z-10 flex flex-1 items-center py-[clamp(2rem,5vh,3.5rem)]">
        <motion.h1
          className="text-[clamp(3.2rem,9.5vw,9rem)] font-extrabold uppercase leading-[0.92] tracking-tight will-change-transform"
          style={{ x: headX, y: headY }}
        >
          {lines.map((line, i) => {
            const isLast = i === lastIndex;
            const words = line.split(" ");
            const serifWord = isLast ? words[words.length - 1] ?? "" : "";
            const rest = isLast ? words.slice(0, -1).join(" ") : line;
            return (
              <span
                key={i}
                className="-mb-[0.08em] block overflow-hidden pb-[0.08em]"
              >
                <motion.span
                  className="block will-change-transform"
                  initial={{ y: "112%" }}
                  animate={{ y: ready ? "0%" : "112%" }}
                  transition={{
                    duration: 1,
                    delay: 0.2 + base + i * 0.09,
                    ease: [...EASE_OUT_EXPO],
                  }}
                >
                  {rest}
                  {isLast && serifWord ? (
                    <>
                      {" "}
                      <span className="font-serif font-normal lowercase italic tracking-normal text-accent">
                        {serifWord}
                      </span>
                    </>
                  ) : null}
                </motion.span>
              </span>
            );
          })}
        </motion.h1>
      </div>

      <motion.div
        className="text-meta relative z-10 flex flex-col items-start gap-5 text-muted sm:flex-row sm:items-end sm:justify-between"
        initial={{ opacity: 0, y: 16 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{
          duration: 0.9,
          delay: 0.75 + base,
          ease: [...EASE_OUT_EXPO],
        }}
      >
        <div className="flex flex-col gap-2">
          <span className="text-ink">
            {site.personal.identityLine.join(" / ")}
          </span>
          <span className="text-faint">
            Based in {site.personal.location}
          </span>
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot"
            />
            {site.personal.availability}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>SCROLL TO EXPLORE</span>
          <motion.span
            aria-hidden
            className="inline-block"
            animate={prefersReduced ? { y: 0 } : { y: [0, 6, 0] }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
            }
          >
            {"↓"}
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}
