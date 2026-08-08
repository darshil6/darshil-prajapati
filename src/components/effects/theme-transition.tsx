"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Theme } from "@/components/providers/theme-provider";

/** Full sun pass in seconds — keep in sync with ThemeProvider's TOTAL_MS. */
const DURATION = 1.8;

/** Deterministic pseudo-random — stable star placement. */
const pr = (i: number, s = 1) => {
  const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

const STARS = Array.from({ length: 7 }, (_, i) => ({
  left: `${6 + pr(i) * 88}%`,
  top: `${4 + pr(i, 3) * 42}%`,
  size: pr(i, 5) > 0.6 ? 2.5 : 1.5,
  delay: pr(i, 7) * 0.25,
}));

/**
 * The sunrise / sunset theme change: a sun disc crosses a thin horizon while a
 * sky wash sweeps the page; the palette flips beneath the wash's peak.
 * Decorative and pointer-transparent; skipped entirely under reduced motion
 * (ThemeProvider applies the theme instantly instead).
 */
export default function ThemeTransition({ target }: { target: Theme | null }) {
  const sunrise = target === "light";

  return (
    <AnimatePresence>
      {target && (
        <motion.div
          key={target}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[95] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          {/* Sky wash */}
          <motion.div
            className="absolute inset-0"
            style={{
              willChange: "opacity",
              background: sunrise
                ? "linear-gradient(to top, rgba(255,161,64,0.6) 0%, rgba(255,214,140,0.4) 42%, rgba(168,196,255,0.22) 100%)"
                : "linear-gradient(to bottom, rgba(16,13,52,0.8) 0%, rgba(110,52,120,0.55) 52%, rgba(255,128,50,0.6) 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.95, 0.95, 0] }}
            transition={{
              duration: DURATION,
              times: [0, 0.3, 0.64, 1],
              ease: "easeInOut",
            }}
          />

          {/* Veil — reaches near-opaque exactly while the palette flips, so the
              instant swap is invisible in both directions. */}
          <motion.div
            className="absolute inset-0"
            style={{
              willChange: "opacity",
              backgroundColor: sunrise ? "#f4f1ea" : "#0a0a0a",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.96, 0.96, 0] }}
            transition={{
              duration: DURATION,
              times: [0, 0.42, 0.56, 1],
              ease: "easeInOut",
            }}
          />

          {/* Glow horizon */}
          <motion.div
            className="absolute left-[6%] right-[6%] top-[68%] h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(255,200,140,0.7) 30%, rgba(255,200,140,0.7) 70%, transparent)",
            }}
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: [0, 0.7, 0.7, 0], scaleX: 1 }}
            transition={{ duration: DURATION, times: [0, 0.25, 0.7, 1] }}
          />

          {/* The sun */}
          <motion.div
            className="absolute left-1/2 top-[68%] aspect-square w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              willChange: "transform, opacity",
              background: sunrise
                ? "radial-gradient(circle, #ffeeb0 0%, #ffb84d 40%, rgba(255,138,40,0) 68%)"
                : "radial-gradient(circle, #ffd089 0%, #ff8a3a 42%, rgba(255,110,40,0) 68%)",
            }}
            initial={{
              y: sunrise ? "52vh" : "-46vh",
              scale: sunrise ? 0.82 : 1,
              opacity: 0,
            }}
            animate={{
              y: sunrise ? "-46vh" : "52vh",
              scale: sunrise ? 1 : 0.82,
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: DURATION, ease: [0.45, 0.05, 0.55, 0.95] }}
          />

          {/* Stars surface after dusk */}
          {!sunrise &&
            STARS.map((s, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-[#f4f1ea]"
                style={{
                  left: s.left,
                  top: s.top,
                  width: s.size,
                  height: s.size,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 0.9, 0] }}
                transition={{
                  duration: DURATION,
                  times: [0, 0.5, 0.78, 1],
                  delay: s.delay,
                }}
              />
            ))}

          {/* Mono system label, on brand with the site's metadata language */}
          <motion.p
            className="text-meta-sm absolute bottom-6 left-6 text-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.75, 0.75, 0] }}
            transition={{ duration: DURATION, times: [0, 0.25, 0.75, 1] }}
          >
            {sunrise ? "SYS / SUNRISE — 06:12 IST" : "SYS / SUNSET — 19:04 IST"}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
