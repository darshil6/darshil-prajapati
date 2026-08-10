import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.personal.name} — ${site.personal.role}`,
    short_name: site.personal.name,
    description:
      "Full Stack AI Engineer building intelligent systems — RAG chatbots, voice agents and AI builder tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
