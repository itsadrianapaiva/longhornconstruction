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

/**
 * getBaseUrl
 * Absolute site URL for canonical and hreflang.
 * 1) NEXT_PUBLIC_SITE_URL
 * 2) Request Host
 * 3) http://localhost:3000 (dev)
 */
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

/**
 * RootLayout
 * Sets <html lang> and provides i18n to children.
 */
export default async function RootLayout(
  { children, params }: { children: ReactNode; params: { locale?: string } }
) {
  const locale = validateLocale(params?.locale);
  const dict = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <I18nProvider locale={locale} dict={dict}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
