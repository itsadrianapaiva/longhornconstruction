import type { Metadata } from "next";
import { headers } from "next/headers";
import { ReactNode } from "react";

import { validateLocale, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/getDictionary";

/**
 * getBaseUrl
 * Returns absolute site URL for canonical/hreflang.
 * Handles:
 * 1) NEXT_PUBLIC_SITE_URL (prod)
 * 2) Request Host (staging/preview)
 * 3) http://localhost:3000 (dev)
 *
 * Note: treat headers() as async to satisfy environments
 * that type it as Promise<ReadonlyHeaders>.
 */
async function getBaseUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (envUrl) return envUrl;

  const h = await headers(); // <-- await fixes TS2339
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? "https";
    return `${proto}://${host}`;
  }
  return "http://localhost:3000";
}

/** Small helper to keep locale-aware roots consistent */
function localePath(locale: Locale): string {
  return `/${locale}`;
}

/**
 * generateMetadata
 * Builds canonical + hreflang alternates for all locales.
 */
export async function generateMetadata(
  { params }: { params: { locale?: string } }
): Promise<Metadata> {
  const locale = validateLocale(params?.locale);
  const base = await getBaseUrl(); // now async-safe

  const languages: Record<string, string> = {};
  for (const l of SUPPORTED_LOCALES) {
    languages[l] = `${base}${localePath(l)}`;
  }

  return {
    metadataBase: new URL(base),
    alternates: {
      canonical: `${base}${localePath(locale)}`,
      languages
    },
    openGraph: {
      url: `${base}${localePath(locale)}`,
      siteName: "CÉU Construction",
      type: "website",
      locale
    },
    twitter: { card: "summary_large_image" }
  };
}

/**
 * RootLayout
 * Sets <html lang> and renders children.
 * We will add an I18nProvider in the next step.
 */
export default function RootLayout(
  { children, params }: { children: ReactNode; params: { locale?: string } }
) {
  const locale = validateLocale(params?.locale);

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
