"use client";

import BackgroundVideo from "@/components/BackgroundVideo";
import HeroAnimatedContent from "@/components/animations/HeroAnimatedContent";
import { useI18n } from "@/lib/i18n/I18nProvider";

/**
 * Hero
 * - Reads i18n from provider (SSR-stable).
 * - For now, only passes the supported prop(s) to HeroAnimatedContent.
 * - We'll wire chevron/CTA labels in the child next step.
 */
export default function Hero() {
  const { t } = useI18n();

  // Section to reveal when clicking the chevron
  const arrowTargetId = "about";

  // Localized aria for the video/section
  const videoAria = t<string>("hero.videoAriaLabel", "Longhorn Construction hero");

  return (
    <section
      id="hero"
      aria-label={videoAria}
      className="hero relative w-full overflow-clip min-h-svh"
    >
      {/* Background video fills the section */}
      <div className="absolute inset-0">
        <BackgroundVideo height="h-full" opacity="opacity-100" zoom={1.0} focal="50% 40%" />
      </div>

      {/* Animated content (only pass supported props for now) */}
      <HeroAnimatedContent arrowTargetId={arrowTargetId} />

      {/* Bridge gradient into the next section */}
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
