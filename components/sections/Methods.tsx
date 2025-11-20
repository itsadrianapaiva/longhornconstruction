"use client";

import { SectionShell } from "@/components/sections/SectionShell";
import { useI18n } from "@/lib/i18n/I18nProvider";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import Image from "next/image";
import { methodImagePath } from "@/lib/methods/images";
import type { MethodSlug } from "@/lib/methods/types";

type MethodCard = {
  label: string;
  tag: string;
  excerpt: string;
};

type MethodsSection = {
  id: string;
  title: string;
  intro: string;
  seeAllLabel: string;
  cards: {
    traditional: MethodCard;
    icf: MethodCard;
    lsf: MethodCard;
  };
};

// optional separate key in i18n, with "Experts" as fallback
const MESH_SRC = "/media/gradients/mesh1.png";

type MethodCardSize = "square" | "portrait" | "landscape";

const METHOD_CARD_IMAGE_INDEX: Record<MethodSlug, number> = {
  traditional: 2,
  icf: 1,
  lsf: 3,
};

// mesh underline helpers (same behavior as Sismo)
function escapeRegExp(x: string) {
  return x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderWithMeshUnderline(text: string, target: string) {
  if (!text || !target) return text;
  const re = new RegExp(`(${escapeRegExp(target)})`, "i");
  const parts = text.split(re);
  if (parts.length === 1) return text;

  return parts.map((chunk, i) => {
    if (chunk.toLowerCase() === target.toLowerCase()) {
      return (
        <span key={`hl-${i}`} className="relative inline-block">
          <span
            aria-hidden="true"
            className="
              absolute inset-x-0 -bottom-[0.1em] h-[0.08em] -z-10 rounded
              opacity-80 dark:opacity-70 pointer-events-none select-none
              [background-image:url('/media/gradients/mesh1.png')]
              bg-[length:200%_200%] bg-center mix-blend-multiply
            "
            style={{ backgroundImage: `url(${MESH_SRC})` }}
          />
          <span className="relative">{chunk}</span>
        </span>
      );
    }
    return <span key={`t-${i}`}>{chunk}</span>;
  });
}

function MethodCardComponent({
  method,
  href,
  slug,
  featured = false,
  size = "portrait",
  className,
}: {
  method: MethodCard;
  href: string;
  slug: MethodSlug;
  featured?: boolean;
  size?: MethodCardSize;
  className?: string;
}) {
  const imageIndex = METHOD_CARD_IMAGE_INDEX[slug];
  const imageSize = featured ? "lg" : "sm";
  const imageSrc = methodImagePath(slug, imageIndex, imageSize, "jpg");

  // On mobile: all cards share same aspect (same height)
  // On desktop: we switch to the bento-specific aspect ratios
  const baseAspect = "aspect-[4/3]"; // common mobile ratio
  const desktopAspect = featured
    ? "lg:aspect-[16/7]"
    : size === "square"
    ? "lg:aspect-square"
    : size === "portrait"
    ? "lg:aspect-[4/5]"
    : "lg:aspect-[4/3]";
  const aspectClass = `${baseAspect} ${desktopAspect}`;

  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-2xl border border-[color:var(--glass-border-strong)] shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(0,0,0,0.10)] ${className ?? ""}`}
    >
      <div className={`relative flex h-full flex-col ${aspectClass}`}>
        <Image
          src={imageSrc}
          alt={method.label}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-end p-4 lg:p-5">
          <span className="mb-3 inline-block rounded-full bg-[color:var(--glass-bg)] px-3 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-white lg:text-xs">
            {method.tag}
          </span>

          <h3 className="mb-1 text-lg font-bold text-white lg:text-xl">
            {method.label}
          </h3>

          <p className="mb-3 text-[0.7rem] leading-relaxed text-white/90 lg:text-xs">
            {method.excerpt}
          </p>

          <div className="flex items-center text-[0.7rem] font-medium text-white lg:text-xs">
            <span>Learn more</span>
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Methods() {
  const { t, locale } = useI18n();
  const section = t<MethodsSection>("methods.section");
  const { traditional, icf, lsf } = section.cards;

  const highlightTarget = t<string>("methods.highlightWord", "Experts");

  return (
    <SectionShell
      id={section.id}
      pad="lg"
      container
      maxWidth="7xl"
      innerPx
      className="relative bg-[color:var(--sky-700)]"
    >
      <div
        className="
          grid 
          grid-cols-1 
          gap-6 
          lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1fr)] 
          lg:gap-0
        "
      >
        {/* LEFT COLUMN */}
        <div className="flex h-full flex-col items-start gap-4">
          <div className="max-w-4xl">
            <SectionHeader
              title={section.title}
              intro={section.intro}
              className="text-left"
              // Mobile: allow wrapping. Desktop: keep single line.
              titleClassName="text-ink text-center md:text-left whitespace-normal lg:whitespace-nowrap"
              introClassName="text-ink/85 text-center md:text-left max-w-4xl"
              underline={{
                highlightTarget,
                renderEffect: renderWithMeshUnderline,
              }}
            />
          </div>

          <MethodCardComponent
            method={traditional}
            href={`/${locale}/methods/traditional`}
            slug="traditional"
            featured
            size="landscape"
            className="w-full flex-1"
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex h-full flex-col items-center justify-center gap-6">
          <MethodCardComponent
            method={icf}
            href={`/${locale}/methods/icf`}
            slug="icf"
            size="square"
            className="w-full lg:w-[82%] -mt-4"
          />

          <MethodCardComponent
            method={lsf}
            href={`/${locale}/methods/lsf`}
            slug="lsf"
            size="square"
            className="w-full lg:w-[82%]"
          />
        </div>
      </div>
    </SectionShell>
  );
}
