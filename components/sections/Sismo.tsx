"use client";

import Image from "next/image";
import { SectionShell } from "@/components/sections/SectionShell";
import ButtonLink from "@/components/ButtonLink";

/** ---------- i18n types (matching About.tsx style) ---------- */
type Locale = "en" | "pt";
type CTA = { label: string; href: string };
type SismoItem = {
  subtitle?: string;
  body?: string;
  image?: string;
  alt?: string;
};
type SismoBlock = {
  title?: string;
  intro?: string;
  items?: SismoItem[];
  cta?: CTA;
  external?: CTA;
};
type Dict = { sismo?: SismoBlock };

/** Import JSON then assert to Dict (same approach as About.tsx) */
import enRaw from "@/i18n/en.json";
import ptRaw from "@/i18n/pt.json";
const EN: Dict = enRaw as unknown as Dict;
const PT: Dict = ptRaw as unknown as Dict;

/** Locale detection without usePathname */
function useLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const first = window.location.pathname.split("/").filter(Boolean)[0] ?? "";
  return first === "pt" ? "pt" : "en";
}

/** Normalize Sismo copy to a stable shape */
function useSismoDict() {
  const dict: Dict = useLocale() === "pt" ? PT : EN;
  const s = dict.sismo ?? {};
  const items = Array.isArray(s.items) ? s.items : [];
  return {
    title: s.title ?? "",
    intro: s.intro ?? "",
    items: items
      .map((it) => ({
        subtitle: it.subtitle ?? "",
        body: it.body ?? "",
        image: it.image ?? "",
        alt: it.alt ?? "",
      }))
      .filter((x) => x.subtitle || x.body || x.image),
    cta: s.cta ?? { label: "See a CÉU Sismo project", href: "/projects#sismo" },
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
      {/* Header (Bravera sizes, no kicker) */}
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="text-balance text-5xl font-semibold text-ink md:text-6xl">
          {title}
        </h2>
        {intro ? (
          <p className="mx-auto mt-6 text-lg text-ink/85">{intro}</p>
        ) : null}
      </div>

      {/* Alternating content blocks (image first on mobile) */}
      <div className="flex flex-col gap-20">
        {items.map((item, i) => (
          <div
            key={i}
            className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16"
          >
            {/* Image column — order 1 on mobile; alternates on md+ */}
            <div
              className={`
          order-1
          ${i % 2 ? "md:order-1" : "md:order-2"}
          flex items-center
        `}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.alt || ""}
                  width={1600}
                  height={900}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-auto rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.38)]"
                  style={{ maxHeight: "520px", objectFit: "contain" }}
                  priority={false}
                />
              ) : null}
            </div>

            {/* Text column — order 2 on mobile; alternates on md+ */}
            <div
              className={`
          order-2
          ${i % 2 ? "md:order-2" : "md:order-1"}
          text-left md:pr-8 lg:pr-12
        `}
            >
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
          </div>
        ))}
      </div>

      {/* CTA cluster */}
      <div className="mt-18 flex flex-col items-center gap-4">
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
