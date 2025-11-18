// Shared constants and helpers for in-progress gallery

export const MAX_STRIP_IMAGES = 3;

type GallerySource = { src: string; format: "jpg" | "webp" };
type GalleryItem = {
  sources: GallerySource[];
};

/**
 * Extract JPG source from gallery item, falling back to first source
 */
export function getJpgSrc(item: GalleryItem): string {
  const jpg = item.sources.find((s) => s.format === "jpg");
  return jpg?.src || item.sources[0]?.src || "";
}
