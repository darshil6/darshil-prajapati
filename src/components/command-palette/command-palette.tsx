"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";
import { useMediaQuery, usePointerFine } from "@/hooks/use-media-query";
import { useTheme } from "@/components/providers/theme-provider";

type Command =
  | {
      id: string;
      group: "NAVIGATE";
      name: string;
      hint: string;
      kind: "nav";
      hash: string;
    }
  | {
      id: string;
      group: "CONNECT";
      name: string;
      hint: string;
      kind: "link";
      href: string;
    }
  | { id: string; group: "CONNECT"; name: string; hint: string; kind: "copy" }
  | { id: string; group: "SYSTEM"; name: string; hint: string; kind: "theme" };

const GROUPS = ["NAVIGATE", "CONNECT", "SYSTEM"] as const;

const NAV_ITEMS = [
  { name: "Work", hash: "work" },
  { name: "Story", hash: "story" },
  { name: "Lab", hash: "lab" },
  { name: "Notes", hash: "desk" },
  { name: "Contact", hash: "contact" },
];

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

function fuzzyMatch(query: string, text: string) {
  const q = query.toLowerCase().replace(/\s+/g, "");
  if (!q) return true;
  const t = text.toLowerCase().replace(/\s+/g, "");
  if (t.includes(q)) return true;
  let i = 0;
  for (const ch of t) {
    if (ch === q[i]) i += 1;
    if (i === q.length) return true;
  }
  return false;
}

