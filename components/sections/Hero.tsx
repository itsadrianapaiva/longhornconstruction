// components/sections/Hero.tsx
"use client";

import BackgroundVideo from "@/components/BackgroundVideo";
import { useI18n } from "@/lib/i18n/I18nProvider";
import HeroAnimatedContent from "@/components/animations/HeroAnimatedContent";

export default function Hero() {
  const { t } = useI18n();

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

      {/* Animated content: CEU logo fade-in, button scale+fade, chevron rise+fade */}
      <HeroAnimatedContent arrowTargetId={arrowTargetId} />

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
