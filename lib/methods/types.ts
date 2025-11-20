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
  /**
   * Optional mid-article image group to inject inline after a specific section.
   * Allows editors to insert a pair of related images without touching React code.
   */
  extraImageGroup?: {
    afterSectionId: string; // ID of the section after which to insert images
    images: { index: number; alt: string }[]; // Array of images to display
  };
};
