import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.personal.name} — ${site.personal.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generated social-share card — matches the site's dark editorial identity. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          color: "#f4f1ea",
          padding: 72,
          fontFamily: "sans-serif",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 4,
            color: "#8c8c8c",
          }}
        >
          <span>PORTFOLIO / 2026</span>
          <div
            style={{
              display: "flex",
              width: 16,
              height: 16,
              borderRadius: 999,
              backgroundColor: "#d7ff3f",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: -2,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {site.personal.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                display: "flex",
                width: 64,
                height: 4,
                backgroundColor: "#d7ff3f",
              }}
            />
            <div style={{ fontSize: 32, color: "#8c8c8c" }}>
              {site.personal.identityLine.join("  /  ")}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 4,
            color: "#8c8c8c",
          }}
        >
          <span>BASED IN {site.personal.location.toUpperCase()}</span>
          <span style={{ color: "#d7ff3f" }}>
            {site.personal.availability.toUpperCase()}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
