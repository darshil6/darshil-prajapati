"use client";

import { MotionConfig } from "framer-motion";
import SmoothScroll from "./smooth-scroll";
import ThemeProvider from "./theme-provider";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <SmoothScroll>{children}</SmoothScroll>
      </ThemeProvider>
    </MotionConfig>
  );
}
