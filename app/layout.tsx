import type { Metadata } from "next";

// Self-hosted variable fonts (no external requests, works offline).
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compound — Learning roadmaps that track themselves",
  description:
    "Self-guided learning roadmaps with progress saved in your browser. No account needed. Start with long-term dividend investing.",
  // All brand icons live under /public/brand. Change the paths here if you
  // ever move that folder — nothing else references these files directly.
  icons: {
    icon: [
      { url: "/brand/favicon.ico", sizes: "any" },
      { url: "/brand/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/brand/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
