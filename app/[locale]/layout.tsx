/* -------------------------------
   STYLE SYSTEM NOTES
   --------------------------------
   Surface model:
   - Global default surface is set on <body> in app/layout.tsx using
     className="surface-light" or "surface-dark".
   - No per-locale override is applied here to keep code minimal.

   Hero mask:
   - The Hero bottom fade uses .mask-fade-b to transition into hsl(var(--page-bg)),
     which comes from the body surface in app/layout.tsx.

   Buttons:
   - <a class="btn btn-solid"> for the darker blue CTA (Bravera style).
   - <a class="btn btn-glass"> for the glass secondary CTA.
   - Internals live in globals.css; Tailwind adds a .btn skeleton.

   Header / Nav / Language toggle:
   - .header-shell for sticky, blurred glass header
   - .nav-list for horizontal nav spacing
   - .lang-toggle for the language switch visual shell
   -------------------------------- */

import type { Metadata } from "next";
import { headers } from "next/headers";
import { ReactNode, Suspense } from "react";

import {
  getDictionary,
  validateLocale,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/i18n/getDictionary";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ScrollNav from "@/components/ScrollNav";

async function getBaseUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (envUrl) return envUrl;

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? "https";
    return `${proto}://${host}`;
  }
  return "http://localhost:3000";
}

function localePath(locale: Locale): string {
  return `/${locale}`;
}

/** Canonical and hreflang per locale */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params; // ✅ await params
  const locale = validateLocale(raw);
  const base = await getBaseUrl();

  const languages: Record<string, string> = {};
  for (const l of SUPPORTED_LOCALES) {
    languages[l] = `${base}${localePath(l)}`;
  }

  return {
    metadataBase: new URL(base),
    alternates: {
      canonical: `${base}${localePath(locale)}`,
      languages,
    },
    openGraph: {
      url: `${base}${localePath(locale)}`,
      siteName: "CÉU Construction",
      type: "website",
      locale,
    },
    twitter: { card: "summary_large_image" },
  };
}

/** Nested locale layout (no <html>/<body> here) */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale: raw } = await params;
  const locale = validateLocale(raw);
  const dict = await getDictionary(locale);

  type NavKey =
    | "hero"
    | "about"
    | "stats"
    | "sismo"
    | "projects"
    | "services"
    | "testimonials"
    | "contact";
  type DictWithNav = { nav?: Partial<Record<NavKey, string>> };

  const d = dict as DictWithNav;
  const tNav = (k: NavKey, fallback: string) => d.nav?.[k] ?? fallback;

  const nav = {
    hero: tNav("hero", "Hero"),
    about: tNav("about", "About"),
    stats: tNav("stats", "Stats"),
    sismo: tNav("sismo", "Sismo"),
    projects: tNav("projects", "Projects"),
    services: tNav("services", "Services"),
    testimonials: tNav("testimonials", "Testimonials"),
    contact: tNav("contact", "Contact"),
  };

  const HEADER_OFFSET = 64;


  return (
    <div>
      {/* Glassy, sticky header */}
      <header className="header-shell">
        <div className="container flex h-16 items-center justify-between gap-3">
          <a
            href={`/${locale}`}
            className="font-heading text-sm font-semibold tracking-tight"
            aria-label="CÉU Construction home"
          >
            CÉU Construction
          </a>

          <Suspense fallback={null}>
            <ScrollNav
              topOffset={HEADER_OFFSET}
              className="nav-list hidden md:flex"
              items={[
                { id: "hero", label: nav.hero },
                { id: "about", label: nav.about },
                { id: "stats", label: nav.stats },
                { id: "sismo", label: nav.sismo },
                { id: "projects", label: nav.projects },
                { id: "services", label: nav.services },
                { id: "testimonials", label: nav.testimonials },
                { id: "contact", label: nav.contact },
              ]}
            />
          </Suspense>

          <Suspense
            fallback={
              <div className="h-8 w-14 rounded-full bg-[hsl(var(--glass-bg)/0.10)]" />
            }
          >
            <div className="lang-toggle">
              <LanguageSwitcher compact stripHashOnMount />
            </div>
          </Suspense>
        </div>
      </header>

      {/* Content area on the chosen surface */}
      <I18nProvider locale={locale} dict={dict}>
        <main id="content" className="container">
          {children}
        </main>
      </I18nProvider>

      {/* Footer stays on the same surface; typography uses page ink */}
      <footer className="container py-12 text-sm opacity-80">
        © {new Date().getFullYear()} CÉU Construction. All rights reserved.
      </footer>
    </div>
  );
}
