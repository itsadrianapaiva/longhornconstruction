// components/animations/HeroAnimatedContent.tsx
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
};

gsap.registerPlugin(useGSAP);

export default function HeroAnimatedContent({
  arrowTargetId,
  logoSrc = "/media/logo-black.png",
}: Props) {
  const { t } = useI18n();

  // Scope + element refs
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const btnWrapRef = useRef<HTMLDivElement | null>(null); // wrap the whole button
  const chevronRef = useRef<HTMLButtonElement | null>(null);

  const prefersReducedMotion = usePrefersReducedMotion();

  const scrollTo = useCallback((id: string) => {
    const el = typeof document !== "undefined" ? document.getElementById(id) : null;
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
        gsap.set(chev, { opacity: 0.25, y: 0 });
        return;
      }

      // Initial states — ensure nothing is visible at start
      gsap.set(logo, { opacity: 0 });
      gsap.set(btnWrap, { opacity: 0, scale: 1.2 });
      gsap.set(chev, { opacity: 0, y: 50 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // 1) Logo: slower fade-in (more “grand”)
      tl.to(logo, { opacity: 1, duration: 2.0, ease: "power1.out" });

      // 2) Entire button wrapper: scale down + fade AFTER logo completes
      tl.to(btnWrap, { opacity: 1, scale: 1, duration: 1.2 });

      // 3) Chevron: rise and settle faint opacity AFTER button completes
      tl.to(chev, { y: 0, opacity: 0.25, duration: 1.0 });
    },
    { scope: scopeRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <div
      ref={scopeRef}
      className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center text-center"
      style={{ minHeight: "inherit" }}
    >
      {/* Logo — starts hidden via GSAP set (also use class opacity-0 so it's empty pre-tick) */}
      <Image
        ref={logoRef}
        src={logoSrc}
        alt="CÉU Construction"
        width={256}
        height={64}
        priority
        className="mx-auto opacity-0"
      />

      {/* Button wrapper — we animate this container to affect the entire button */}
      <div ref={btnWrapRef} className="mt-8 opacity-0">
        <ButtonLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("projects");
          }}
          data-testid="hero-cta-projects"
        >
          {t<string>("hero.secondaryCta")}
        </ButtonLink>
      </div>

      {/* Chevron — positioned by parent, animated as a unit */}
      <button
        ref={chevronRef}
        type="button"
        onClick={() => scrollTo(arrowTargetId)}
        aria-label={t<string>("hero.scrollDownLabel", "Scroll to next section")}
        className={[
          "absolute left-1/2 -translate-x-1/2 top-[80%] z-20",
          "p-4 md:p-5 rounded-full outline-none",
          // No opacity class — GSAP handles it; if JS fails, it remains visible
          "focus-visible:shadow-[0_0_0_3px_var(--ring)]",
        ].join(" ")}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-24 w-24 md:h-32 md:w-32">
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
