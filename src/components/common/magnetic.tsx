"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePointerFine } from "@/hooks/use-media-query";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

/** Element gently follows the cursor while hovered. No-op on touch. */
export default function Magnetic({
  children,
  strength = 0.25,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = usePointerFine();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (!fine || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={fine ? { x: sx, y: sy } : undefined}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}
