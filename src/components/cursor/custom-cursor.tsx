"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { usePointerFine } from "@/hooks/use-media-query";

type CursorState = "default" | "link" | "view" | "zoom" | "hidden";

/**
 * Custom cursor. Elements opt into behaviours via attributes:
 *   data-cursor="view"  → expands with a label (data-cursor-label, default "VIEW")
 *   data-cursor="zoom"  → large ring (images)
 *   data-cursor="link"  → medium ring (also automatic on <a>/<button>)
 * Desktop-only (pointer: fine); native cursor is untouched on touch devices.
 */
export default function CustomCursor() {
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const [state, setState] = useState<CursorState>("hidden");
  const [label, setLabel] = useState("VIEW");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Stiff spring: tracks the pointer near-1:1 with only a hint of smoothing.
  const sx = useSpring(x, { stiffness: 1500, damping: 75, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 1500, damping: 75, mass: 0.35 });

  useEffect(() => {
    if (!fine) return;
    document.documentElement.dataset.customCursor = "true";

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setState((s) => (s === "hidden" ? "default" : s));
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || !(t instanceof Element)) return;
      const tagged = t.closest<HTMLElement>("[data-cursor]");
      if (tagged) {
        const kind = tagged.dataset.cursor as CursorState;
        if (kind === "view") setLabel(tagged.dataset.cursorLabel ?? "VIEW");
        setState(kind === "view" || kind === "zoom" ? kind : "link");
        return;
      }
      if (t.closest("a, button, [role='button'], input, textarea, select, label, summary")) {
        setState("link");
        return;
      }
      setState("default");
    };

    const onLeave = () => setState("hidden");
    const onEnter = () => setState("default");

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      delete document.documentElement.dataset.customCursor;
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  const size =
    state === "view" ? 76 : state === "zoom" ? 60 : state === "link" ? 36 : 10;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full"
      style={{
        x: reduced ? x : sx,
        y: reduced ? y : sy,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full"
        animate={{
          width: size,
          height: size,
          opacity: state === "hidden" ? 0 : 1,
          borderWidth: state === "link" || state === "zoom" ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          borderStyle: "solid",
          borderColor: "var(--t-cursor-ring)",
          // Theme-driven: white + difference blend on dark, solid black on light.
          backgroundColor:
            state === "view"
              ? "var(--t-accent-fill)"
              : state === "default"
                ? "var(--t-cursor-dot)"
                : "transparent",
          mixBlendMode: (state === "default"
            ? "var(--t-cursor-blend)"
            : "normal") as React.CSSProperties["mixBlendMode"],
        }}
      >
        {state === "view" && (
          <span className="text-meta-sm whitespace-nowrap font-medium text-black">
            {label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