export default function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const pointerFine = usePointerFine();
  const desktop = useMediaQuery("(min-width: 768px)");

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const { theme, toggleTheme } = useTheme();

  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const copyTimer = useRef(0);
  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = NAV_ITEMS.map((n) => ({
      id: `nav-${n.hash}`,
      group: "NAVIGATE",
      name: n.name,
      hint: "SECTION",
      kind: "nav",
      hash: n.hash,
    }));
    const connect: Command[] = site.socials.map((s) => ({
      id: `link-${s.label.toLowerCase().replace(/\s+/g, "-")}`,
      group: "CONNECT",
      name: s.label,
      hint: "LINK",
      kind: "link",
      href: s.href,
    }));
    connect.push({
      id: "copy-email",
      group: "CONNECT",
      name: "Copy email",
      hint: "COPY",
      kind: "copy",
    });
    const system: Command[] = [
      {
        id: "toggle-theme",
        group: "SYSTEM",
        name: theme === "dark" ? "Sunrise — light theme" : "Sunset — dark theme",
        hint: "THEME",
        kind: "theme",
      },
    ];
    return [...nav, ...connect, ...system];
  }, [theme]);

  const filtered = useMemo(
    () => commands.filter((c) => fuzzyMatch(query, `${c.name} ${c.group}`)),
    [commands, query],
  );

  const sections = useMemo(
    () =>
      GROUPS.map((group) => ({
        group,
        items: filtered.filter((c) => c.group === group),
      })).filter((s) => s.items.length > 0),
    [filtered],
  );

  /* Global shortcuts: Cmd/Ctrl+K toggles, "/" opens, Escape closes. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (
        e.key === "/" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !isTypingTarget(e.target)
      ) {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (e.key === "Escape" && openRef.current) {
        /* Topmost layer only: this listener registers at mount, before any
           overlay's open-time listener, so stopping immediate propagation
           keeps one Escape from also closing the nav overlay underneath. */
        e.preventDefault();
        e.stopImmediatePropagation();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Open: reset state, focus input, lock scroll. Close: restore focus. */
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActiveIndex(0);
    setCopyState("idle");
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    /* Take the body scroll lock only if no other layer (preloader, nav
       overlay) already holds it — never restore a stale "hidden". */
    const ownsLock = document.body.style.overflow !== "hidden";
    if (ownsLock) document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      if (ownsLock) document.body.style.overflow = "";
      lastFocused.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  /* Keep highlighted option in view. */
  useEffect(() => {
    if (!open) return;
    const cmd = filtered[activeIndex];
    if (!cmd) return;
    document
      .getElementById(`cp-opt-${cmd.id}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, filtered, open]);

  const goTo = useCallback(
    (hash: string) => {
      setOpen(false);
      /* If the nav overlay is open underneath, dismiss it through its own
         toggle so its state and scroll lock unwind before we scroll. */
      const navToggle = document.querySelector<HTMLButtonElement>(
        'button[aria-controls="nav-overlay"][aria-expanded="true"]',
      );
      navToggle?.click();
      if (pathname === "/") {
        const el = document.getElementById(hash);
        if (el) {
          window.history.pushState(null, "", `/#${hash}`);
          const scroll = () =>
            el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
          if (navToggle) requestAnimationFrame(scroll);
          else scroll();
          return;
        }
      }
      router.push(`/#${hash}`);
    },
    [pathname, reducedMotion, router],
  );

  const onSelect = useCallback(
    (cmd: Command) => {
      if (cmd.kind === "nav") {
        goTo(cmd.hash);
        return;
      }
      if (cmd.kind === "link") {
        if (cmd.href.startsWith("http")) {
          window.open(cmd.href, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = cmd.href;
        }
        setOpen(false);
        return;
      }
      if (cmd.kind === "theme") {
        setOpen(false);
        toggleTheme();
        return;
      }
      const done = (state: "copied" | "failed") => {
        setCopyState(state);
        window.clearTimeout(copyTimer.current);
        copyTimer.current = window.setTimeout(() => setOpen(false), 900);
      };
      const write = navigator.clipboard?.writeText(site.personal.email);
      if (write) {
        write.then(
          () => done("copied"),
          () => done("failed"),
        );
      } else {
        done("failed");
      }
    },
    [goTo, toggleTheme],
  );

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) =>
        filtered.length ? (i + 1) % filtered.length : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        filtered.length ? (i - 1 + filtered.length) % filtered.length : 0,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[activeIndex];
      if (cmd) onSelect(cmd);
    }
  };

  const trapTab = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  const activeId = filtered[activeIndex]
    ? `cp-opt-${filtered[activeIndex].id}`
    : undefined;

  return (
    <>
      {pointerFine && desktop && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-5 right-5 z-40 hidden border border-line bg-bg/80 px-2.5 py-1.5 text-meta-sm text-faint md:block"
        >
          ⌘K
        </div>
      )}

      <AnimatePresence>
        {open && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            data-lenis-prevent
            className="fixed inset-0 z-[70] flex items-start justify-center"
            onKeyDown={trapTab}
          >
            <span role="status" className="sr-only">
              {copyState === "copied"
                ? "Email copied to clipboard"
                : copyState === "failed"
                  ? "Could not copy email"
                  : ""}
            </span>
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="relative mt-[clamp(4rem,16vh,10rem)] w-[calc(100%-2rem)] max-w-lg border border-line bg-surface"
              initial={{ opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: 8,
                scale: 0.99,
                transition: { duration: 0.2 },
              }}
              transition={{ duration: 0.45, ease: [...EASE_OUT_EXPO] }}
            >
              <div className="flex items-center border-b border-line">
                <span
                  aria-hidden="true"
                  className="pl-4 font-mono text-sm text-faint"
                >
                  ›
                </span>
                <input
                  ref={inputRef}
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="cp-list"
                  aria-autocomplete="list"
                  aria-activedescendant={activeId}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="TYPE A COMMAND OR SEARCH…"
                  spellCheck={false}
                  autoComplete="off"
                  className="w-full bg-transparent px-3 py-4 font-mono text-sm text-ink outline-none placeholder:font-mono placeholder:text-xs placeholder:tracking-[0.14em] placeholder:text-faint focus-visible:outline-none"
                />
              </div>

              <div
                id="cp-list"
                role="listbox"
                aria-label="Commands"
                data-lenis-prevent
                className="max-h-[min(50vh,320px)] overflow-y-auto py-1"
              >
                {filtered.length === 0 && (
                  <p className="px-4 py-8 text-center text-meta text-faint">
                    NO RESULTS — TRY &apos;WORK&apos;
                  </p>
                )}

                {sections.map((section) => (
                  <div
                    key={section.group}
                    role="group"
                    aria-labelledby={`cp-group-${section.group}`}
                  >
                    <p
                      id={`cp-group-${section.group}`}
                      className="px-4 pb-1.5 pt-3 text-meta-sm text-faint"
                    >
                      {section.group}
                    </p>
                    {section.items.map((cmd) => {
                      const flatIndex = filtered.indexOf(cmd);
                      const isActive = flatIndex === activeIndex;
                      const rowCopyState =
                        cmd.kind === "copy" ? copyState : "idle";
                      const external =
                        cmd.kind === "link" && cmd.href.startsWith("http");
                      return (
                        <div
                          key={cmd.id}
                          id={`cp-opt-${cmd.id}`}
                          role="option"
                          aria-selected={isActive}
                          data-cursor="link"
                          className={cn(
                            "relative flex min-h-[44px] select-none items-center gap-3 px-4 py-2.5 transition-colors duration-150",
                            isActive ? "bg-surface-2 text-ink" : "text-muted",
                          )}
                          onClick={() => onSelect(cmd)}
                          onMouseMove={() => setActiveIndex(flatIndex)}
                        >
                          {isActive && (
                            <span
                              aria-hidden="true"
                              className="absolute left-0 top-0 h-full w-[2px] bg-accent"
                            />
                          )}
                          <span
                            aria-hidden="true"
                            className={cn(
                              "flex w-4 shrink-0 items-center justify-center font-mono text-[11px]",
                              isActive ? "text-accent" : "text-faint",
                            )}
                          >
                            {external ? (
                              <ArrowUpRight size={12} strokeWidth={1.5} />
                            ) : cmd.kind === "copy" ? (
                              "@"
                            ) : cmd.kind === "theme" ? (
                              "◐"
                            ) : (
                              "→"
                            )}
                          </span>
                          <span className="flex-1 truncate text-sm font-medium">
                            {cmd.name}
                          </span>
                          <span
                            className={cn(
                              "ml-auto text-meta-sm",
                              rowCopyState === "copied"
                                ? "text-accent"
                                : "text-faint",
                            )}
                          >
                            {rowCopyState === "copied"
                              ? "COPIED"
                              : rowCopyState === "failed"
                                ? "FAILED"
                                : cmd.hint}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div
                aria-hidden="true"
                className="flex items-center justify-between border-t border-line px-4 py-2.5"
              >
                <span className="text-meta-sm text-faint">
                  ↑↓ NAVIGATE · ↵ SELECT
                </span>
                <span className="text-meta-sm text-faint">ESC CLOSE</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
