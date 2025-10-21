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

/** Import JSON as unknown then assert to Dict */
import enRaw from "@/i18n/en.json";
import ptRaw from "@/i18n/pt.json";
const EN: Dict = enRaw as unknown as Dict;
const PT: Dict = ptRaw as unknown as Dict;

/** Robust locale detection without usePathname */
function useLocale(): Locale {
  let path = "/";
  if (typeof window !== "undefined") {
    const p = window.location?.pathname;
    path = typeof p === "string" ? p : "/";
  }
  const first = path.split("/").filter(Boolean)[0] ?? "";
  return first === "pt" ? "pt" : "en";
}

/** Normalized shape for About copy */
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
      : ([about.body ?? ""].filter(Boolean) as string[]),
    bullets: Array.isArray(about.bullets) ? about.bullets : [],
    cta: about.cta ?? {
      label: dict.common?.learnMore ?? "Learn more",
      href: "/#projects",
    },
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
      {/* Title: initially peeking from behind the glass */}
      <div className="relative overflow-visible -mb-6">
        <AboutAnimatedContent>
          <h2 className="text-balance text-center text-5xl font-semibold text-ink md:text-6xl translate-y-[16px]">
            {title}
          </h2>
        </AboutAnimatedContent>
      </div>

      {/* Glass card with top edge mask to sell the 'behind-glass' reveal */}
      <div
        className="relative z-10 mt-16 grid items-center gap-8 rounded-2xl bg-clip-padding px-6 py-8 backdrop-blur-[12px] md:grid-cols-2 md:px-8 lg:grid-cols-3 lg:py-12 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
      >
        {/* Image column (now on left for lg+) */}
        <div className="relative order-2 md:order-2 lg:order-1 lg:col-span-1 lg:overflow-visible">
          <div className="relative mx-auto max-w-[1100px] lg:max-w-none">
            <Image
              src="/media/about/about.jpg"
              alt={imageAlt}
              width={1920}
              height={1280}
              sizes="(min-width: 1280px) 900px, (min-width: 1024px) 66vw, 100vw"
              priority={false}
              className="rounded-lg opacity-95 shadow-2xl
                   lg:-translate-x-[12%] lg:scale-[1.08]
                   lg:max-h-[600px] lg:w-auto lg:h-auto object-cover"
            />
          </div>
        </div>

        {/* Text column */}
        <div className="lg:col-span-2 order-1 md:order-1 lg:order-2">
          {subheading ? (
            <div className="mt-1 text-2xl font-normal text-ink/95">
              {subheading}
            </div>
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
            <ButtonLink href={cta.href} strongBorder>{cta.label}</ButtonLink>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
