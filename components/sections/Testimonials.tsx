// components/sections/Testimonials.tsx
"use client";

import Image from "next/image";
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
      className="relative overflow-hidden"
    >
      {/* Decorative quotes SVG (optional; won’t crash if missing) */}
      <div
        className="absolute top-8 right-8 w-48 h-48 opacity-[0.06] pointer-events-none"
        aria-hidden="true"
      >
        <Image
          src="/media/testimonials/aspas.svg"
          alt=""
          width={192}
          height={192}
          className="w-full h-full object-contain"
          priority={false}
        />
      </div>

      <TestimonialsScroller items={items} ariaLabels={aria} />
    </SectionShell>
  );
}
