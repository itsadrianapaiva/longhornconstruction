"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { SectionShell } from "@/components/sections/SectionShell";
import ButtonLink from "@/components/ButtonLink";
import AboutAnimatedContent from "@/components/animations/AboutAnimatedContent";

// Import i18n files (copy lives in JSON, not here)
import en from "@/i18n/en.json";
import pt from "@/i18n/pt.json";

// Infer locale from first path segment
function useLocale(): "en" | "pt" {
  const path = usePathname() || "/";
  const seg = path.split("/").filter(Boolean)[0];
  return seg === "pt" ? "pt" : "en";
}

// Safely extract the about block from current locale dict
function useAboutDict() {
  const locale = useLocale();
  const dict = locale === "pt" ? pt : en;
  const about = dict?.about ?? {};
  // Fallbacks to keep UI stable even if JSON is not yet upgraded
  return {
    title: about.title ?? "",
    subheading: about.subheading ?? "",
    body: Array.isArray(about.body)
      ? about.body
      : [about.body ?? ""].filter(Boolean),
    bullets: Array.isArray(about.bullets) ? about.bullets : [],
    cta: about.cta ?? {
      label: dict?.common?.learnMore ?? "Learn more",
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
      {/* Brand glow behind heading (uses CEU tokens) */}
      <div
        aria-hidden
        className="absolute -z-10 left-1/2 top-0 -translate-x-1/2 md:-translate-y-10 aspect-square w-[46rem] max-w-[90vw] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--brand) 70%, transparent), transparent 70%)",
          opacity: 0.18,
        }}
      />

      {/*  Title starts hidden via CSS, rises into place, and keeps inline final styles. */}

      <AboutAnimatedContent
        yFrom={64}
        start="top 90%"
        once
        clearOnEnd={false}
        removeClasses={["opacity-0", "translate-y-16", "transition-none"]} // ← array
      >
        <h2
          className={[
            "text-balance text-center text-5xl md:text-6xl font-semibold text-ink",
            "opacity-0 translate-y-16 transition-none", // pre-hide
            "relative z-0",
          ].join(" ")}
        >
          {title}
        </h2>
      </AboutAnimatedContent>

      {/* Glass container: wrapper adds a dedicated border layer, inner handles blur/gradient */}
      <div className="mt-16 relative">
        {/* Border layer — independent from blur/gradient, guarantees full rounded edge */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl border"
          style={{ borderColor: "var(--glass-border-strong)" }}
        />

        {/* Content layer — clipped to radius; subtle blue gradient + depth */}
        <div
          className="
      relative rounded-2xl overflow-hidden bg-clip-padding
      grid items-center gap-8 px-6 py-8 md:px-8 lg:grid-cols-3 lg:py-12
      backdrop-blur-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.25)]
    "
          style={{
            background:
              "linear-gradient(to bottom right, color-mix(in srgb, var(--ring) 16%, transparent), rgba(10,14,20,0.50))",
          }}
        >
          {/* Text column */}
          <div className="lg:col-span-1">
            {subheading ? (
              <div className="mt-2 text-2xl font-normal text-ink/95">
                {subheading}
              </div>
            ) : null}

            {body.length ? (
              <div className="mt-4 space-y-4 text-ink/85 leading-relaxed">
                {body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}

            {bullets.length ? (
              <ul className="mt-4 list-disc pl-5 text-ink/85 space-y-1">
                {bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            ) : null}

            <div className="mt-6 text-center sm:text-left">
              <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
            </div>
          </div>

          {/* Image column */}
          <div className="lg:col-span-2 relative">
            <Image
              src="/media/about/about.jpg"
              alt={imageAlt}
              width={1920}
              height={1280}
              priority={false}
              className="rounded-lg shadow-2xl opacity-95 lg:translate-x-[-12%]"
            />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
