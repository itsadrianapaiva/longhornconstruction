"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/getDictionary";
import { t as rawT } from "@/lib/i18n/getDictionary";

/**
 * Shape stored in context:
 * - locale: current locale ("en" | "pt")
 * - dict: the loaded dictionary object
 * - t: tiny translator bound to this dict
 */
type I18nValue = {
  locale: Locale;
  dict: Record<string, unknown>;
  t: <T = unknown>(path: string, fallback?: T) => T;
};

// Private context; null when not mounted by the provider.
const I18nContext = createContext<I18nValue | null>(null);

/**
 * I18nProvider
 * Minimal client-side provider that receives the dict from a server parent (layout).
 * We bind `t` to the provided dict so components can call `t("hero.title")` directly.
 */
export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Record<string, unknown>;
  children: ReactNode;
}) {
  // Memoize the value so consumers re-render only when locale/dict change.
  const value: I18nValue = useMemo(
    () => ({
      locale,
      dict,
      t: <T,>(path: string, fallback?: T) => rawT<T>(dict, path, fallback),
    }),
    [locale, dict]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * useI18n
 * Consumer hook with a helpful error if used outside the provider.
 */
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
