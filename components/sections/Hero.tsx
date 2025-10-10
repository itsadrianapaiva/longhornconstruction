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
      className="hero mask-fade-b relative w-full overflow-clip"
    >
      {/* Full-height band */}
      <div className="min-h-[76svh] sm:min-h-[82svh] lg:min-h-[88svh]">
        <BackgroundVideo height="h-full" opacity="opacity-30" />
        <div className="hero__overlay" aria-hidden="true" />

        {/* Centered content; no side padding on the section—just a small safe pad on the content */}
        <div
          className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-4 text-center"
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

          <p className="mt-4 text-base sm:text-lg text-ink/90">
            {t<string>("hero.subtitle")}
          </p>

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
      </div>
    </section>
  );
}
