/* -------------------------------
   STYLE SYSTEM NOTES (unchanged)
   --------------------------------
   Surface model:
   - Global default surface is set on <body> in app/layout.tsx using
     className="surface-light" or "surface-dark".

-------------------------------- */

import type { Metadata } from "next";
import { headers } from "next/headers";
import { ReactNode } from "react";

import {
  getDictionary,
  validateLocale,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/i18n/getDictionary";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import HeaderShell from "@/components/HeaderShell";
import type { NavItem } from "@/components/NavMenu";
import Footer from "@/components/sections/Footer";

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
  const { locale: raw } = await params;
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

  // Build drawer items from i18n dict → section ids
  // Prod will have only the MVP sections for fast launch
  const items: NavItem[] = [
    { id: "hero", label: dict.nav.home },
    { id: "about", label: dict.nav.about },
    { id: "stats", label: dict.nav.stats },
    { id: "services", label: dict.nav.services },
    { id: "projects", label: dict.nav.projects },
    { id: "methods", label: dict.nav.sismo },
    { id: "testimonials", label: dict.nav.testimonials },
    // faq is optional later; keep order consistent with IA
    { id: "contact", label: dict.nav.contact },
  ].filter(Boolean) as NavItem[]; // defensively narrow in case some keys are missing

  return (
    // Guard: never allow children to widen the viewport
    <div className="relative min-h-dvh w-full overflow-x-clip">
      <I18nProvider locale={locale} dict={dict}>
        <HeaderShell
          locale={locale}
          items={items}
          className="top-3"
          ctaLabel={dict.hero.primaryCta}
          logoSrc="/media/logo-white.png"
          logoAlt="CÉU Construction"
        />
        <main id="content" className="w-full overflow-x-clip">
          {children}
        </main>
        <Footer />
      </I18nProvider>
    </div>
  );
}
