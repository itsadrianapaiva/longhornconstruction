import type { Locale } from "@/lib/i18n/getDictionary";
import type { MethodSlug, MethodArticle } from "./types";

// Import all article content
import { traditionalEn } from "@/content/methods/traditional.en";
import { traditionalPt } from "@/content/methods/traditional.pt";
import { icfEn } from "@/content/methods/icf.en";
import { icfPt } from "@/content/methods/icf.pt";
import { lsfEn } from "@/content/methods/lsf.en";
import { lsfPt } from "@/content/methods/lsf.pt";

// Nested lookup by locale and method slug
const articlesByLocale: Record<Locale, Record<MethodSlug, MethodArticle>> = {
  en: {
    traditional: traditionalEn,
    icf: icfEn,
    lsf: lsfEn,
  },
  pt: {
    traditional: traditionalPt,
    icf: icfPt,
    lsf: lsfPt,
  },
};

/**
 * Retrieves the method article for a given locale and method slug
 *
 * @param locale - User's locale (en, pt)
 * @param slug - Method identifier (traditional, icf, lsf)
 * @returns The localized MethodArticle
 * @throws Error if the combination is invalid (should not happen if params are validated)
 */
export function getMethodArticle(
  locale: Locale,
  slug: MethodSlug
): MethodArticle {
  const localeArticles = articlesByLocale[locale];
  if (!localeArticles) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  const article = localeArticles[slug];
  if (!article) {
    throw new Error(`Invalid method slug: ${slug} for locale: ${locale}`);
  }

  return article;
}
