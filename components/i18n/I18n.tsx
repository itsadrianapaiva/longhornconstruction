// components/i18n/I18n.tsx
// Purpose: SSR-stable locale + dictionary via Context, plus a tiny hook.
// Server passes { locale, dict } once; client sections just use useI18n().

"use client";

import React, { createContext, useContext } from "react";

/** Keep types small and reusable */
export type Locale = "en" | "pt";
export type Dict = Record<string, unknown>;

type I18nValue = {
  locale: Locale;
  dict: Dict;
};

const I18nContext = createContext<I18nValue | null>(null);

/** Provider: value is serializable (plain objects), so no hydration issues */
export function I18nProvider({
  value,
  children,
}: {
  value: I18nValue;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Hook: consume locale + dict anywhere (sections, buttons, etc.) */
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}

/** Optional helper: safe getter by path like "footer.company.legalName" */
export function get<T = unknown>(root: unknown, path: string, fallback?: T): T {
  if (!root) return fallback as T;
  const out = path.split(".").reduce<unknown>((acc, key) => {
    if (
      acc &&
      typeof acc === "object" &&
      key in (acc as Record<string, unknown>)
    ) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, root);
  return (out ?? (fallback as T)) as T;
}
