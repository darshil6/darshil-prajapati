"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/utils";

const WHISPERS = ["YOU'RE EARLY.", "STILL HERE? GOOD."];
const WHISPER_KEY = "dp:whispered";

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el || !el.tagName) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
}

export default function EasterEggs() {
  const [secretOpen, setSecretOpen] = useState(false);
  const [whisper, setWhisper] = useState<string | null>(null);
  const [voiceMode, setVoiceMode] = useState(false);

  const clicks = useRef<number[]>([]);
  const buffer = useRef("");
  const voiceTimer = useRef(0);
  const secretRef = useRef<HTMLButtonElement>(null);

  /* 1. Five logo clicks within 3s → secret takeover. */
  useEffect(() => {
    const onLogoClick = () => {
      const now = performance.now();
      clicks.current = [
        ...clicks.current.filter((t) => now - t < 3000),
        now,
      ];
      if (clicks.current.length >= 5) {
        clicks.current = [];
        setSecretOpen(true);
      }
    };
    window.addEventListener("logo-click", onLogoClick);
    return () => window.removeEventListener("logo-click", onLogoClick);
  }, []);

  /* Secret open: Escape dismisses, scroll locks, focus moves in. */
  useEffect(() => {
    if (!secretOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSecretOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // Ownership-guarded lock (see nav-overlay): never restore a saved value.
    const ownsLock = document.body.style.overflow !== "hidden";
    if (ownsLock) document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => secretRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      if (ownsLock) document.body.style.overflow = "";
      cancelAnimationFrame(raf);
    };
  }, [secretOpen]);

  /* 2. Idle whisper after 45s, once per session. */
  useEffect(() => {
    let seen = false;
    try {
      seen = !!window.sessionStorage.getItem(WHISPER_KEY);
    } catch {
      /* storage unavailable */
    }
    if (seen) return;
    let hide = 0;
    const show = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(WHISPER_KEY, "1");
      } catch {
        /* storage unavailable */
      }
      setWhisper(WHISPERS[Date.now() % WHISPERS.length]);
      hide = window.setTimeout(() => setWhisper(null), 6000);
    }, 45000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  /* 3. Konami-lite: typing "voice" outside inputs. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key?.length !== 1) return;
      if (isTypingTarget(e.target)) return;
      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-5);
      if (buffer.current === "voice") {
        buffer.current = "";
        setVoiceMode(true);
        window.clearTimeout(voiceTimer.current);
        voiceTimer.current = window.setTimeout(
          () => setVoiceMode(false),
          4000,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(voiceTimer.current);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {secretOpen && (
          <motion.button
            ref={secretRef}
            type="button"
            aria-label="Return to the site"
            onClick={() => setSecretOpen(false)}
            data-lenis-prevent
            className="fixed inset-0 z-[90] grid w-full place-items-center bg-bg text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="container-edge block">
              <span className="block text-[clamp(2rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-tight text-ink">
                YOU FOUND THE SECRET.
              </span>
              <span className="mt-5 block font-serif text-[clamp(1.1rem,2.2vw,1.5rem)] italic text-muted">
                {"Now we're both procrastinating."}
              </span>
              <span className="mt-10 block text-meta-sm text-faint">
                CLICK ANYWHERE TO RETURN
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {whisper && (
          <motion.p
            aria-hidden="true"
            className="pointer-events-none fixed bottom-5 left-5 z-40 text-meta-sm text-faint"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [...EASE_OUT_EXPO] }}
          >
            {whisper}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {voiceMode && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed bottom-6 left-1/2 z-40 flex items-center gap-2.5 border border-line bg-surface px-3.5 py-2"
            style={{ x: "-50%" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.5, ease: [...EASE_OUT_EXPO] }}
          >
            <span className="size-1.5 animate-pulse-dot rounded-full bg-accent" />
            <span className="text-meta-sm text-muted">
              VOICE MODE: LISTENING…
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
