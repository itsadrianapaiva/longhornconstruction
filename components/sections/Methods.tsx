"use client";

import { SectionShell } from "@/components/sections/SectionShell";
import { useI18n } from "@/lib/i18n/I18nProvider";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";

type MethodCard = {
  label: string;
  tag: string;
  excerpt: string;
};

type MethodsSection = {
  id: string;
  title: string;
  intro: string;
  seeAllLabel: string;
  cards: {
    traditional: MethodCard;
    icf: MethodCard;
    lsf: MethodCard;
  };
};

function MethodCardComponent({
  method,
  href,
  featured = false,
}: {
  method: MethodCard;
  href: string;
  featured?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        group relative overflow-hidden rounded-2xl
        border border-[color:var(--card-border,rgba(255,255,255,0.22))]
        bg-[color:var(--card-bg,rgba(255,255,255,0.06))]
        dark:bg-[color:var(--card-bg-dark,rgba(0,0,0,0.25))]
        backdrop-blur-sm
        shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]
        ${featured ? "p-8 lg:p-10" : "p-6 lg:p-8"}
      `}
    >
      <div className="flex h-full flex-col">
        {/* Tag */}
        <div className="mb-3">
          <span className="inline-block rounded-full bg-[color:var(--brand)] bg-opacity-10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[color:var(--brand)]">
            {method.tag}
          </span>
        </div>

        {/* Label/Title */}
        <h3
          className={`
            mb-4 font-bold text-ink
            ${featured ? "text-3xl lg:text-4xl" : "text-2xl lg:text-3xl"}
          `}
        >
          {method.label}
        </h3>

        {/* Excerpt */}
        <p
          className={`
            flex-1 leading-relaxed text-ink/85
            ${featured ? "text-base lg:text-lg" : "text-sm lg:text-base"}
          `}
        >
          {method.excerpt}
        </p>

        {/* Hover indicator */}
        <div className="mt-6 flex items-center text-sm font-medium text-[color:var(--brand)] transition-transform duration-300 group-hover:translate-x-1">
          <span>Learn more</span>
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function Methods() {
  const { t, locale } = useI18n();

  // Fetch section data with type safety
  const section = t<MethodsSection>("methods.section", {
    id: "methods",
    title: "",
    intro: "",
    seeAllLabel: "",
    cards: {
      traditional: { label: "", tag: "", excerpt: "" },
      icf: { label: "", tag: "", excerpt: "" },
      lsf: { label: "", tag: "", excerpt: "" },
    },
  });

  const { traditional, icf, lsf } = section.cards;

  return (
    <SectionShell
      id={section.id}
      pad="lg"
      container
      maxWidth="7xl"
      innerPx
      className="relative"
    >
      {/* Header */}
      <SectionHeader
        title={section.title}
        intro={section.intro}
        className="mx-auto mb-12 max-w-3xl lg:mb-16"
        titleClassName="text-ink"
        introClassName="text-ink/85"
      />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:auto-rows-[minmax(20rem,1fr)] lg:grid-cols-3">
        {/* Traditional - Small card on desktop, first on mobile */}
        <div className="lg:col-span-1 lg:row-span-1">
          <MethodCardComponent
            method={traditional}
            href={`/${locale}/methods/traditional`}
          />
        </div>

        {/* ICF - Large featured card on desktop, second on mobile */}
        <div className="lg:col-span-2 lg:row-span-2">
          <MethodCardComponent
            method={icf}
            href={`/${locale}/methods/icf`}
            featured
          />
        </div>

        {/* LSF - Small card on desktop, last on mobile */}
        <div className="lg:col-span-1 lg:row-span-1">
          <MethodCardComponent
            method={lsf}
            href={`/${locale}/methods/lsf`}
          />
        </div>
      </div>
    </SectionShell>
  );
}
