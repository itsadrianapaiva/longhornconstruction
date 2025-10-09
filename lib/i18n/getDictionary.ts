// Keep the public locale type tiny and explicit for DX and safety.
export type Locale = "en" | "pt";

// Central single source of truth for supported locales.
export const SUPPORTED_LOCALES: readonly Locale[] = ["en", "pt"] as const;

// Small, request-scoped cache to avoid repeated dynamic imports per locale.
// Map key: locale -> dictionary object
const cache = new Map<Locale, Record<string, unknown>>();

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
 */
export async function getDictionary(locale: Locale): Promise<Record<string, unknown>> {
  if (cache.has(locale)) return cache.get(locale)!;

  try {
    // Dynamic import lets us tree-shake and only load what's needed.
    const mod = await import(`@/i18n/${locale}.json`);
    const dict = (mod.default ?? mod) as Record<string, unknown>;

    // Store in the local cache to minimize I/O per request.
    cache.set(locale, dict);
    return dict;
  } catch (err) {
    // Fail safe: if specific locale file is missing, fall back to 'en' once.
    if (locale !== "en") {
      const fallback = await getDictionary("en");
      return fallback;
    }
    // Surface a clear error during development for the default locale.
    throw new Error(`Missing or invalid dictionary for locale "${locale}". Original error: ${(err as Error).message}`);
  }
}

/**
 * t(dict, path, fallback?)
 * Safe, tiny dot-path accessor for nested keys in the dictionary.
 * - Example: t(dict, "hero.title") -> string | unknown
 * - Returns fallback (or the path itself) if not found, keeping UI resilient.
 */
export function t<T = unknown>(
  dict: Record<string, unknown>,
  path: string,
  fallback?: T
): T {
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
