// components/sections/Sismo.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionShell } from "@/components/sections/SectionShell";
import { useI18n } from "@/lib/i18n/I18nProvider";
import SectionHeader from "@/components/SectionHeader";

export default function Sismo() {
  const { t } = useI18n();

  // Top-level fields
  const title = t<string>("sismo.title", "");
  const intro = t<string>("sismo.intro", "");
  const highlightTarget = t<string>("sismo.highlightWord", "Sismo");

  // Mesh asset used by underline + CTA
  const MESH_SRC = "/media/gradients/mesh1.png";

  // Items
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

  // CTAs
  const cta = t<{ label?: string; href?: string }>("sismo.cta", {
    label: "See a CÉU Sismo project",
    href: "/projects#sismo",
  });
  const external = t<{ label?: string; href?: string }>("sismo.external", {
    label: "Learn more at Sismo Portugal",
    href: "https://sismo-technology.com/pt-pt/",
  });

  // --- underline helpers (unchanged behavior) ---
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
      {/* Standardized header with underline variant */}
      <SectionHeader
        title={title}
        intro={intro}
        className="mx-auto mb-16 max-w-2xl"
        titleClassName="text-ink"
        introClassName="text-ink/85"
        underline={{
          highlightTarget,
          renderEffect: renderWithMeshUnderline,
        }}
      />

      {/* Alternating content blocks */}
      <div className="flex flex-col gap-20">
        {items.map((item, i) => (
          <div
            key={i}
            className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16"
          >
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
          <Link
            href={cta.href}
            className="
              relative isolate inline-flex items-center justify-center
              rounded-full px-6 py-3 text-sm font-semibold
              text-white/80
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-0
              transition-transform duration-200 hover:-translate-y-0.5
              motion-reduce:transform-none motion-reduce:transition-none hover:text-white
            "
            style={
              {
                "--ring": "2px",
                "--mesh-src": `url('/media/gradients/mesh2.png')`,
              } as React.CSSProperties
            }
          >
            <span
              aria-hidden="true"
              className="
                pointer-events-none absolute inset-0 -z-10 rounded-full
                before:content-[''] before:absolute before:inset-0 before:rounded-full
                before:[background-image:var(--mesh-src)]
              "
            />
            <span
              aria-hidden="true"
              className="
                pointer-events-none absolute inset-0 -z-10 rounded-full
                after:content-[''] after:absolute after:rounded-full
                after:inset-[var(--ring)]
                after:bg-[color:var(--btn-bg,rgba(255,255,255,0.06))]
                after:backdrop-blur-lg
                after:dark:bg-[color:var(--btn-bg-dark,rgba(0,0,0,0.24))]
              "
            />
            <span className="relative z-10">{cta.label}</span>
          </Link>
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
