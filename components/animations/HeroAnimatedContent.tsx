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
  /** Optional i18n overrides passed from parent (we still default to t()) */
  chevronAriaLabel?: string;
  primaryCtaLabel?: string;
};

const CHEVRON_REST_OPACITY = 0.18; // ← adjust this to change the final opacity

gsap.registerPlugin(useGSAP);

export default function HeroAnimatedContent({
  arrowTargetId,
  logoSrc = "/media/logo-black.png",
  chevronAriaLabel,
  primaryCtaLabel,
}: Props) {
  const { t } = useI18n();

  // Scope + element refs
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const btnWrapRef = useRef<HTMLDivElement | null>(null);
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
      const logo = logoRef.current;
      const btnWrap = btnWrapRef.current;
      const chev = chevronRef.current;
      if (!logo || !btnWrap || !chev) return;

      if (prefersReducedMotion) {
        // Reveal final states immediately
        gsap.set([logo, btnWrap, chev], { clearProps: "all" });
        gsap.set(logo, { opacity: 1 });
        gsap.set(btnWrap, { opacity: 1, scale: 1 });
        gsap.set(chev, { opacity: CHEVRON_REST_OPACITY, y: 0 });
        return;
      }

      // Initial states
      gsap.set(logo, { opacity: 0 });
      gsap.set(btnWrap, { opacity: 0, scale: 1.2 });
      gsap.set(chev, { opacity: 0, y: 48 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.to(logo, { opacity: 1, duration: 2.0, ease: "power1.out" });
      tl.to(btnWrap, { opacity: 1, scale: 1, duration: 1.0 });

      // Chevron: reveal and settle to a faint opacity
      tl.add(() => {
        chev.classList.remove("opacity-0", "translate-y-12", "transition-none");
      });
      tl.to(chev, { y: 0, opacity: CHEVRON_REST_OPACITY, duration: 0.9 });
    },
    { scope: scopeRef, dependencies: [prefersReducedMotion] }
  );

  // Localized labels with prop overrides
  const chevronLabel =
    chevronAriaLabel ??
    t<string>("hero.scrollDownLabel", "Scroll to next section");
  const ctaLabel =
    primaryCtaLabel ?? t<string>("hero.secondaryCta", "See projects");

  return (
    <div
      ref={scopeRef}
      className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center text-center"
      style={{ minHeight: "inherit" }}
    >
      {/* Logo */}
      <Image
        ref={logoRef}
        src={logoSrc}
        alt="Longhorn Construction"
        width={256}
        height={64}
        priority
        className="mx-auto opacity-0"
      />

      {/* Button wrapper */}
      <div ref={btnWrapRef} className="mt-8 opacity-0">
        <ButtonLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("projects");
          }}
          data-testid="hero-cta-projects"
        >
          {ctaLabel}
        </ButtonLink>
      </div>

      {/* Chevron */}
      <button
        ref={chevronRef}
        type="button"
        onClick={() => scrollTo(arrowTargetId)}
        aria-label={chevronLabel}
        className={[
          "absolute left-1/2 -translate-x-1/2 top-[80%] z-20 p-4 md:p-5 rounded-full outline-none",
          "opacity-0 translate-y-12 transition-none", // hidden until GSAP animates
          "focus-visible:shadow-[0_0_0_3px_var(--ring)]",
          // Nice affordances: slightly brighter on hover/focus to indicate interactivity
          "hover:opacity-40 focus:opacity-40 transition-opacity duration-200 ease-[var(--ease-gentle)]",
        ].join(" ")}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-24 w-24 md:h-32 md:w-32"
        >
          <path
            d="M4 8l8 8 8-8"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
