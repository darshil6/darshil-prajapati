"use client";

import { useEffect, useRef, type ComponentType } from "react";
import { useReducedMotion } from "framer-motion";
import type { LabKind } from "@/data/types";
import { site } from "@/data/site";

/* ---------------------------------- */
/* Shared canvas machinery            */
/* ---------------------------------- */

const SURFACE = "#111111";
const ACCENT = "#d7ff3f";
const ink = (a: number) => `rgba(244, 241, 234, ${a})`;
const MONO = 'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace';

/** Deterministic pseudo-random (no Math.random). */
const pr = (i: number, s = 1) => {
  const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

interface CanvasSize {
  w: number;
  h: number;
}

type DrawFn = (
  ctx: CanvasRenderingContext2D,
  t: number,
  size: CanvasSize,
  still: boolean
) => void;

/**
 * DPR-aware canvas + rAF loop.
 * Runs only while intersecting, renders one static frame under
 * reduced motion, and cleans everything up on unmount.
 */
function useCanvasLoop(draw: DrawFn) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    const size: CanvasSize = { w: 0, h: 0 };
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.w = rect.width;
      size.h = rect.height;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (now: number) => {
      if (size.w > 4 && size.h > 4) {
        drawRef.current(ctx, (now - start) / 1000, size, false);
      }
      if (running) raf = requestAnimationFrame(frame);
    };

    const startLoop = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const drawStill = () => {
      if (size.w > 4 && size.h > 4) drawRef.current(ctx, 0, size, true);
    };

    resize();
    if (reduced) drawStill();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced || !running) drawStill();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startLoop();
        else stopLoop();
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  return canvasRef;
}

/* ---------------------------------- */
/* 001 — Cursor Field                 */
/* ---------------------------------- */

