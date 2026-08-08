"use client";

import Reveal from "@/components/common/reveal";
import { site } from "@/data/site";

export default function Manifesto() {
  const lines = site.manifesto.headline;

  return (
    <section
      id="philosophy"
      className="container-edge relative py-[clamp(6rem,14vh,11rem)]"
    >
      <Reveal as="p" className="text-meta text-muted">
        07 / PHILOSOPHY
      </Reveal>

      <h2 className="mt-[clamp(2.5rem,6vh,4rem)] max-w-5xl text-[clamp(2.6rem,7vw,6rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
        {lines.map((line, i) => {
          const isFinal = i === lines.length - 1;
          if (!isFinal) {
            return (
              <Reveal key={line} as="span" delay={i * 0.08} className="block">
                {line}
              </Reveal>
            );
          }
          const words = line.split(" ");
          const lastWord = words[words.length - 1];
          const head = words.slice(0, -1).join(" ");
          return (
            <Reveal key={line} as="span" delay={i * 0.08} className="block">
              {head ? `${head} ` : null}
              <span className="font-serif italic font-normal text-accent">
                {lastWord}
              </span>
            </Reveal>
          );
        })}
      </h2>

      <ul className="mt-[clamp(4rem,10vh,7rem)] max-w-3xl">
        {site.manifesto.principles.map((principle, i) => (
          <Reveal
            key={principle.index}
            as="li"
            delay={0.08 + i * 0.08}
            className="grid grid-cols-[3.5rem_1fr] items-baseline gap-6 border-t border-line-soft py-6 md:grid-cols-[6rem_1fr]"
          >
            <span className="text-meta text-accent">{principle.index}</span>
            <p className="text-xl text-ink md:text-2xl">{principle.text}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
