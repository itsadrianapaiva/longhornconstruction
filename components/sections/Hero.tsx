"use client";

import { useCallback } from "react";
import Image from "next/image";
import BackgroundVideo from "@/components/BackgroundVideo";
import { useI18n } from "@/lib/i18n/I18nProvider";
import ButtonLink from "@/components/ButtonLink";

export default function Hero() {
  const { t } = useI18n();

  const scrollTo = useCallback((id: string) => {
    const el =
      typeof document !== "undefined" ? document.getElementById(id) : null;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section
      id="hero"
      aria-label={t<string>("hero.videoAriaLabel", "CÉU Construction hero")}
      // Full-bleed, true viewport height, no container padding
      className="hero relative w-full overflow-clip min-h-svh"
    >
      {/* Background band fills the section; no breakpoint height juggling needed */}
      <div className="absolute inset-0">
        <BackgroundVideo height="h-full" opacity="opacity-100" zoom={1.00} focal="50% 40%" />
        <div className="hero__overlay" aria-hidden="true" />
      </div>

      {/* Centered content — removed px-4 to eliminate side padding */}
      <div
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center text-center"
        style={{ minHeight: "inherit" }}
      >
        <Image
          src="/media/logo-white.png"
          alt="CÉU Construction"
          width={256}
          height={64}
          priority
          className="mx-auto"
        />

        <div className="mt-8">
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
      </div>
    </section>
  );
}
