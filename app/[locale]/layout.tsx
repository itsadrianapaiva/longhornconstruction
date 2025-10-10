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

// -----------------------------
// SEO base URL helpers
// -----------------------------
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
export async function generateMetadata(
  { params }: { params: { locale?: string } }
): Promise<Metadata> {
  const locale = validateLocale(params?.locale);
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

// -----------------------------
// Nested locale layout (NO <html>/<body> here)
// -----------------------------
export default async function LocaleLayout(
  { children, params }: { children: ReactNode; params: { locale?: string } }
) {
  const locale = validateLocale(params?.locale);
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
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <a href={`/${locale}`} className="font-semibold tracking-tight">
            CÉU Construction
          </a>

          <Suspense fallback={null}>
            <ScrollNav
              topOffset={HEADER_OFFSET}
              className="hidden md:inline-flex"
              items={[
                { id: "hero", label: nav.hero },
                { id: "about", label: nav.about },
                { id: "stats", label: nav.stats },   // Stats before Sismo
                { id: "sismo", label: nav.sismo },
                { id: "projects", label: nav.projects },
                { id: "services", label: nav.services },
                { id: "testimonials", label: nav.testimonials },
                { id: "contact", label: nav.contact },
              ]}
            />
          </Suspense>

          <Suspense fallback={<div className="h-8 w-14 rounded-full bg-zinc-100" />}>
            <LanguageSwitcher compact stripHashOnMount />
          </Suspense>
        </div>
      </header>

      <I18nProvider locale={locale} dict={dict}>
        <main id="content" className="mx-auto max-w-6xl px-4">
          {children}
        </main>
      </I18nProvider>

      <footer className="mx-auto max-w-6xl px-4 py-12 text-sm text-zinc-500">
        © {new Date().getFullYear()} CÉU Construction. All rights reserved.
      </footer>
    </>
  );
}
