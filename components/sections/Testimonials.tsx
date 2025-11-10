"use client";

import { SectionShell } from "./SectionShell";
import { TestimonialsScroller } from "@/components/interactive/TestimonialsScroller";
import { useI18n } from "@/lib/i18n/I18nProvider";

type Testimonial = {
  quote: string;
  highlights?: string[];
  author: { name: string };
  avatarHint?: string;
};

type AriaLabels = {
  regionLabel: string;
  pause: string;
  play: string;
  next: string;
  prev: string;
};

export default function Testimonials() {
  const { t } = useI18n();

  const items = t<Testimonial[]>("testimonials.items", []);
  const aria = t<AriaLabels>("testimonials.aria", {
    regionLabel: "Client testimonials",
    pause: "Pause auto-scroll",
    play: "Resume auto-scroll",
    next: "Show next testimonial",
    prev: "Show previous testimonial",
  });

  return (
    <SectionShell
      id="testimonials"
      pad="lg"
      container
      maxWidth="6xl"
      innerPx
      // Clip x at the section level, allow vertical effects
      className="relative isolate overflow-x-clip"
    >
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-balance text-5xl font-semibold text-ink md:text-6xl">
          Hear from our trusted clients
        </h2>
      </div>

      {/* Full-bleed, round glow anchored to the viewport, behind everything */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-y-0 -z-10
          left-[calc(50%-50svw)] w-[100svw]
        "
      >
        {/* Centered circular bloom sized with vmin so it stays round */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "140vmin",
            height: "140vmin",
            background:
              "radial-gradient(circle at center," +
              "color-mix(in srgb, var(--brand) 56%, transparent) 0%," +
              "color-mix(in srgb, var(--ring) 44%, transparent) 34%," +
              "transparent 72%)",
            filter: "blur(48px)",
            opacity: 0.9,
          }}
        />
      </div>

      {/* Content centered above the glow */}
      <div className="relative mx-auto max-w-5xl">
        <TestimonialsScroller items={items} ariaLabels={aria} />
      </div>
    </SectionShell>
  );
}
