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
      className="hero relative w-full overflow-clip min-h-svh"
    >
      {/* Background video fills the section */}
      <div className="absolute inset-0">
        <BackgroundVideo height="h-full" opacity="opacity-100" zoom={1.0} focal="50% 40%" />
        {/* Removed hero__overlay to ensure no top fade at all */}
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

      {/* Bridge gradient: overlaps into the next section so the video edge is never visible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-24 h-24 z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, var(--page-bg) 100%)",
        }}
      />
      {/* If a seam is still visible, try -bottom-32 h-32 or -bottom-40 h-40 */}
    </section>
  );
}
