"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { site } from "@/data/site";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";

interface NavOverlayProps {
  open: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

// Inline style values (SVG presentation attributes don't support var()).
const STROKE = "color-mix(in oklab, var(--t-ink) 20%, transparent)";
const ACCENT = "var(--t-accent)";

const pr = (i: number, s = 1) => {
  const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/* ── Generative motifs (one per destination) ─────────────── */

function MotifGrid() {
  const cells: React.ReactElement[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const x = 30 + c * 48;
      const y = 30 + r * 48;
      if (r === 1 && c === 2) {
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={x}
            y={y}
            width={36}
            height={36}
            style={{ fill: ACCENT }}
            fillOpacity={0.85}
          />
        );
      } else {
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={x}
            y={y}
            width={36}
            height={36}
            fill="none"
            style={{ stroke: STROKE }}
            strokeWidth={1}
            opacity={0.35 + pr(r * 4 + c) * 0.65}
          />
        );
      }
    }
  }
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden="true">
      {cells}
    </svg>
  );
}

function MotifLines() {
  const lines = Array.from({ length: 6 }, (_, i) => {
    const y = 45 + i * 30;
    const c1 = y + (pr(i, 5) - 0.5) * 44;
    const c2 = y + (pr(i, 9) - 0.5) * 44;
    return (
      <path
        key={i}
        d={`M 24 ${y} C 90 ${c1.toFixed(1)}, 150 ${c2.toFixed(1)}, 216 ${y}`}
        fill="none"
        style={{ stroke: i === 3 ? ACCENT : STROKE }}
        strokeWidth={1}
      />
    );
  });
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden="true">
      {lines}
    </svg>
  );
}

function MotifParticles() {
  const dots = Array.from({ length: 26 }, (_, i) => ({
    x: 28 + pr(i, 1) * 184,
    y: 28 + pr(i, 2) * 184,
    r: 1 + pr(i, 3) * 2,
  }));
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden="true">
      {dots.map((d, i) =>
        i === 7 ? (
          <g key={i}>
            <circle
              cx={d.x.toFixed(1)}
              cy={d.y.toFixed(1)}
              r={11}
              fill="none"
              style={{ stroke: STROKE }}
              strokeWidth={1}
            />
            <circle
              cx={d.x.toFixed(1)}
              cy={d.y.toFixed(1)}
              r={3}
              style={{ fill: ACCENT }}
            />
          </g>
        ) : (
          <circle
            key={i}
            cx={d.x.toFixed(1)}
            cy={d.y.toFixed(1)}
            r={d.r.toFixed(1)}
            style={{ fill: STROKE }}
          />
        )
      )}
    </svg>
  );
}

function MotifPlanes() {
  const planes = Array.from({ length: 5 }, (_, i) => {
    const y = 62 + i * 32;
    return (
      <path
        key={i}
        d={`M 52 ${y} L 188 ${y - 20} L 188 ${y - 6} L 52 ${y + 14} Z`}
        fill="none"
        style={{ stroke: i === 2 ? ACCENT : STROKE }}
        strokeWidth={1}
      />
    );
  });
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden="true">
      {planes}
    </svg>
  );
}

function MotifRings() {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden="true">
      {[24, 48, 72, 96].map((r, i) => (
        <circle
          key={r}
          cx={120}
          cy={120}
          r={r}
          fill="none"
          style={{ stroke: STROKE }}
          strokeWidth={1}
          opacity={1 - i * 0.18}
        />
      ))}
      <circle
        cx={120}
        cy={120}
        r={48}
        fill="none"
        style={{ stroke: ACCENT }}
        strokeWidth={1}
        strokeDasharray="48 254"
        transform="rotate(-90 120 120)"
      />
      <circle cx={120} cy={120} r={2} style={{ fill: STROKE }} />
    </svg>
  );
}

/* ── Items ────────────────────────────────────────────────── */

interface NavItem {
  index: string;
  label: string;
  href: string;
  Motif: () => React.ReactElement;
}

const NAV_ITEMS: NavItem[] = [
  { index: "01", label: "WORK", href: "/#work", Motif: MotifGrid },
  { index: "02", label: "STORY", href: "/#story", Motif: MotifLines },
  { index: "03", label: "EXPERIMENTS", href: "/#lab", Motif: MotifParticles },
  { index: "04", label: "NOTES", href: "/#desk", Motif: MotifPlanes },
  { index: "05", label: "CONTACT", href: "/#contact", Motif: MotifRings },
];

/* ── Overlay ──────────────────────────────────────────────── */

