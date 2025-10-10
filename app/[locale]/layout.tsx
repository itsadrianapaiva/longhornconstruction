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
import LanguageSwitcher from "@/components/LanguageSwitcher";

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

  return (
    <div>
      <header className="absolute left-0 top-3 z-[9999] w-full bg-transparent">
        <div className="container flex h-10 items-center justify-start ml-10">
          {/* Bravera-style: only language toggle visible; no solid background */}
          <div className="lang-toggle">
            <LanguageSwitcher compact stripHashOnMount />
          </div>
        </div>
      </header>

      {/* Content area on the chosen surface */}
      <I18nProvider locale={locale} dict={dict}>
        <main id="content">{children}</main>
      </I18nProvider>

      {/* Footer stays on the same surface; typography uses page ink */}
      <footer className="container py-12 text-sm opacity-80">
        © {new Date().getFullYear()} CÉU Construction. All rights reserved.
      </footer>
    </div>
  );
}
