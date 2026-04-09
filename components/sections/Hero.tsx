"use client";

import BackgroundVideo from "@/components/BackgroundVideo";
import HeroAnimatedContent from "@/components/animations/HeroAnimatedContent";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function Hero() {
  const { t } = useI18n();
  const arrowTargetId = "about";
  const videoAria = t<string>(
    "hero.videoAriaLabel",
    "Longhorn Construction hero",
  );

  return (
    <section
      id="hero"
      aria-label={videoAria}
      className="hero relative w-full overflow-clip min-h-svh"
    >
      <div className="absolute inset-0">
        <BackgroundVideo
          height="h-full"
          opacity="opacity-100"
          zoom={1.0}
          focal="50% 40%"
        />
      </div>

      {/* Dark overlay for readability */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
    linear-gradient(
      to bottom,
      rgba(0,0,0,0.55) 0%,
      rgba(0,0,0,0.35) 40%,
      rgba(0,0,0,0.25) 70%,
      rgba(0,0,0,0.10) 100%
    )
  `,
        }}
      />

      <HeroAnimatedContent arrowTargetId={arrowTargetId} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-24 z-0 h-24"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, var(--page-bg) 100%)",
        }}
      />
    </section>
  );
}
