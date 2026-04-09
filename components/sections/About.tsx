"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionShell } from "@/components/sections/SectionShell";
import AboutAnimatedContent from "@/components/animations/AboutAnimatedContent";
import { useI18n } from "@/lib/i18n/I18nProvider";

/**
 * About v2
 * - Reads locale + dict from I18nProvider (SSR-stable)
 * - Hydration-safe because server and client see the same dict
 */
export default function About() {
  const { t } = useI18n();

  // Pull strongly-typed values via t(); fall back to safe defaults
  const title = t<string>("about.title", "");
  const subheading = t<string>("about.subheading", "");
  const bodyRaw = t<string | string[]>("about.body", []);
  const body = Array.isArray(bodyRaw) ? bodyRaw : [bodyRaw].filter(Boolean);
  const bullets = t<string[]>("about.bullets", []);
  const cta = t<{ label?: string; href?: string }>("about.cta", {
    label: t<string>("common.learnMore", "Learn more"),
    href: "/#projects",
  });
  const imageAlt = t<string>("about.imageAlt", "About Longhorn Construction");

  // Mesh asset (decorative, not a UI string)
  const MESH_SRC = "/media/gradients/mesh6.png";

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
      {/* Title: peeks from behind glass, animated on scroll */}
      <div className="relative overflow-visible -mb-6">
        <AboutAnimatedContent>
          <h2 className="text-balance text-center text-5xl font-semibold text-ink md:text-6xl translate-y-[16px]">
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
            <div className="mt-1 text-2xl font-normal text-ink/95">
              {subheading}
            </div>
          ) : null}

          {body.length ? (
            <div className="mt-4 space-y-4 leading-relaxed text-ink/85">
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : null}

          {bullets.length ? (
            <ul className="mt-4 list-disc space-y-1 pl-5 text-ink/85">
              {bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          ) : null}

          {/* CTA pill with mesh background */}
          <div className="mt-6 text-center sm:text-left">
            {cta?.href && cta?.label ? (
              <Link
                href={cta.href}
                className="
                  relative inline-flex items-center justify-center
                  rounded-full px-6 py-3 text-sm font-semibold
                  text-white/80
                  shadow-[0_6px_20px_rgba(0,0,0,0.18)]
                  border border-[color:var(--brand-border)]
                  focus:outline-none focus-visible:ring-2
                  focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-0
                  transition-transform duration-200
                  hover:-translate-y-0.5 hover:text-white
                  motion-reduce:transform-none motion-reduce:transition-none
                  overflow-hidden
                  [background-image:url('/media/gradients/mesh1.png')]
                  bg-center bg-cover
                "
                style={{ backgroundImage: `url(${MESH_SRC})` }}
              >
                {/* Contrast veil to ensure legibility on bright mesh areas */}
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute inset-0 rounded-full
                    bg-white/14 dark:bg-black/18
                    mix-blend-normal
                  "
                />
                {/* subtle inner highlight for glassy feel */}
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute inset-0 rounded-full
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]
                  "
                />
                <span className="relative">{cta.label}</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
