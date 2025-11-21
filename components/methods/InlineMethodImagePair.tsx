import type { JSX } from "react";
import Image from "next/image";
import type { MethodSlug } from "@/lib/methods/types";
import { methodImagePath } from "@/lib/methods/images";

/**
 * Inline image pair component for mid-article images
 * Displays two images side by side (stacked on mobile)
 */
export default function InlineMethodImagePair({
  slug,
  images,
}: {
  slug: MethodSlug;
  images: { index: number; alt: string }[];
}): JSX.Element {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {images.map((img) => {
        const imgSrc = methodImagePath(slug, img.index, "lg", "jpg");
        return (
          <div key={img.index} className="overflow-hidden rounded-xl">
            <Image
              src={imgSrc}
              alt={img.alt}
              width={600}
              height={400}
              className="h-auto w-full"
            />
          </div>
        );
      })}
    </div>
  );
}
