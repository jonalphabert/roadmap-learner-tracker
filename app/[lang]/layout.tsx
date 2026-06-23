import type { Metadata, Viewport } from "next";

// Self-hosted variable fonts (no external requests, works offline).
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

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
  appleWebApp: {
    capable: true,
    title: "Compound",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1d15" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the saved/preferred theme before paint to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
