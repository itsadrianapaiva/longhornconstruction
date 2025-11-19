/**
 * Shared types for construction method articles
 */

export type MethodSlug = "traditional" | "icf" | "lsf";

export type MethodSection = {
  id: string;
  heading: string;
  body: string[];
  imageIndex?: number; // optional inline image for future use
};

export type MethodArticle = {
  slug: MethodSlug;
  title: string;
  subtitle: string;
  heroImage: {
    index: number; // numeric image index (1, 2, 3, ...)
    alt: string;
  };
  intro: string;
  sections: MethodSection[];
  benefits?: string[];
  related: MethodSlug[];
};
