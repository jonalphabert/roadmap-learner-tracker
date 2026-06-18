import type { MetadataRoute } from "next";

// Web app manifest — Next.js serves this at /manifest.webmanifest and links it
// automatically from every page. Icons are reused from /public/brand/png.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Compound — Learning roadmaps that track themselves",
    short_name: "Compound",
    description:
      "Self-guided learning roadmaps with progress saved in your browser. No account needed.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8f3",
    theme_color: "#1a7a4f",
    icons: [
      {
        src: "/brand/png/sprout-256.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/png/sprout-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/png/sprout-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
