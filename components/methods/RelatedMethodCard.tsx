import type { JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/getDictionary";
import type { MethodSlug } from "@/lib/methods/types";

/**
 * Related method card with vertical thumbnail layout
 * Displays method thumbnail, label, and tag with hover effect
 */
export default function RelatedMethodCard({
  locale,
  slug,
  label,
  tag,
  thumbnailSrc,
}: {
  locale: Locale;
  slug: MethodSlug;
  label: string;
  tag: string;
  thumbnailSrc: string;
}): JSX.Element {
  return (
    <Link
      href={`/${locale}/methods/${slug}`}
      className="group block rounded-xl border border-transparent transition-all duration-200 hover:border-[color:var(--brand)] hover:bg-[color:var(--brand)]/5"
    >
      {/* Thumbnail full width */}
      <div className="overflow-hidden rounded-t-xl">
        <Image
          src={thumbnailSrc}
          alt={label}
          width={480}
          height={260}
          className="h-40 w-full object-cover"
        />
      </div>

      {/* Text content below image */}
      <div className="px-3 pb-3 pt-3">
        <div className="font-medium text-ink group-hover:text-[color:var(--brand)]">
          {label}
        </div>
        <div className="mt-1 text-sm text-ink/70">{tag}</div>
      </div>
    </Link>
  );
}
