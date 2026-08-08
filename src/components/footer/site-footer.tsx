"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/common/magnetic";
import Reveal from "@/components/common/reveal";
import { site } from "@/data/site";

const SERIF_WORD = "REMEMBERING";

export default function SiteFooter() {
  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer
      role="contentinfo"
      className="container-edge relative z-10 pt-[clamp(6rem,14vh,11rem)]"
    >
      <h2 className="max-w-6xl text-[clamp(2.8rem,9vw,7.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
        {site.footer.headline.map((line, i) => (
          <Reveal key={line} as="span" delay={i * 0.08} className="block">
            {line.split(" ").map((word, wi, words) => (
              <span
                key={`${word}-${wi}`}
                className={
                  word.startsWith(SERIF_WORD)
                    ? "font-serif italic font-normal"
                    : undefined
                }
              >
                {word}
                {wi < words.length - 1 ? " " : null}
              </span>
            ))}
          </Reveal>
        ))}
      </h2>

      <Reveal
        delay={0.2}
        className="mt-[clamp(4rem,8vh,6rem)] flex flex-wrap items-center gap-x-10 gap-y-4"
      >
        {site.socials.map((social) => {
          const isMail = social.href.startsWith("mailto:");
          return (
            <a
              key={social.label}
              href={social.href}
              {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className="link-underline text-meta text-muted transition-colors duration-300 hover:text-ink"
            >
              {social.label}
              <ArrowUpRight
                size={12}
                aria-hidden="true"
                className="ml-1 inline-block align-[-1px]"
              />
            </a>
          );
        })}
      </Reveal>

      <div className="mt-[clamp(3rem,7vh,5rem)] flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line py-6 text-meta-sm text-faint">
        <p>© 2026 {site.personal.name}</p>
        <p>Designed + built by {site.personal.name}</p>
        <Magnetic className="inline-block">
          <button
            type="button"
            aria-label="Back to top"
            onClick={scrollToTop}
            className="inline-flex min-h-[44px] items-center gap-2 text-meta-sm text-faint transition-colors duration-300 hover:text-accent"
          >
            Back to top
            <ArrowUp size={12} aria-hidden="true" />
          </button>
        </Magnetic>
        <p>23.0225° N / 72.5714° E</p>
      </div>
    </footer>
  );
}
