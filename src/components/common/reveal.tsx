"use client";

import { motion, type Variants } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "span" | "section" | "li" | "p" | "h2" | "h3";
}

/** Scroll-into-view reveal: fade + rise. */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  once = true,
  className,
  as = "div",
}: RevealProps) {
  const Tag = motion[as];
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [...EASE_OUT_EXPO], delay },
    },
  };

  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-12% 0px" }}
    >
      {children}
    </Tag>
  );
}
