"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { site } from "@/data/site";
import { EASE_OUT_EXPO } from "@/lib/utils";

const LOADED_KEY = "dp:loaded";
const COUNT_MS = 1100;
const HOLD_MS = 150;

type Phase = "idle" | "loading" | "exit" | "done";

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const reducedRef = useRef(false);

  /* Decide visibility after mount only — nothing on server / first render. */
  useEffect(() => {
    let seen = false;
    try {
      seen = !!window.sessionStorage.getItem(LOADED_KEY);
    } catch {
      /* storage unavailable */
    }
    if (seen) {
      setPhase("done");
      return;
    }

    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setPhase("loading");

    const beginExit = () => {
      try {
        window.sessionStorage.setItem(LOADED_KEY, "1");
      } catch {
        /* storage unavailable */
      }
      setPhase("exit");
    };

    let raf = 0;
    let hold = 0;

    if (reducedRef.current) {
      setProgress(100);
      hold = window.setTimeout(beginExit, 300);
    } else {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / COUNT_MS);
        const eased = 1 - Math.pow(1 - t, 3);
        setProgress(Math.round(eased * 100));
        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          hold = window.setTimeout(beginExit, HOLD_MS);
        }
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hold);
    };
  }, []);

  /* Lock scroll while the layer is visible. */
  useEffect(() => {
    if (phase !== "loading" && phase !== "exit") return;
    // Ownership-guarded lock: never restore a saved value (another layer's
    // stale "hidden" would deadlock the page) — release to "" only if owned.
    const html = document.documentElement;
    const ownsHtml = html.style.overflow !== "hidden";
    const ownsBody = document.body.style.overflow !== "hidden";
    if (ownsHtml) html.style.overflow = "hidden";
    if (ownsBody) document.body.style.overflow = "hidden";
    return () => {
      if (ownsHtml) html.style.overflow = "";
      if (ownsBody) document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "idle" || phase === "done") return null;

  const exiting = phase === "exit";

  return (
    <motion.div
      aria-hidden="true"
      data-lenis-prevent
      className="fixed inset-0 z-[80] grid place-items-center bg-bg"
      initial={false}
      animate={exiting ? "exit" : "shown"}
      variants={{
        shown: { y: 0, opacity: 1 },
        exit: reducedRef.current
          ? { opacity: 0, transition: { duration: 0.3 } }
          : {
              y: "-100%",
              transition: { duration: 0.6, ease: [...EASE_OUT_EXPO] },
            },
      }}
      onAnimationComplete={(definition) => {
        if (definition === "exit") setPhase("done");
      }}
    >
      <div className="flex w-[min(84vw,30rem)] flex-col items-center gap-7">
        <p
          className="text-meta text-ink"
          style={{ letterSpacing: "0.3em" }}
        >
          {site.personal.name}
        </p>

        <div className="flex w-full items-end justify-between gap-8">
          <span className="pb-2 text-meta-sm text-faint">
            LOADING EXPERIENCE
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-[clamp(3rem,8vw,6rem)] font-extrabold leading-none tracking-tight text-ink tabular-nums">
              {String(progress).padStart(3, "0")}
            </span>
            <span className="font-mono text-sm text-faint">%</span>
          </span>
        </div>

        <div className="relative h-px w-full bg-line">
          <div
            className="absolute inset-0 origin-left bg-accent"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
