import type { ProjectVisual as VisualKind } from "@/data/types";
import { cn } from "@/lib/utils";

interface ProjectVisualProps {
  visual: VisualKind;
  hue: number;
  title: string;
  className?: string;
}

/** Deterministic pseudo-random from an index — stable across SSR/hydration. */
const r = (n: number) => Math.round(n * 100) / 100;

const pr = (i: number, salt = 1) => {
  const v = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return r(v - Math.floor(v));
};

/**
 * Generated placeholder composition — abstract, geometric, code-drawn.
 * Swap for real project media later by replacing this component's usage.
 */
export default function ProjectVisual({
  visual,
  hue,
  title,
  className,
}: ProjectVisualProps) {
  const tint = `hsl(${hue} 90% 62%)`;
  const tintSoft = `hsla(${hue}, 90%, 62%, 0.12)`;

  return (
    <div
      role="img"
      aria-label={`Generated visual composition for ${title}`}
      className={cn(
        // plate-dark: visuals stay dark figures in both themes
        "plate-dark relative overflow-hidden border border-line bg-surface",
        className,
      )}
      style={{
        backgroundImage: `radial-gradient(120% 90% at 80% 0%, ${tintSoft}, transparent 55%)`,
      }}
    >
      {/* faint inner grid */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* corner metadata */}
      <span className="text-meta-sm absolute left-4 top-4 text-muted">
        FIG. {visual.toUpperCase()}
      </span>
      <span
        className="text-meta-sm absolute right-4 top-4"
        style={{ color: tint }}
      >
        ●
      </span>
      <span className="text-meta-sm absolute bottom-4 left-4 text-faint">
        {`23.0225° N / 72.5714° E`}
      </span>

      <svg
        viewBox="0 0 800 500"
        className="relative block h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {visual === "builder" && (
          <g>
            {[0, 1, 2].map((col) => (
              <g key={col} transform={`translate(${140 + col * 190}, 90)`}>
                <rect
                  width="160"
                  height={r(230 + pr(col) * 90)}
                  fill="rgba(255,255,255,0.03)"
                  stroke="rgba(255,255,255,0.14)"
                />
                <rect x="16" y="18" width="70" height="8" fill={tint} opacity="0.85" />
                {[0, 1, 2, 3].map((row) => (
                  <rect
                    key={row}
                    x="16"
                    y={44 + row * 26}
                    width={r(128 - pr(col * 4 + row) * 60)}
                    height="6"
                    fill="rgba(244,241,234,0.28)"
                  />
                ))}
                <rect
                  x="16"
                  y="170"
                  width="128"
                  height={r(40 + pr(col, 7) * 40)}
                  fill="none"
                  stroke={`hsla(${hue}, 90%, 62%, 0.5)`}
                  strokeDasharray="4 4"
                />
              </g>
            ))}
            <line x1="300" y1="200" x2="330" y2="200" stroke={tint} strokeWidth="1.5" />
            <line x1="490" y1="240" x2="520" y2="240" stroke={tint} strokeWidth="1.5" />
          </g>
        )}

        {visual === "chat" && (
          <g>
            {[0, 1, 2, 3, 4].map((i) => {
              const mine = i % 2 === 1;
              const w = r(180 + pr(i) * 160);
              return (
                <g key={i} transform={`translate(${r(mine ? 780 - w - 60 : 60)}, ${70 + i * 78})`}>
                  <rect
                    width={w}
                    height="52"
                    rx="2"
                    fill={mine ? tintSoft : "rgba(255,255,255,0.045)"}
                    stroke={mine ? `hsla(${hue},90%,62%,0.45)` : "rgba(255,255,255,0.14)"}
                  />
                  <rect x="14" y="16" width={r(w * 0.6)} height="6" fill="rgba(244,241,234,0.35)" />
                  <rect x="14" y="32" width={r(w * 0.38)} height="6" fill="rgba(244,241,234,0.18)" />
                </g>
              );
            })}
            <circle cx="700" cy="88" r="5" fill={tint} />
            <text x="640" y="52" fill="rgba(244,241,234,0.4)" fontSize="11" fontFamily="monospace" letterSpacing="2">
              RAG:ON
            </text>
          </g>
        )}

        {visual === "voice" && (
          <g>
            {Array.from({ length: 64 }).map((_, i) => {
              const h = r(12 + pr(i) * 150 * (1 - Math.abs(i - 32) / 40));
              return (
                <rect
                  key={i}
                  x={r(60 + i * 10.6)}
                  y={r(250 - h / 2)}
                  width="4"
                  height={h}
                  fill={i > 24 && i < 44 ? tint : "rgba(244,241,234,0.3)"}
                  opacity={i > 24 && i < 44 ? 0.9 : 0.6}
                />
              );
            })}
            <line x1="60" y1="250" x2="738" y2="250" stroke="rgba(255,255,255,0.1)" />
            <text x="60" y="380" fill="rgba(244,241,234,0.4)" fontSize="11" fontFamily="monospace" letterSpacing="2">
              STT → LLM → TTS
            </text>
            <text x="60" y="400" fill={tint} fontSize="11" fontFamily="monospace" letterSpacing="2">
              00:00:412
            </text>
          </g>
        )}

        {visual === "audio" && (
          <g>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle
                key={i}
                cx="400"
                cy="250"
                r={40 + i * 34}
                fill="none"
                stroke={i === 2 ? `hsla(${hue},90%,62%,0.6)` : "rgba(244,241,234,0.12)"}
                strokeWidth={i === 2 ? 1.5 : 1}
                strokeDasharray={i % 2 === 0 ? "1 6" : undefined}
              />
            ))}
            <circle cx="400" cy="250" r="10" fill={tint} />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const r1 = 108;
              return (
                <line
                  key={i}
                  x1={r(400 + Math.cos(a) * r1)}
                  y1={r(250 + Math.sin(a) * r1)}
                  x2={r(400 + Math.cos(a) * (r1 + 8 + pr(i) * 26))}
                  y2={r(250 + Math.sin(a) * (r1 + 8 + pr(i) * 26))}
                  stroke="rgba(244,241,234,0.4)"
                />
              );
            })}
          </g>
        )}

        {visual === "reviews" && (
          <g>
            {[0, 1, 2].map((row) => (
              <g key={row} transform={`translate(80, ${80 + row * 120})`}>
                {[0, 1, 2, 3, 4].map((s) => (
                  <path
                    key={s}
                    transform={`translate(${s * 30}, 0) scale(0.9)`}
                    d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17l-6.1 3.6 1.4-6.8L2.2 9.1l6.9-.8z"
                    fill={s < 4 - row ? tint : "none"}
                    stroke={s < 4 - row ? "none" : "rgba(244,241,234,0.25)"}
                  />
                ))}
                <rect x="200" y="4" width={280 - row * 40} height="7" fill="rgba(244,241,234,0.3)" />
                <rect x="200" y="22" width={340 - row * 60} height="7" fill="rgba(244,241,234,0.14)" />
                <rect
                  x="200"
                  y="46"
                  width={230}
                  height="30"
                  fill="none"
                  stroke={`hsla(${hue},90%,62%,0.5)`}
                  strokeDasharray="4 4"
                />
                <text x="212" y="65" fill={tint} fontSize="11" fontFamily="monospace" letterSpacing="2">
                  AI DRAFT
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
