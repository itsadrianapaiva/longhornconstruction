"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
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
};

const CHEVRON_REST_OPACITY = 0.18;

gsap.registerPlugin(useGSAP);

export default function HeroAnimatedContent({
  logoSrc = "/media/logo-black.jpg",
  primaryCtaLabel,
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

  return (
    <div
      ref={scopeRef}
      className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-12"
    >
      <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-14">
        <div ref={contentRef} className="relative max-w-2xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-6 -inset-y-8 rounded-[2rem] sm:-inset-x-8 sm:-inset-y-10 lg:-inset-x-10"
          />

          <div className="relative z-10">
            <div ref={logoWrapRef} className="mb-8">
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={220}
                height={55}
                priority
                className="h-auto w-[150px] sm:w-[180px] lg:w-[220px]"
              />
            </div>

            <h1
              className="max-w-4xl text-balance text-4xl font-semibold leading-[1.02] text-white sm:text-5xl lg:text-6xl"
              style={{ textShadow: "0 8px 28px rgba(0,0,0,0.32)" }}
            >
              {title}
            </h1>

            <p
              className="mt-5 max-w-2xl text-pretty text-base leading-7 text-white/90 sm:text-lg sm:leading-8"
              style={{ textShadow: "0 4px 18px rgba(0,0,0,0.24)" }}
            >
              {subtitle}
            </p>

            <p
              className="mt-4 text-sm leading-6 text-white/74 sm:text-base"
              style={{ textShadow: "0 4px 16px rgba(0,0,0,0.22)" }}
            >
              {supportLine}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ButtonLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("contact");
                }}
                data-testid="hero-cta-primary"
              >
                {primaryLabel}
              </ButtonLink>

              <ButtonLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("projects");
                }}
                data-testid="hero-cta-projects"
              >
                {secondaryLabel}
              </ButtonLink>
            </div>
          </div>
        </div>

        <div ref={panelRef} className="lg:justify-self-end" aria-hidden="true">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/14 bg-black/26 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-[8px] sm:p-7 lg:max-w-[420px]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(210,138,0,0.14),rgba(255,255,255,0.04)_42%,rgba(0,0,0,0.12))]" />

            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                {panelEyebrow}
              </p>

              <p className="mt-3 text-xl font-semibold leading-8 text-white">
                {panelTitle}
              </p>

              <ul className="mt-6 space-y-4 text-sm leading-6 text-white/82 sm:text-[0.95rem]">
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