export function CursorFieldPreview() {
  const pointer = useRef({ x: 0.5, y: 0.5, active: false });

  const canvasRef = useCanvasLoop((ctx, t, { w, h }) => {
    ctx.fillStyle = SURFACE;
    ctx.fillRect(0, 0, w, h);

    const p = pointer.current;
    const ax = p.active
      ? p.x * w
      : w * (0.5 + 0.32 * Math.sin(t * 0.6) * Math.cos(t * 0.23));
    const ay = p.active ? p.y * h : h * (0.5 + 0.3 * Math.cos(t * 0.47));

    const gap = 21;
    const cols = Math.max(2, Math.floor(w / gap));
    const rows = Math.max(2, Math.floor(h / gap));
    const ox = (w - (cols - 1) * gap) / 2;
    const oy = (h - (rows - 1) * gap) / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const bx = ox + c * gap;
        const by = oy + r * gap;
        const dx = ax - bx;
        const dy = ay - by;
        const d = Math.hypot(dx, dy) || 1;
        const m = 13 * Math.exp(-d / 95);
        const x = bx + (dx / d) * m;
        const y = by + (dy / d) * m;
        const close = d < 56;
        ctx.beginPath();
        ctx.arc(x, y, close ? 1.6 : 1.1, 0, Math.PI * 2);
        ctx.fillStyle = close ? ACCENT : ink(0.2 + 0.5 * Math.exp(-d / 130));
        ctx.fill();
      }
    }

    ctx.font = `500 9px ${MONO}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = ink(0.4);
    ctx.fillText("FIELD:ATTRACT", 12, h - 12);
  });

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      pointer.current = {
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height,
        active: true,
      };
    };
    const onLeave = () => {
      pointer.current.active = false;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      role="img"
      aria-label="Cursor Field — a particle grid leaning toward the pointer"
    />
  );
}

/* ---------------------------------- */
/* 002 — Generative Type              */
/* ---------------------------------- */

const GLYPHS = "!<>-_\\/[]{}—=+*^?#";

export function GenerativeTypePreview() {
  const word = site.personal.firstName.toUpperCase();

  const canvasRef = useCanvasLoop((ctx, t, { w, h }, still) => {
    ctx.fillStyle = SURFACE;
    ctx.fillRect(0, 0, w, h);

    const n = word.length;
    const fs = Math.min(h * 0.34, (w * 0.9) / (n * 0.64));
    const cw = fs * 0.64;
    const x0 = w / 2 - ((n - 1) / 2) * cw;
    const y = h / 2;

    const lead = 0.5;
    const per = 0.32;
    const hold = 2.2;
    const loop = lead + per * n + 0.4 + hold;
    const lt = still ? loop - hold : t % loop;

    ctx.font = `700 ${fs}px ${MONO}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < n; i++) {
      const settleAt = lead + per * (i + 1);
      const x = x0 + i * cw;
      if (lt >= settleAt) {
        const settling = lt - settleAt < per;
        ctx.fillStyle = settling ? ACCENT : ink(0.92);
        ctx.fillText(word[i], x, y);
      } else {
        const g =
          GLYPHS[Math.floor(pr(i * 37 + Math.floor(t * 16), 9) * GLYPHS.length)];
        ctx.fillStyle = ink(0.32);
        ctx.fillText(g, x, y);
      }
    }

    ctx.font = `500 9px ${MONO}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = ink(0.4);
    ctx.fillText("DECODE:LOOP", 12, h - 12);
  });

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      role="img"
      aria-label={`Generative Type — the word ${word} scrambling and settling`}
    />
  );
}

/* ---------------------------------- */
/* 003 — Waveform Study               */
/* ---------------------------------- */

export function WaveformStudyPreview() {
  const canvasRef = useCanvasLoop((ctx, t, { w, h }, still) => {
    const tt = still ? 1.7 : t;
    ctx.fillStyle = SURFACE;
    ctx.fillRect(0, 0, w, h);

    const n = 90;
    const pad = 16;
    const span = w - pad * 2;
    const mid = h / 2;

    ctx.fillStyle = ink(0.16);
    ctx.fillRect(pad, mid - 0.5, span, 1);

    const env =
      0.3 + 0.7 * Math.abs(Math.sin(tt * 0.8) * Math.sin(tt * 0.31 + 1.2));

    for (let i = 0; i < n; i++) {
      const x = pad + (i / (n - 1)) * span;
      const win = Math.sin((i / (n - 1)) * Math.PI);
      const a =
        Math.sin(i * 0.42 + tt * 3.1) * 0.45 +
        Math.sin(i * 0.16 - tt * 2.2) * 0.35 +
        (pr(i * 13 + Math.floor(tt * 9), 5) - 0.5) * 0.5;
      const amp = Math.max(1.5, Math.abs(a) * env * win * (h * 0.36));
      const inBand = Math.abs(i - n / 2) < 7;
      ctx.fillStyle = inBand ? ACCENT : ink(0.28 + 0.42 * win);
      ctx.fillRect(x - 0.75, mid - amp, 1.5, amp * 2);
    }

    ctx.font = `500 9px ${MONO}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = ACCENT;
    ctx.fillRect(12, h - 19, 3, 3);
    ctx.fillStyle = ink(0.5);
    ctx.fillText("TTS:LIVE", 20, h - 12);
  });

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      role="img"
      aria-label="Waveform Study — synthetic speech amplitude drawn as bars"
    />
  );
}

/* ---------------------------------- */
/* 004 — Vector Space                 */
/* ---------------------------------- */

