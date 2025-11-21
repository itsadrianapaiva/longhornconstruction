import type { MethodSlug } from "./types";

/**
 * Builds path to optimised method images
 *
 * @param slug - Method identifier (traditional, icf, lsf)
 * @param index - Image number (1, 2, 3, ...)
 * @param size - Image size variant (sm, lg)
 * @param format - Image format (jpg, webp)
 * @returns Path like /media/methods/traditional/1-lg.jpg
 */
export function methodImagePath(
  slug: MethodSlug,
  index: number,
  size: "sm" | "lg",
  format: "jpg" | "webp"
): string {
  return `/media/methods/${slug}/${index}-${size}.${format}`;
}
