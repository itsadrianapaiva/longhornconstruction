"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ButtonLink from "@/components/ButtonLink";
import { useI18n } from "@/lib/i18n/I18nProvider";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

type Props = {
  arrowTargetId: string;
  logoSrc?: string;
  chevronAriaLabel?: string;
  primaryCtaLabel?: string;
  locale: string;
};

const CHEVRON_REST_OPACITY = 0.18;

gsap.registerPlugin(useGSAP);

export default function HeroAnimatedContent({
  logoSrc = "/media/logo-black.jpg",
  primaryCtaLabel,
  locale,
}: Props) {
  const { t } = useI18n();

  const scopeRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const chevronRef = useRef<HTMLButtonElement | null>(null);

  const prefersReducedMotion = usePrefersReducedMotion();

  const scrollTo = useCallback((id: string) => {
    const el =
      typeof document !== "undefined" ? document.getElementById(id) : null;

    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useGSAP(
    () => {
      const content = contentRef.current;
      const logoWrap = logoWrapRef.current;
      const panel = panelRef.current;
      const chevron = chevronRef.current;

      if (!content || !logoWrap || !panel || !chevron) return;

      if (prefersReducedMotion) {
        gsap.set(content, { clearProps: "all", opacity: 1, y: 0 });
        gsap.set(logoWrap, { clearProps: "all", opacity: 1, y: 0 });
        gsap.set(panel, { clearProps: "all", opacity: 1, x: 0, scale: 1 });
        gsap.set(chevron, {
          clearProps: "all",
          opacity: CHEVRON_REST_OPACITY,
          y: 0,
        });
        return;
      }

      gsap.fromTo(
        content,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
      );

      gsap.fromTo(
        logoWrap,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.2 },
      );

      gsap.fromTo(
        panel,
        { opacity: 0, x: 24, scale: 0.98 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
          delay: 0.3,
        },
      );
    },
    { scope: scopeRef, dependencies: [prefersReducedMotion] },
  );

  const title = t<string>("hero.title", "Built to Higher Standards");
  const subtitle = t<string>(
    "hero.subtitle",
    "High-end residential construction in Portugal and Southern Spain, combining traditional craftsmanship with North American precision, communication, and execution.",
  );
  const supportLine = t<string>(
    "hero.supportLine",
    "Owner-led projects across the Algarve and Costa del Sol.",
  );
  const logoAlt = t<string>("hero.logoAlt", "Longhorn Construction logo");

  const panelEyebrow = t<string>("hero.panelEyebrow", "Why Longhorn");
  const panelTitle = t<string>(
    "hero.panelTitle",
    "Premium residential construction with disciplined delivery.",
  );
  const panelItemOne = t<string>(
    "hero.panelItemOne",
    "Owner-led communication from first consultation to final handover",
  );
  const panelItemTwo = t<string>(
    "hero.panelItemTwo",
    "Traditional craftsmanship with North American execution standards",
  );
  const panelItemThree = t<string>(
    "hero.panelItemThree",
    "Serving clients across the Algarve and Costa del Sol",
  );

  const primaryLabel =
    primaryCtaLabel ?? t<string>("hero.primaryCta", "Request a Consultation");

  const secondaryLabel = t<string>("hero.secondaryCta", "Explore Our Work");

  const MESH_SRC = "/media/gradients/mesh1.png";

  return (
    <div
      ref={scopeRef}
      className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl items-center px-6 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:py-24"
    >
      <div className="grid w-full items-start gap-12 sm:gap-14 lg:items-center lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-14">
        <div ref={contentRef} className="relative max-w-[38rem]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-4 -inset-y-6 rounded-[2rem] sm:-inset-x-8 sm:-inset-y-10 lg:-inset-x-10"
          />

          <div className="relative z-10">
            <div ref={logoWrapRef} className="mb-6 sm:mb-8">
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={220}
                height={55}
                priority
                className="h-auto w-[112px] sm:w-[160px] lg:w-[220px]"
              />
            </div>

            <h1
              className="max-w-[12ch] text-balance text-[2.35rem] font-semibold leading-[0.98] text-white sm:max-w-4xl sm:text-5xl lg:text-6xl"
              style={{ textShadow: "0 8px 28px rgba(0,0,0,0.32)" }}
            >
              {title}
            </h1>

            <p
              className="mt-4 max-w-[34rem] text-pretty text-[1.02rem] leading-7 text-white/90 sm:mt-5 sm:text-lg sm:leading-8"
              style={{ textShadow: "0 4px 18px rgba(0,0,0,0.24)" }}
            >
              {subtitle}
            </p>

            <p
              className="mt-4 max-w-[30rem] text-sm leading-6 text-white/74 sm:text-base"
              style={{ textShadow: "0 4px 16px rgba(0,0,0,0.22)" }}
            >
              {supportLine}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href={`/${locale}/contact`}
                data-testid="hero-cta-primary"
                className="
                  relative inline-flex min-h-[3.5rem] w-full items-center justify-center
                  rounded-full px-6 py-3 text-sm font-semibold
                  text-white/88
                  shadow-[0_6px_20px_rgba(0,0,0,0.18)]
                  border border-[color:var(--brand-border)]
                  focus:outline-none focus-visible:ring-2
                  focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-0
                  transition-transform duration-200
                  hover:-translate-y-0.5 hover:text-white
                  motion-reduce:transform-none motion-reduce:transition-none
                  overflow-hidden
                  bg-center bg-cover
                  sm:w-auto sm:min-w-[240px]
                "
                style={{ backgroundImage: `url(${MESH_SRC})` }}
              >
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute inset-0 rounded-full
                    bg-white/14 dark:bg-black/18
                    mix-blend-normal
                  "
                />
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute inset-0 rounded-full
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]
                  "
                />
                <span className="relative">{primaryLabel}</span>
              </Link>

              <ButtonLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("projects");
                }}
                data-testid="hero-cta-projects"
                className="min-h-[3.5rem] w-full justify-center rounded-full px-6 py-3 sm:w-auto sm:min-w-[220px]"
              >
                {secondaryLabel}
              </ButtonLink>
            </div>
          </div>
        </div>

        <div ref={panelRef} className="lg:justify-self-end" aria-hidden="true">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/14 bg-black/26 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-[8px] sm:rounded-[2rem] sm:p-7 lg:max-w-[420px]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(210,138,0,0.14),rgba(255,255,255,0.04)_42%,rgba(0,0,0,0.12))]" />

            <div className="relative">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/70 sm:text-xs">
                {panelEyebrow}
              </p>

              <p className="mt-3 text-[1.85rem] font-semibold leading-[1.22] text-white sm:text-xl sm:leading-8">
                {panelTitle}
              </p>

              <ul className="mt-5 space-y-3 text-sm leading-6 text-white/82 sm:mt-6 sm:space-y-4 sm:text-[0.95rem]">
                <li className="border-l-2 border-[var(--brand)] pl-4">
                  {panelItemOne}
                </li>
                <li className="border-l-2 border-[var(--brand)] pl-4">
                  {panelItemTwo}
                </li>
                <li className="border-l-2 border-[var(--brand)] pl-4">
                  {panelItemThree}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
