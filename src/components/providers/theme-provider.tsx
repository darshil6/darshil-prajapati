"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ThemeTransition from "@/components/effects/theme-transition";

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  transitioning: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  transitioning: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const STORAGE_KEY = "dp:theme";
/** Palette flips under the peak of the veil/wash. */
const FLIP_MS = 850;
/** Full sun pass — keep in sync with ThemeTransition's DURATION. */
const TOTAL_MS = 1800;

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("dark");
  // Target theme while the sun animation is in flight, else null.
  const [anim, setAnim] = useState<Theme | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    // The pre-hydration script in layout.tsx has already stamped the attribute.
    if (document.documentElement.dataset.theme === "light") setTheme("light");
    const pending = timers.current;
    return () => {
      pending.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const apply = useCallback((t: Theme) => {
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // storage unavailable — theme still applies for this visit
    }
    setTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    if (anim) return;
    const to: Theme = theme === "dark" ? "light" : "dark";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(to);
      return;
    }
    setAnim(to);
    // The flip itself is instant — it happens behind the overlay's near-opaque
    // veil peak, so no page-wide color transition (and no repaint storm).
    timers.current.push(window.setTimeout(() => apply(to), FLIP_MS));
    timers.current.push(
      window.setTimeout(() => {
        setAnim(null);
        timers.current.length = 0;
      }, TOTAL_MS),
    );
  }, [anim, theme, apply]);

  return (
    <ThemeContext.Provider value={{ theme, transitioning: anim !== null, toggleTheme }}>
      {children}
      <ThemeTransition target={anim} />
    </ThemeContext.Provider>
  );
}
