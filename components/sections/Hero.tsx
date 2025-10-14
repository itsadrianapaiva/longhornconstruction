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

  // Section to reveal when clicking the chevron
  const arrowTargetId = "about";

  return (
    <section
      id="hero"
      aria-label={t<string>("hero.videoAriaLabel", "CÉU Construction hero")}
      className="hero relative w-full overflow-clip min-h-svh"
    >
      {/* Background video fills the section */}
      <div className="absolute inset-0">
        <BackgroundVideo height="h-full" opacity="opacity-100" zoom={1.0} focal="50% 40%" />
      </div>

      {/* Centered content */}
      <div
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center text-center"
        style={{ minHeight: "inherit" }}
      >
        <Image
          src="/media/logo-black.png"
          alt="CÉU Construction"
          width={256}
          height={64}
          priority
          className="mx-auto"
        />

        {/* Primary CTA */}
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

      {/* Big chevron — absolute at ~75% of hero height, centered. No layout shift. */}
      <button
        type="button"
        onClick={() => scrollTo(arrowTargetId)}
        aria-label={t<string>("hero.scrollDownLabel", "Scroll to next section")}
        className={[
          "absolute left-1/2 -translate-x-1/2 top-[80%] z-20",
          // Large hit target with no visible container
          "p-4 md:p-5 rounded-full outline-none",
          // Only opacity changes; very subtle at rest
          "opacity-5",
          // Focus ring for keyboard users
          "focus-visible:shadow-[0_0_0_3px_var(--ring)]",
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

      {/* Bridge gradient into the next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-24 h-24 z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, var(--page-bg) 100%)",
        }}
      />
    </section>
  );
}
