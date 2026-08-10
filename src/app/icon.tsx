import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Generated favicon — minimal dark badge with accent brand typography. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#d7ff3f",
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "monospace",
          borderRadius: 6,
          border: "1px solid rgba(215, 255, 63, 0.4)",
        }}
      >
        D
      </div>
    ),
    { ...size },
  );
}
