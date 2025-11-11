// components/sections/Services.tsx
"use client";

import { SectionShell } from "./SectionShell";
import { useI18n } from "@/lib/i18n/I18nProvider";
import ServicesCarousel from "./ServicesCarousel";
import SectionHeader from "@/components/SectionHeader";

type ServiceItem = {
  key: string;
  title: string;
  desc: string;
  image: { src: string; alt: string; width: number; height: number };
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
      className="relative isolate overflow-x-hidden"
    >
      <SectionHeader
        title={title}
        intro={intro}
        titleClassName="text-ink"
        introClassName="text-ink/85"
      />

      <div className="mt-10 min-w-0 max-w-full overflow-x-hidden">
        <ServicesCarousel items={items} />
      </div>
    </SectionShell>
  );
}
