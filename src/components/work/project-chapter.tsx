"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/common/reveal";
import ProjectVisual from "@/components/work/project-visual";
import { usePointerFine } from "@/hooks/use-media-query";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";
import type { Project } from "@/data/types";

interface ProjectChapterProps {
  project: Project;
  position: number;
}

const SPRING = { stiffness: 180, damping: 20, mass: 0.35 };

/**
 * One full-height exhibition chapter: giant stroked index, meta column,
 * oversized title and a scroll-choreographed visual linking to the case study.
 */
export default function ProjectChapter({
  project,
  position,
}: ProjectChapterProps) {
  const chapterRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const fine = usePointerFine();
  const flipped = position % 2 === 1;

  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ["start end", "end start"],
  });
  const visualScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const visualY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const hoverX = useSpring(mx, SPRING);
  const hoverY = useSpring(my, SPRING);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!fine || reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(Math.max(-10, Math.min(10, px * 20)));
    my.set(Math.max(-10, Math.min(10, py * 20)));
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const metaRows = [
    { label: "Category", value: project.category },
    { label: "Year", value: project.year },
    { label: "Role", value: project.role },
  ];

  const textCol = flipped
    ? "lg:col-span-5 lg:col-start-8"
    : "lg:col-span-5 lg:col-start-1";

  return (
    <article
      ref={chapterRef}
      className="group relative grid min-h-[90vh] grid-cols-1 content-center gap-y-10 py-[clamp(3.5rem,9vh,6rem)] lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:gap-x-10 lg:gap-y-9"
    >
      {/* Meta + title */}
      <div className={cn("order-1 lg:row-start-1 lg:self-end", textCol)}>
        <Reveal y={20}>
          <dl className="border-b border-line-soft">
            {metaRows.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-6 border-t border-line-soft py-2.5"
              >
                <dt className="text-meta text-faint">{row.label}</dt>
                <dd className="text-meta text-right text-ink/80">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-meta-sm mt-3 text-faint">
            {project.stack.join(" · ")}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-8 lg:mt-10">
          <h3 className="text-[clamp(2rem,5vw,4.2rem)] font-extrabold uppercase leading-[0.95] tracking-tight transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">
            {project.title}
          </h3>
          <p className="mt-4 max-w-md leading-relaxed text-muted">
            {project.oneLiner}
          </p>
        </Reveal>
      </div>

      {/* Visual */}
      <div
        className={cn(
          "relative order-2 lg:row-span-2 lg:row-start-1 lg:self-center",
          flipped ? "lg:col-span-7 lg:col-start-1" : "lg:col-span-7 lg:col-start-6",
        )}
      >
        <Reveal
          as="span"
          delay={0.16}
          y={22}
          className={cn(
            "text-stroke pointer-events-none absolute -top-[0.38em] z-10 block select-none font-extrabold leading-none tracking-tight text-[clamp(5rem,14vw,11rem)]",
            flipped ? "-right-[0.06em]" : "-left-[0.06em]",
          )}
        >
          <span aria-hidden>{project.index}</span>
        </Reveal>

        <Link
          href={`/work/${project.slug}`}
          aria-label={`View case study: ${project.title}`}
          data-cursor="view"
          data-cursor-label="VIEW CASE STUDY"
          className="block"
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          <motion.div
            style={reduce ? undefined : { x: hoverX, y: hoverY }}
            whileHover={fine && !reduce ? { scale: 1.015 } : undefined}
            transition={{ duration: 0.6, ease: [...EASE_OUT_EXPO] }}
            className="relative overflow-hidden border border-line bg-surface"
          >
            <motion.div style={reduce ? undefined : { scale: visualScale, y: visualY }}>
              <ProjectVisual
                visual={project.visual}
                hue={project.hue}
                title={project.title}
                className="aspect-[16/10] border-0"
              />
            </motion.div>
          </motion.div>
        </Link>
      </div>

      {/* Enter link */}
      <div className={cn("order-3 lg:row-start-2 lg:self-start", textCol)}>
        <Reveal delay={0.12} y={16}>
          <Link
            href={`/work/${project.slug}`}
            className="group/enter text-meta inline-flex min-h-11 items-center gap-2 text-muted transition-colors duration-300 hover:text-ink focus-visible:text-ink"
          >
            <span className="link-underline">Enter project</span>
            <ArrowUpRight
              aria-hidden
              className="h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/enter:translate-x-0.5 group-hover/enter:-translate-y-0.5 group-focus-visible/enter:translate-x-0.5 group-focus-visible/enter:-translate-y-0.5"
            />
          </Link>
        </Reveal>
      </div>
    </article>
  );
}
