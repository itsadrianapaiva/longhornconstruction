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
      className="relative"
    >
      {/* Card-like container with thick border and subtle glassy background */}
      <div className="
        relative rounded-[28px]
        border-[6px] border-brand/25
        bg-white/5 backdrop-blur-sm
        shadow-[0_12px_60px_rgba(0,0,0,0.08)]
        px-5 py-10 md:px-10 md:py-16
      ">
        {/* Optional outer decorative quote in the far corner (very faint) */}
        <div className="pointer-events-none absolute right-6 top-6 opacity-[0.06] hidden md:block" aria-hidden="true">
          <Image src="/media/testimonials/quotation2.svg" alt="" width={140} height={140} />
        </div>

        <TestimonialsScroller items={items} ariaLabels={aria} />
      </div>
    </SectionShell>
  );
}
