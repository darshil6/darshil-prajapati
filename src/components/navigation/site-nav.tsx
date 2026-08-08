"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Magnetic from "@/components/common/magnetic";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useTheme } from "@/components/providers/theme-provider";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import NavOverlay from "./nav-overlay";

/** Sun (while dark) morphing to crescent moon (while light) — shows the
 *  theme the button will bring, matching the sunrise/sunset transition. */
function ThemeGlyph({ dark }: { dark: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] text-ink transition-colors duration-300 group-hover:text-accent"
      aria-hidden="true"
    >
      <mask id="theme-glyph-mask">
        <rect width="24" height="24" fill="white" />
        <motion.circle
          r="7"
          fill="black"
          initial={false}
          animate={{ cx: dark ? 30 : 16.5, cy: dark ? 2 : 8.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </mask>
      <motion.circle
        cx="12"
        cy="12"
        fill="currentColor"
        mask="url(#theme-glyph-mask)"
        initial={false}
        animate={{ r: dark ? 4.5 : 8 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.g
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={false}
        animate={{
          opacity: dark ? 1 : 0,
          scale: dark ? 1 : 0.55,
          rotate: dark ? 0 : -40,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "12px 12px" }}
      >
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={12 + Math.cos(a) * 7}
              y1={12 + Math.sin(a) * 7}
              x2={12 + Math.cos(a) * 9}
              y2={12 + Math.sin(a) * 9}
            />
          );
        })}
      </motion.g>
    </svg>
  );
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { direction, atTop } = useScrollDirection();
  const { theme, toggleTheme } = useTheme();
  const hidden = !open && !atTop && direction === "down";

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  const toggle = () => {
    if (open) close();
    else setOpen(true);
  };

  const onLogoClick = () => {
    window.dispatchEvent(new CustomEvent("logo-click"));
    if (open) close();
  };

  return (
    <>
      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 transition-transform",
          open ? "z-[61]" : "z-50",
          hidden ? "-translate-y-full focus-within:translate-y-0" : "translate-y-0"
        )}
        style={{
          transitionDuration: "0.5s",
          transitionTimingFunction: "var(--ease-out-expo)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-b from-bg/70 to-transparent"
        />
        <div className="container-edge flex items-center justify-between py-5">
          <div className="pointer-events-auto flex items-center gap-2.5">
            <Link
              href="/"
              onClick={onLogoClick}
              className="text-meta text-ink transition-colors duration-300 hover:text-accent"
            >
              {site.personal.name}
            </Link>
            <span
              role="img"
              aria-label="Available for work"
              title="Available for work"
              className="block h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot"
            />
          </div>

          <div className="pointer-events-auto flex items-center gap-3">
            <Magnetic strength={0.3}>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  theme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg/50 transition-colors duration-300 hover:border-accent"
              >
                <ThemeGlyph dark={theme === "dark"} />
              </button>
            </Magnetic>

            <Magnetic strength={0.35}>
            <button
              ref={buttonRef}
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls="nav-overlay"
              aria-label={open ? "Close menu" : "Open menu"}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg/50 transition-colors duration-300 hover:border-accent"
            >
              <span aria-hidden="true" className="relative block h-3 w-[18px]">
                <span
                  className={cn(
                    "absolute left-0 top-1/2 block h-px w-full bg-ink transition-transform duration-500 group-hover:bg-accent",
                    open ? "rotate-45" : "-translate-y-[3px]"
                  )}
                  style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
                />
                <span
                  className={cn(
                    "absolute left-0 top-1/2 block h-px w-full bg-ink transition-transform duration-500 group-hover:bg-accent",
                    open ? "-rotate-45" : "translate-y-[3px]"
                  )}
                  style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
                />
              </span>
            </button>
            </Magnetic>
          </div>
        </div>
      </header>

      <NavOverlay open={open} onClose={close} triggerRef={buttonRef} />
    </>
  );
}
