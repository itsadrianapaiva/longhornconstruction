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

gsap.registerPlugin(useGSAP);

export default function HeroAnimatedContent({
  logoSrc = "/media/logo-black.png",
  primaryCtaLabel,
  locale,
}: Props) {
  const { t } = useI18n();

  const scopeRef = useRef<HTMLDivElement | null>(null);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const prefersReducedMotion = usePrefersReducedMotion();

  const scrollTo = useCallback((id: string) => {
    const el =
      typeof document !== "undefined" ? document.getElementById(id) : null;

    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useGSAP(
    () => {
      const logoWrap = logoWrapRef.current;
      const content = contentRef.current;
      const panel = panelRef.current;

      if (!logoWrap || !content || !panel) return;

      if (prefersReducedMotion) {
        gsap.set([logoWrap, content, panel], {
          clearProps: "all",
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        });
        return;
      }

      gsap.fromTo(
        logoWrap,
        { opacity: 0, y: -14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        content,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          delay: 0.12,
        },
      );

      gsap.fromTo(
        panel,
        { opacity: 0, x: 24, scale: 0.985 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
          delay: 0.24,
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
      className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl items-start px-6 pb-28 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:px-12 lg:pb-0 lg:pt-8"
    >
      <div className="flex w-full flex-col">
        <div
          ref={logoWrapRef}
          className="mb-4 flex justify-center sm:mb-10 lg:mb-4"
        >
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={760}
            height={210}
            priority
            className="h-auto w-[420px] sm:w-[280px] lg:w-[420px] xl:w-[580px]"
          />
        </div>

        <div className="grid w-full items-start gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)] lg:gap-14 xl:gap-16">
          <div
            ref={contentRef}
            className="relative max-w-[44rem] text-left lg:max-w-none lg:pr-6"
          >
            <h1 className="max-w-3xl text-balance text-2xl font-semibold leading-[0.96] text-white sm:text-3xl lg:max-w-6xl lg:text-4xl xl:text-5xl">
              {title}
            </h1>

            <p className="mt-4 max-w-[38rem] text-pretty text-[1.02rem] leading-7 text-white/90 sm:mt-5 sm:text-lg sm:leading-8">
              {subtitle}
            </p>

            <p className="mt-4 max-w-[32rem] text-sm leading-6 text-white/74 sm:text-base">
              {supportLine}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href={`/${locale}/contact`}
                data-testid="hero-cta-primary"
                className="
                  relative inline-flex min-h-[3.5rem] w-full items-center justify-center
                  overflow-hidden rounded-full border border-[color:var(--brand-border)]
                  bg-cover bg-center px-6 py-3 text-sm font-semibold text-white/90
                  shadow-[0_6px_20px_rgba(0,0,0,0.18)]
                  transition-transform duration-200
                  hover:-translate-y-0.5 hover:text-white
                  focus:outline-none focus-visible:ring-2
                  focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-0
                  motion-reduce:transform-none motion-reduce:transition-none
                  sm:min-w-[240px] sm:w-auto
                "
                style={{ backgroundImage: `url(${MESH_SRC})` }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full bg-white/14 dark:bg-black/18"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
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
                className="min-h-[3.5rem] w-full justify-center rounded-full px-6 py-3 sm:min-w-[220px] sm:w-auto"
              >
                {secondaryLabel}
              </ButtonLink>
            </div>
          </div>

          <div ref={panelRef} className="lg:justify-self-end" aria-hidden="true">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/14 bg-black/24 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-[8px] sm:rounded-[2rem] sm:p-7 lg:max-w-[440px]">
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
    </div>
  );
}