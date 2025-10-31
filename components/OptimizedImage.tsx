/**
 * OptimizedImage
 *
 * A lightweight wrapper around next/image for rendering thumbnail and card images
 * with enforced lazy-loading and async decoding.
 *
 * IMPORTANT: DOWNSIZED ASSET WORKFLOW
 * ────────────────────────────────────
 * Grid thumbnails and card preview images MUST use pre-compressed, downsized assets
 * with a "-sm" naming convention. For example:
 *
 *   Original (full-res):   /public/media/projects/casa-no-alto/1.jpg
 *   Downsized (thumbnail): /public/media/projects/casa-no-alto/1-sm.jpg
 *
 * Target specifications for downsized assets:
 * - Max width: ~1600px
 * - Quality: ~75% JPG or WebP equivalent
 * - File size: under ~200KB each
 *
 * The full-resolution originals remain in the repo for use in modal/lightbox views,
 * where large files are acceptable because:
 *  - They're loaded on demand (not upfront).
 *  - Only one image is shown at a time.
 *  - Users expect detail in a zoomed/expanded view.
 *
 * After updating i18n to point to the downsized "-sm" variants, verify in:
 *   DevTools → Network → Img (with cache disabled)
 * that thumbnails are loading at ~200KB or smaller, not multi-megabyte originals.
 */

import Image from "next/image";

type OptimizedImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: OptimizedImageProps) {
  if (priority) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
