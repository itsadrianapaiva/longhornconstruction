"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { SectionShell } from "@/components/sections/SectionShell";
import ButtonLink from "@/components/ButtonLink";
import AboutAnimatedContent from "@/components/animations/AboutAnimatedContent";

/** i18n types */
type CTA = { label: string; href: string };
type AboutBlock = {
  title?: string;
  subheading?: string;
  body?: string | string[];
  bullets?: string[];
  cta?: CTA;
  imageAlt?: string;
};
type Dict = { about?: AboutBlock; common?: { learnMore?: string } };

/** Import JSON once (static), choose after mount */
import enRaw from "@/i18n/en.json";
import ptRaw from "@/i18n/pt.json";
const EN: Dict = enRaw as unknown as Dict;
const PT: Dict = ptRaw as unknown as Dict;

/** Safe client-only locale reader */
function getClientLocale(): "en" | "pt" {
  const path = window.location?.pathname ?? "/";
  const first = path.split("/").filter(Boolean)[0] ?? "";
  return first === "pt" ? "pt" : "en";
}

/** Normalize About copy */
function normalize(dict: Dict): {
  title: string;
  subheading: string;
  body: string[];
  bullets: string[];
  cta: CTA;
  imageAlt: string;
} {
  const about = dict.about ?? {};
  return {
    title: about.title ?? "",
    subheading: about.subheading ?? "",
    body: Array.isArray(about.body)
      ? (about.body as string[])
      : ([about.body ?? ""].filter(Boolean) as string[]),
    bullets: Array.isArray(about.bullets) ? about.bullets : [],
    cta:
      about.cta ??
      ({
        label: dict.common?.learnMore ?? "Learn more",
        href: "/#projects",
      } as CTA),
    imageAlt: about.imageAlt ?? "About CÉU Construction",
  };
}

/**
 * About v2 — Hydration-safe
 * - Server & first client render: stable placeholders (no mismatch)
 * - After mount: swap in locale-specific copy
 * - No props needed, keeps your minimal page.tsx
 */
export default function About() {
  // 1) mounted flag to defer locale selection to the client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 2) pick dict only after mount; before that, render EN as empty placeholders
  const dict = useMemo<Dict>(() => {
    if (!mounted) return { about: { title: "", body: [] } } as Dict;
    return getClientLocale() === "pt" ? PT : EN;
  }, [mounted]);

  // 3) normalize content
  const { title, subheading, body, bullets, cta, imageAlt } = useMemo(
    () => normalize(dict),
    [dict]
  );

  return (
    <SectionShell
      id="about"
      pad="lg"
      container
      maxWidth="7xl"
      innerPx
      className="relative"
      innerClassName="relative"
    >
      {/* Title: initially peeking from behind the glass */}
      <div className="relative overflow-visible -mb-6">
        <AboutAnimatedContent>
          {/* suppressHydrationWarning avoids warnings on the text node swap */}
          <h2
            className="text-balance text-center text-5xl font-semibold text-ink md:text-6xl translate-y-[16px]"
            suppressHydrationWarning
            aria-busy={!mounted}
          >
            {title}
          </h2>
        </AboutAnimatedContent>
      </div>

      {/* Glass card */}
      <div className="relative z-10 mt-16 grid items-center gap-8 rounded-2xl bg-clip-padding px-6 py-8 backdrop-blur-[12px] md:grid-cols-2 md:px-8 lg:grid-cols-3 lg:py-12 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        {/* Image column (left on lg+) */}
        <div className="relative order-2 md:order-2 lg:order-1 lg:col-span-1 lg:overflow-visible">
          <div className="relative mx-auto max-w-[1100px] lg:max-w-none">
            <Image
              src="/media/about/about.jpg"
              alt={imageAlt}
              width={1920}
              height={1280}
              sizes="(min-width: 1280px) 900px, (min-width: 1024px) 66vw, 100vw"
              priority={false}
              className="rounded-lg opacity-95 shadow-2xl lg:-translate-x-[12%] lg:scale-[1.08] lg:max-h-[600px] lg:w-auto lg:h-auto object-cover"
            />
          </div>
        </div>

        {/* Text column */}
        <div className="lg:col-span-2 order-1 md:order-1 lg:order-2">
          {subheading ? (
            <div
              className="mt-1 text-2xl font-normal text-ink/95"
              suppressHydrationWarning
              aria-busy={!mounted}
            >
              {subheading}
            </div>
          ) : null}

          {body.length ? (
            <div className="mt-4 space-y-4 leading-relaxed text-ink/85">
              {body.map((p: string, i: number) => (
                <p key={i} suppressHydrationWarning aria-busy={!mounted}>
                  {p}
                </p>
              ))}
            </div>
          ) : null}

          {bullets.length ? (
            <ul className="mt-4 list-disc space-y-1 pl-5 text-ink/85">
              {bullets.map((b: string, i: number) => (
                <li key={i} suppressHydrationWarning aria-busy={!mounted}>
                  {b}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-6 text-center sm:text-left">
            <ButtonLink href={cta.href} strongBorder>
              {cta.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
