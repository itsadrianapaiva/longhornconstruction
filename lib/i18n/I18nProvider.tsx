"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale, Dict } from "@/lib/i18n/getDictionary";
import { t as rawT } from "@/lib/i18n/getDictionary";

/**
 * Context value
 * - locale: current locale
 * - dict: strongly typed dictionary (from en.json)
 * - t: tiny translator bound to this dict with good inference
 */
type I18nValue = {
  locale: Locale;
  dict: Dict;
  t: <T = unknown>(path: string, fallback?: T) => T;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dict;
  children: ReactNode;
}) {
  const value: I18nValue = useMemo(
    () => ({
      locale,
      dict,
      // Bind rawT to the provided dict so consumers call t("hero.title")
      t: <T,>(path: string, fallback?: T) => rawT<T>(dict, path, fallback),
    }),
    [locale, dict]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
