"use client";

import { Fragment } from "react";
import { site } from "@/data/site";
import Reveal from "@/components/common/reveal";
import ProjectChapter from "@/components/work/project-chapter";

/**
 * The main event: a vertical exhibition of projects — full-height chapters
 * with alternating layouts, not a card grid.
 */
export default function WorkExhibition() {
  return (
    <section
      id="work"
      className="container-edge relative py-[clamp(6rem,14vh,11rem)]"
    >
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line-soft pb-4">
          <p className="text-meta text-muted">01 / WORK</p>
          <p className="text-meta text-right text-faint">
            SELECTED PROJECTS / 2025—2026
          </p>
        </div>
      </Reveal>

      <h2 className="sr-only">Selected work</h2>

      <div>
        {site.projects.map((project, i) => {
          const next = site.projects[i + 1];
          return (
            <Fragment key={project.slug}>
              <ProjectChapter project={project} position={i} />
              {next && (
                <div aria-hidden className="flex items-center gap-4">
                  <span className="h-px flex-1 bg-line-soft" />
                  <span className="text-meta-sm text-faint">
                    NEXT / {next.index}
                  </span>
                  <span className="h-px w-10 bg-line-soft" />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