export function VectorSpacePreview() {
  const canvasRef = useCanvasLoop((ctx, t, { w, h }, still) => {
    const tt = still ? 0 : t;
    ctx.fillStyle = SURFACE;
    ctx.fillRect(0, 0, w, h);

    const n = 40;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < n; i++) {
      const sp = 0.15 + pr(i, 2) * 0.25;
      const ph = pr(i, 3) * Math.PI * 2;
      pts.push({
        x: (0.08 + 0.84 * pr(i, 1)) * w + Math.sin(tt * sp + ph) * 9,
        y: (0.1 + 0.8 * pr(i, 4)) * h + Math.cos(tt * sp * 1.3 + ph * 1.7) * 9,
      });
    }

    const thr = Math.min(w, h) * 0.32;
    ctx.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < thr) {
          ctx.strokeStyle = ink(0.26 * (1 - d / thr));
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = ink(0.6);
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    const q = {
      x: w * (0.5 + 0.3 * Math.sin(tt * 0.4)),
      y: h * (0.5 + 0.28 * Math.cos(tt * 0.53)),
    };
    const nearest = pts
      .map((p, i) => ({ i, d: Math.hypot(p.x - q.x, p.y - q.y) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);

    ctx.strokeStyle = "rgba(215, 255, 63, 0.75)";
    for (const nb of nearest) {
      ctx.beginPath();
      ctx.moveTo(q.x, q.y);
      ctx.lineTo(pts[nb.i].x, pts[nb.i].y);
      ctx.stroke();
      ctx.fillStyle = ACCENT;
      ctx.beginPath();
      ctx.arc(pts[nb.i].x, pts[nb.i].y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = ACCENT;
    ctx.beginPath();
    ctx.arc(q.x, q.y, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = `500 9px ${MONO}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = ink(0.4);
    ctx.fillText("KNN:K=3", 12, h - 12);
  });

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      role="img"
      aria-label="Vector Space — drifting points with nearest-neighbour links"
    />
  );
}

/* ---------------------------------- */
/* 005 — Latency Race                 */
/* ---------------------------------- */

const STAGES = [
  { label: "STT", start: 0.15, dur: 0.9 },
  { label: "LLM", start: 1.05, dur: 1.5 },
  { label: "TTS", start: 2.55, dur: 0.75 },
] as const;

export function LatencyRacePreview() {
  const canvasRef = useCanvasLoop((ctx, t, { w, h }, still) => {
    ctx.fillStyle = SURFACE;
    ctx.fillRect(0, 0, w, h);

    const raceEnd = 3.3;
    const loop = 4.1;
    const lt = still ? 2.1 : t % loop;
    const padL = 46;
    const padR = 18;
    const trackW = w - padL - padR;

    ctx.textBaseline = "middle";
    STAGES.forEach((s, i) => {
      const y = h * 0.26 + i * h * 0.2;
      ctx.font = `500 9px ${MONO}`;
      ctx.textAlign = "left";
      ctx.fillStyle = ink(0.55);
      ctx.fillText(s.label, 14, y);

      ctx.fillStyle = ink(0.12);
      ctx.fillRect(padL, y - 0.5, trackW, 1);

      const p = Math.min(1, Math.max(0, (lt - s.start) / s.dur));
      if (p <= 0) return;
      const finishing = p > 0.82;
      const done = p >= 1;
      ctx.fillStyle = done
        ? ink(0.32)
        : finishing
          ? "rgba(215, 255, 63, 0.5)"
          : ink(0.42);
      ctx.fillRect(padL, y - 1, trackW * p, 2);
      if (done) {
        ctx.fillStyle = ACCENT;
        ctx.fillRect(padL + trackW - 1.5, y - 3, 3, 6);
      } else {
        ctx.fillStyle = finishing ? ACCENT : ink(0.95);
        ctx.fillRect(padL + trackW * p - 2, y - 3, 4, 6);
      }
    });

    const ms = Math.round((Math.min(lt, raceEnd) / raceEnd) * 840);
    ctx.textBaseline = "alphabetic";
    ctx.font = `600 11px ${MONO}`;
    ctx.textAlign = "right";
    ctx.fillStyle = lt >= raceEnd ? ACCENT : ink(0.7);
    ctx.fillText(`${String(ms).padStart(3, "0")} MS`, w - 16, h - 14);
    ctx.font = `500 9px ${MONO}`;
    ctx.textAlign = "left";
    ctx.fillStyle = ink(0.4);
    ctx.fillText("E2E LATENCY", 14, h - 14);
  });

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      role="img"
      aria-label="Latency Race — STT, LLM and TTS pulses racing against a millisecond counter"
    />
  );
}

/* ---------------------------------- */
/* Dispatcher                         */
/* ---------------------------------- */

const PREVIEWS: Record<LabKind, ComponentType> = {
  cursor: CursorFieldPreview,
  type: GenerativeTypePreview,
  waveform: WaveformStudyPreview,
  vectors: VectorSpacePreview,
  latency: LatencyRacePreview,
};

/** Renders (and runs) a preview only while active. */
export function LabPreview({
  kind,
  active,
}: {
  kind: LabKind;
  active: boolean;
}) {
  if (!active) return null;
  const Preview = PREVIEWS[kind];
  return <Preview />;
}
