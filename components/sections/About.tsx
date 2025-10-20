"use client";

import Image from "next/image";
import { SectionShell } from "@/components/sections/SectionShell";
import ButtonLink from "@/components/ButtonLink";
import AboutAnimatedContent from "@/components/animations/AboutAnimatedContent";

/** i18n types */
type Locale = "en" | "pt";
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

/** Import JSON as unknown then assert to Dict (no any) */
import enRaw from "@/i18n/en.json";
import ptRaw from "@/i18n/pt.json";
const EN: Dict = enRaw as unknown as Dict;
const PT: Dict = ptRaw as unknown as Dict;

/** Crash-proof locale detection that never touches undefined */
function useLocale(): Locale {
  let path = "/";
  if (typeof window !== "undefined") {
    const maybe = window.location?.pathname;
    path = typeof maybe === "string" ? maybe : "/";
  }
  const first = path.split("/").filter(Boolean)[0] ?? "";
  return first === "pt" ? "pt" : "en";
}

/** Normalized about dict shape */
type AboutNormalized = {
  title: string;
  subheading: string;
  body: string[];
  bullets: string[];
  cta: CTA;
  imageAlt: string;
};

function useAboutDict(): AboutNormalized {
  const dict: Dict = useLocale() === "pt" ? PT : EN;
  const about: AboutBlock = dict.about ?? {};
  return {
    title: about.title ?? "",
    subheading: about.subheading ?? "",
    body: Array.isArray(about.body)
      ? (about.body as string[])
      : [about.body ?? ""].filter(Boolean) as string[],
    bullets: Array.isArray(about.bullets) ? about.bullets : [],
    cta: about.cta ?? { label: dict.common?.learnMore ?? "Learn more", href: "/#projects" },
    imageAlt: about.imageAlt ?? "About CÉU Construction",
  };
}

export default function About() {
  const { title, subheading, body, bullets, cta, imageAlt } = useAboutDict();

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
      {/* Brand glow using CEU tokens */}
      <div
        aria-hidden
        className="absolute -z-10 left-1/2 top-0 aspect-square w-full max-w-xl -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--brand) 55%, transparent), transparent 70%)",
          opacity: 0.18,
        }}
      />

      {/* Title viewport to clip the entrance so it appears from behind the glass */}
      <div className="relative overflow-hidden pb-4">
        <AboutAnimatedContent
          yFrom={96}
          start="top bottom-=40%"
          once
          clearOnEnd={true}
          removeClasses={["opacity-0", "translate-y-16", "transition-none"]}
        >
          <h2
            className={[
              "text-balance text-center text-5xl md:text-6xl font-semibold text-ink",
              "opacity-0 translate-y-16 transition-none",
            ].join(" ")}
          >
            {title}
          </h2>
        </AboutAnimatedContent>
      </div>

      {/* Glass card with CEU tokens, Bravera-like structure */}
      <div
        className="mt-16 grid items-center gap-8 rounded-2xl border border-glass-strong bg-clip-padding px-6 py-8 backdrop-blur-[12px] md:grid-cols-2 md:px-8 lg:grid-cols-3 lg:py-12 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--ring) 16%, transparent), rgba(10,14,20,0.50))",
        }}
      >
        {/* Text column */}
        <div className="lg:col-span-1">
          {subheading ? (
            <div className="mt-1 text-2xl font-normal text-ink/95">{subheading}</div>
          ) : null}

          {body.length ? (
            <div className="mt-4 space-y-4 leading-relaxed text-ink/85">
              {body.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : null}

          {bullets.length ? (
            <ul className="mt-4 list-disc space-y-1 pl-5 text-ink/85">
              {bullets.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          ) : null}

          <div className="mt-6 text-center sm:text-left">
            <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
          </div>
        </div>

        {/* Image column */}
        <div className="relative lg:col-span-2">
          <Image
            src="/media/about/about.jpg"
            alt={imageAlt}
            width={1920}
            height={1280}
            sizes="(min-width: 1024px) 66vw, 100vw"
            priority={false}
            className="rounded-lg opacity-95 shadow-2xl lg:-translate-x-[12%]"
          />
        </div>
      </div>
    </SectionShell>
  );
}
