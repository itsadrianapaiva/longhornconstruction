"use client";

import Image from "next/image";
import { SectionShell } from "@/components/sections/SectionShell";
import ButtonLink from "@/components/ButtonLink";
import { useI18n } from "@/lib/i18n/I18nProvider";

/**
 * Sismo section (i18n via provider)
 * - Reads all strings from `t()`; no window/location access.
 * - Hydration-safe and mirrors the previous layout/spacing.
 */
export default function Sismo() {
  const { t } = useI18n();

  // Pull top-level fields
  const title = t<string>("sismo.title", "");
  const intro = t<string>("sismo.intro", "");

  // Items array (normalize to array of objects with safe defaults)
  const rawItems = t<Array<Record<string, unknown>>>("sismo.items", []);
  const items = Array.isArray(rawItems)
    ? rawItems
        .map((it) => ({
          subtitle: (it?.subtitle as string) ?? "",
          body: (it?.body as string) ?? "",
          image: (it?.image as string) ?? "",
          alt: (it?.alt as string) ?? "",
        }))
        .filter((x) => x.subtitle || x.body || x.image)
    : [];

  // CTA cluster (internal + external)
  const cta = t<{ label?: string; href?: string }>("sismo.cta", {
    label: "See a CÉU Sismo project",
    href: "/projects#sismo",
  });
  const external = t<{ label?: string; href?: string }>("sismo.external", {
    label: "Learn more at Sismo Portugal",
    href: "https://sismo-technology.com/pt-pt/",
  });

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
              className={[
                "order-1 flex items-center",
                i % 2 ? "md:order-1" : "md:order-2",
              ].join(" ")}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.alt || ""}
                  width={1600}
                  height={900}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-auto w-full rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.38)]"
                  style={{ maxHeight: "520px", objectFit: "contain" }}
                  priority={false}
                />
              ) : null}
            </div>

            {/* Text column — order 2 on mobile; alternates on md+ */}
            <div
              className={[
                "order-2 text-left md:pr-8 lg:pr-12",
                i % 2 ? "md:order-2" : "md:order-1",
              ].join(" ")}
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
        {cta?.href && cta?.label ? (
          <ButtonLink href={cta.href} strongBorder>
            {cta.label}
          </ButtonLink>
        ) : null}

        {external?.href && external?.label ? (
          <a
            href={external.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ink/75 underline underline-offset-4 hover:text-ink"
          >
            {external.label}
          </a>
        ) : null}
      </div>
    </SectionShell>
  );
}
