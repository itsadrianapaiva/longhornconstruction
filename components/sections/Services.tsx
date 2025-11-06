"use client";

import { SectionShell } from "./SectionShell";
import { useI18n } from "@/lib/i18n/I18nProvider";
import ServicesCarousel from "./ServicesCarousel";

type ServiceItem = {
  key: string;
  title: string;
  desc: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export default function Services() {
  const { t } = useI18n();

  const title = t<string>("services.title", "");
  const intro = t<string>("services.intro", "");
  const items = t<ServiceItem[]>("services.items", []);

  return (
    <SectionShell
      id="services"
      pad="lg"
      container
      maxWidth="7xl"
      innerPx
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-semibold text-ink">
          {title}
        </h2>
        {intro && (
          <p className="mt-3 text-lg text-ink/70 max-w-2xl mx-auto">
            {intro}
          </p>
        )}
      </div>

      {/* Carousel */}
      <ServicesCarousel items={items} />
    </SectionShell>
  );
}
