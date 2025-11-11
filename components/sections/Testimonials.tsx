// components/sections/Testimonials.tsx
"use client";

import { SectionShell } from "./SectionShell";
import { TestimonialsScroller } from "@/components/interactive/TestimonialsScroller";
import { useI18n } from "@/lib/i18n/I18nProvider";
import SectionHeader from "@/components/SectionHeader";

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

  const title = t<string>("testimonials.title", "");
  const intro = t<string>("testimonials.intro", "");
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
      className="relative isolate overflow-x-clip"
    >
      <SectionHeader
        title={title}
        intro={intro}
        className="mb-16"
        titleClassName="text-ink"
        introClassName="text-ink/85"
      />

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
