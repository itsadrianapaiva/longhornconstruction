import { ReactNode } from "react";
import Image from "next/image";
import InnerPageHeader from "@/components/InnerPageHeader";
import type { Locale } from "@/lib/i18n/getDictionary";

type InnerPageHeroShellProps = {
  locale: Locale;
  children: ReactNode;
  /** Minimum height of the hero band. Defaults to "min-h-[40vh]" */
  minHeight?: string;
};

export default function InnerPageHeroShell({
  locale,
  children,
  minHeight = "min-h-[40vh]",
}: InnerPageHeroShellProps) {
  return (
    <section className={`relative w-full overflow-hidden ${minHeight}`}>
      {/* Background video */}
      <div className="absolute inset-0 -z-20">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/media/hero/hero-header-poster.png"
          className="h-full w-full object-cover"
        >
          <source src="/media/hero/sky.webm" type="video/webm" />
          <source src="/media/hero/sky.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Fallback poster image (for browsers that don't support video) */}
      <div className="absolute inset-0 -z-30">
        <Image
          src="/media/hero/hero-header-poster.png"
          alt=""
          fill
          priority={false}
          className="object-cover"
        />
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 -z-10 bg-black/50" />

      {/* Header pinned to top */}
      <InnerPageHeader locale={locale} />

      {/* Page-specific content */}
      <div className="relative z-10 flex items-center justify-center h-full pt-14">
        {children}
      </div>
    </section>
  );
}