export default function NavOverlay({ open, onClose, triggerRef }: NavOverlayProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    // Take the body scroll lock only if no other layer already holds it, and
    // release to "" only when owned — restoring a saved value can re-apply a
    // stale "hidden" from another layer and deadlock the page.
    const ownsLock = document.body.style.overflow !== "hidden";
    if (ownsLock) document.body.style.overflow = "hidden";
    return () => {
      if (ownsLock) document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setActive(null);
      return;
    }
    const t = window.setTimeout(
      () => firstLinkRef.current?.focus({ preventScroll: true }),
      80
    );
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      // Yield to a modal stacked above (e.g. command palette): it owns focus + Escape.
      if (e.defaultPrevented) return;
      const stackedModal = Array.from(
        document.querySelectorAll('[role="dialog"][aria-modal="true"]')
      ).some((d) => d !== panelRef.current);
      if (stackedModal) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const selector = "a[href], button:not([disabled])";
      const header = triggerRef?.current?.closest("header");
      const headerNodes = header
        ? Array.from(header.querySelectorAll<HTMLElement>(selector))
        : [];
      const focusables = [
        ...headerNodes,
        ...Array.from(panel.querySelectorAll<HTMLElement>(selector)),
      ];
      if (focusables.length === 0) return;
      e.preventDefault();
      const current = document.activeElement as HTMLElement | null;
      const idx = current ? focusables.indexOf(current) : -1;
      const next = e.shiftKey
        ? focusables[(idx <= 0 ? focusables.length : idx) - 1]
        : focusables[(idx + 1) % focusables.length];
      next?.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, triggerRef]);

  const panelVariants: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.25 } },
      }
    : {
        hidden: { clipPath: "inset(0 0 100% 0)" },
        show: {
          clipPath: "inset(0 0 0% 0)",
          transition: { duration: 0.6, ease: [...EASE_OUT_EXPO] },
        },
        exit: {
          clipPath: "inset(0 0 100% 0)",
          transition: { duration: 0.5, ease: [...EASE_OUT_EXPO], delay: 0.08 },
        },
      };

  const listVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
    exit: {},
  };

  const itemVariants: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, y: 48 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: [...EASE_OUT_EXPO] },
        },
        exit: { opacity: 0, transition: { duration: 0.25 } },
      };

  const footerVariants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.45, duration: 0.7, ease: [...EASE_OUT_EXPO] },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const activeItem = active === null ? undefined : NAV_ITEMS[active];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="nav-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          variants={panelVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          data-lenis-prevent
          className="fixed inset-0 z-[60] flex flex-col bg-bg"
        >
          <div
            data-lenis-prevent
            className="relative flex flex-1 overflow-x-hidden overflow-y-auto"
          >
            <nav aria-label="Primary" className="container-edge my-auto w-full py-28">
              <motion.ul
                variants={listVariants}
                className="flex flex-col gap-1 sm:gap-2"
                onMouseLeave={() => setActive(null)}
              >
                {NAV_ITEMS.map((item, i) => (
                  <motion.li key={item.label} variants={itemVariants}>
                    <Link
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      onClick={onClose}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className="group flex items-baseline gap-4 py-1 sm:gap-7"
                    >
                      <span
                        className={cn(
                          "text-meta transition-colors duration-300",
                          active === i ? "text-accent" : "text-faint"
                        )}
                      >
                        {item.index}
                      </span>
                      <motion.span
                        animate={{ x: active === i && !reduce ? 12 : 0 }}
                        transition={{ type: "spring", stiffness: 320, damping: 26 }}
                        className={cn(
                          "font-sans text-[clamp(2.1rem,7vw,5.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight transition-colors duration-300",
                          active === null || active === i
                            ? "text-ink"
                            : "text-ink/30"
                        )}
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-[8vw] top-1/2 hidden -translate-y-1/2 lg:block"
            >
              <div className="relative h-60 w-60">
                <AnimatePresence>
                  {activeItem && (
                    <motion.div
                      key={activeItem.label}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.4, ease: [...EASE_OUT_EXPO] }}
                      className="absolute inset-0"
                    >
                      <activeItem.Motif />
                      <p className="mt-3 text-right text-meta-sm text-faint">
                        {activeItem.index} / {activeItem.label}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <motion.div
            variants={footerVariants}
            className="container-edge flex items-center justify-between gap-4 border-t border-line-soft py-5"
          >
            <a
              href={`mailto:${site.personal.email}`}
              className="link-underline text-meta normal-case text-muted transition-colors duration-300 hover:text-ink"
            >
              {site.personal.email}
            </a>
            <p className="hidden text-meta text-muted sm:block">
              {site.personal.location}
            </p>
            <p className="text-meta text-faint">IND</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
