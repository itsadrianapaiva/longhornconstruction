import { type FC } from "react";
import Image, { type StaticImageData } from "next/image";
import ButtonLink from "@/components/ButtonLink";
import { SectionShell } from "@/components/sections/SectionShell";

type PageCtaBannerProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  backgroundImage: string | StaticImageData;
  backgroundAlt: string;
};

/**
 * PageCtaBanner
 * - Full-bleed CTA banner with background image and dark overlay
 * - Left-aligned text (eyebrow, title, body) with two action buttons
 * - Reusable on any page, receives all content as props
 * - Default usage: inner pages with static image at /public/media/cta/inner-cta.jpeg
 */
export const PageCtaBanner: FC<PageCtaBannerProps> = ({
  eyebrow,
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  backgroundImage,
  backgroundAlt,
}) => {
  const MESH_SRC = "/media/gradients/mesh6.png";

  return (
    <SectionShell
      id="page-cta"
      pad="lg"
      container
      maxWidth="7xl"
      innerPx
      className="relative"
    >
      {/* Rounded container with background image */}
      <div className="relative w-full overflow-hidden rounded-3xl">
        {/* Background image layer */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt={backgroundAlt}
            fill
            priority={false}
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover scale-x-[-1]
"
          />
        </div>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Foreground content */}
        <div className="relative mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            {/* Left column: text and buttons */}
            <div className="w-full space-y-6 lg:w-1/2">
              {/* Eyebrow */}
              {eyebrow ? (
                <p className="text-sm font-medium uppercase tracking-wide text-white/90">
                  {eyebrow}
                </p>
              ) : null}

              {/* Title */}
              <h2 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {title}
              </h2>

              {/* Body */}
              {body ? (
                <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                  {body}
                </p>
              ) : null}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                {/* Primary button with mesh background */}
                <a
                  href={primaryHref}
                  className="
                    relative inline-flex items-center justify-center
                    rounded-full px-6 py-3 text-sm font-semibold
                    text-white/90
                    shadow-[0_6px_20px_rgba(0,0,0,0.3)]
                    border border-[color:var(--brand-border)]
                    focus:outline-none focus-visible:ring-2
                    focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-0
                    transition-transform duration-200
                    hover:-translate-y-0.5 hover:text-white
                    motion-reduce:transform-none motion-reduce:transition-none
                    overflow-hidden
                    bg-center bg-cover
                  "
                  style={{ backgroundImage: `url(${MESH_SRC})` }}
                >
                  {/* Contrast veil for readability */}
                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none absolute inset-0 rounded-full
                      bg-white/14 dark:bg-black/18
                      mix-blend-normal
                    "
                  />
                  {/* Inner highlight for glassy feel */}
                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none absolute inset-0 rounded-full
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]
                    "
                  />
                  <span className="relative">{primaryLabel}</span>
                </a>

                {/* Secondary button (ghost style) */}
                {secondaryHref && secondaryLabel ? (
                  <ButtonLink href={secondaryHref} className="text-white/90 hover:text-white">
                    {secondaryLabel}
                  </ButtonLink>
                ) : null}
              </div>
            </div>

            {/* Right column: reserved for future content (e.g., phone mockup) */}
            <div className="hidden w-full lg:flex lg:w-1/2 lg:justify-end" />
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

export type { PageCtaBannerProps };

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  USAGE EXAMPLE
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Example usage in an inner page server component:

  import { PageCtaBanner } from "@/components/sections/PageCtaBanner";
  import { getDictionary } from "@/lib/i18n/getDictionary";
  import type { Locale } from "@/lib/i18n/types";

  type PageProps = { params: { locale: Locale } };

  export default async function MethodPage({ params }: PageProps) {
    const dict = await getDictionary(params.locale);
    const cta = dict.cta.innerBanner;

    return (
      <>
        {/* ...existing page content... *\/}

        <PageCtaBanner
          eyebrow={cta.eyebrow}
          title={cta.title}
          body={cta.body}
          primaryHref={`/${params.locale}/contact`}
          primaryLabel={cta.primaryLabel}
          secondaryHref={`/${params.locale}/#projects`}
          secondaryLabel={cta.secondaryLabel}
          backgroundImage="/media/cta/inner-cta.JPEG"
          backgroundAlt={cta.backgroundAlt}
        />
      </>
    );
  }

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  USAGE NOTES
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Contact form now has its own dedicated page at /${locale}/contact.
  Always use primaryHref={`/${locale}/contact`} to link to the contact page.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
