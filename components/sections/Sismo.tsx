"use client";

import Image from "next/image";
import { SectionShell } from "@/components/sections/SectionShell";
import ButtonLink from "@/components/ButtonLink";

/** ---------- i18n types & helpers (same pattern as About.tsx) ---------- */
type Locale = "en" | "pt";
type CTA = { label: string; href: string };

type SismoItem = {
  subtitle?: string;
  body?: string;
  image?: string;
  alt?: string;
};

type SismoBlock = {
  kicker?: string;
  title?: string;
  intro?: string;
  items?: SismoItem[];
  cta?: CTA;
  external?: CTA;
};

type Dict = { sismo?: SismoBlock };

/** Import JSON as unknown then assert to Dict (matching About.tsx approach) */
import enRaw from "@/i18n/en.json";
import ptRaw from "@/i18n/pt.json";
const EN: Dict = enRaw as unknown as Dict;
const PT: Dict = ptRaw as unknown as Dict;

/** Robust locale detection without usePathname (same as About.tsx) */
function useLocale(): Locale {
  let path = "/";
  if (typeof window !== "undefined") {
    const p = window.location?.pathname;
    path = typeof p === "string" ? p : "/";
  }
  const first = path.split("/").filter(Boolean)[0] ?? "";
  return first === "pt" ? "pt" : "en";
}

/** Normalized shape for Sismo copy */
type SismoNormalized = {
  kicker: string;
  title: string;
  intro: string;
  items: Required<Pick<SismoItem, "subtitle" | "body" | "image" | "alt">>[];
  cta: CTA;
  external: CTA;
};

function useSismoDict(): SismoNormalized {
  const dict: Dict = useLocale() === "pt" ? PT : EN;
  const s = dict.sismo ?? {};
  const items = Array.isArray(s.items) ? s.items : [];

  return {
    kicker: s.kicker ?? "",
    title: s.title ?? "",
    intro: s.intro ?? "",
    items: items
      .map((it) => ({
        subtitle: it.subtitle ?? "",
        body: it.body ?? "",
        image: it.image ?? "",
        alt: it.alt ?? "",
      }))
      .filter((x) => x.subtitle || x.body || x.image), // avoid empty rows
    cta: s.cta ?? {
      label: "See a CÉU Sismo project",
      href: "/projects#sismo",
    },
    external: s.external ?? {
      label: "Learn more at Sismo Portugal",
      href: "https://sismo-technology.com/pt-pt/",
    },
  };
}

/** ---------- Component ---------- */
export default function Sismo() {
  const { title, intro, items, cta, external } = useSismoDict();

  return (
    <SectionShell
      id="sismo"
      pad="lg"
      container
      maxWidth="7xl"
      innerPx
      className="relative"
      innerClassName="relative"
    >
      {/* Header (Bravera sizes) */}
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="text-balance text-5xl font-semibold text-ink md:text-6xl">
          {title}
        </h2>
        {intro ? (
          <p className="mx-auto mt-6 text-lg text-ink/85">{intro}</p>
        ) : null}
      </div>

      {/* Alternating content blocks */}
      <div className="flex flex-col gap-20">
        {items.map((item, index) => (
          <div
            key={index}
            className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16 ${
              index % 2 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            {/* Text */}
            <div className="text-left md:pr-8 lg:pr-12">
              {item.subtitle ? (
                <h3 className="mb-3 text-3xl font-semibold text-ink">
                  {item.subtitle}
                </h3>
              ) : null}
              {item.body ? (
                <p className="text-base leading-relaxed text-ink/85">
                  {item.body}
                </p>
              ) : null}
            </div>

            {/* Image (rounded, subtle glass vibe) */}
            <div
              className="relative h-72 w-full overflow-hidden rounded-xl bg-clip-padding shadow-[0_8px_30px_rgba(0,0,0,0.35)] md:h-80 lg:h-96"
              style={{
                background:
                  "linear-gradient(to bottom, color-mix(in srgb, var(--brand) 12%, transparent), rgba(10,14,20,0.16))",
              }}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.alt || ""}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={false}
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* CTA cluster */}
      <div className="mt-24 flex flex-col items-center gap-4">
        <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
        <a
          href={external.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-ink/75 underline underline-offset-4 hover:text-ink"
        >
          {external.label}
        </a>
      </div>
    </SectionShell>
  );
}
