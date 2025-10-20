// Keep the public locale type tiny and explicit for DX and safety.
export type Locale = "en" | "pt";

// Derive the dictionary shape from the canonical source (English JSON).
// This gives us full key safety like dict.nav.home, dict.hero.title, etc.
export type Dict = typeof import("@/i18n/en.json");

// Central single source of truth for supported locales.
export const SUPPORTED_LOCALES: readonly Locale[] = ["en", "pt"] as const;

// Small, request-scoped cache to avoid repeated dynamic imports per locale.
const cache = new Map<Locale, Dict>();

/**
 * validateLocale
 * Ensures only supported locales pass through.
 * Falls back to 'en' if input is unknown or missing.
 */
export function validateLocale(input: string | null | undefined): Locale {
  const v = (input || "").toLowerCase();
  return (SUPPORTED_LOCALES as readonly string[]).includes(v) ? (v as Locale) : "en";
}

/**
 * getDictionary(locale)
 * Dynamically imports the JSON dictionary for the given locale.
 * - Cached in-memory for the process lifetime (safe for RSC).
 * - Throws with a helpful message if the JSON is missing or malformed.
 *
 * NOTE: The return type is the strongly typed Dict (derived from en.json).
 * If a locale JSON is missing a key, TS will still type-check against Dict,
 * which helps catch drift during development.
 */
export async function getDictionary(locale: Locale): Promise<Dict> {
  if (cache.has(locale)) return cache.get(locale)!;

  try {
    const mod = await import(`@/i18n/${locale}.json`);
    const dict = (mod.default ?? mod) as Dict;
    cache.set(locale, dict);
    return dict;
  } catch (err) {
    if (locale !== "en") {
      const fallback = await getDictionary("en");
      return fallback;
    }
    throw new Error(
      `Missing or invalid dictionary for locale "${locale}". Original error: ${(err as Error).message}`
    );
  }
}

/**
 * t(dict, path, fallback?)
 * Safe, tiny dot-path accessor for nested keys in the dictionary.
 * - Example: t(dict, "hero.title") -> string
 * - Returns fallback (or the path itself) if not found, keeping UI resilient.
 */
export function t<T = unknown>(dict: Dict, path: string, fallback?: T): T {
  if (!path) return (fallback as T);
  const parts = path.split(".");
  let cur: unknown = dict;

  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return (fallback ?? (path as unknown as T)) as T;
    }
  }
  return cur as T;
}
