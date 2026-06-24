import type { Metadata, Viewport } from "next";

// Self-hosted variable fonts (no external requests, works offline).
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/jetbrains-mono";
import "../globals.css";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { ThemeSync } from "@/components/theme-sync";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { locales, asLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

// Pre-render one HTML shell per locale at build time.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const localizedMeta: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Compound — Learning roadmaps that track themselves",
    description:
      "Self-guided learning roadmaps with progress saved in your browser. No account needed. Start with long-term dividend investing.",
  },
  id: {
    title: "Compound — Roadmap belajar yang melacak dirinya sendiri",
    description:
      "Roadmap belajar mandiri dengan progres tersimpan di peramban Anda. Tanpa akun. Mulai dengan investasi dividen jangka panjang.",
  },
};

export function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Metadata {
  const meta = localizedMeta[asLocale(params.lang)];
  return {
    title: meta.title,
    description: meta.description,
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
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1d15" },
  ],
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const lang = asLocale(params.lang);

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Applies the saved/preferred theme before paint to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <ThemeSync />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
