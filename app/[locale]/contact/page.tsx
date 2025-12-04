import type { JSX } from "react";
import { validateLocale, getDictionary } from "@/lib/i18n/getDictionary";
import InnerPageHeroShell from "@/components/InnerPageHeroShell";
import ContactSection from "@/components/sections/ContactSection";
import SectionHeader from "@/components/SectionHeader";

type Params = Promise<{ locale?: string }>;

export default async function ContactPage({
  params,
}: {
  params: Params;
}): Promise<JSX.Element> {
  const { locale: raw } = await params;
  const locale = validateLocale(raw);

  // Get contact content from dictionary
  const dict = await getDictionary(locale);

  return (
    <>
      <InnerPageHeroShell locale={locale}>
        {/* Hero content */}
        <div className="px-4 py-12 sm:py-16">
                  <SectionHeader
                    title={dict.contact.title}
                    intro={dict.contact.intro}
                    className="mx-auto max-w-4xl"
                    titleClassName="text-white"
                    introClassName="text-white/85"
                  />
                </div>
      </InnerPageHeroShell>

      {/* Contact section below hero */}
      <ContactSection
        title={dict.contact.title}
        intro={dict.contact.intro}
        backgroundAlt={dict.contact.backgroundAlt}
        what={{
          title: dict.contact.what.title,
          intro: dict.contact.what.intro,
          items: dict.contact.what.items,
        }}
        direct={{
          title: dict.contact.direct.title,
          labels: dict.contact.direct.labels,
          hours: dict.contact.direct.hours,
          location: dict.contact.direct.location,
          people: dict.contact.direct.people,
        }}
        map={{
          title: dict.contact.map.title,
          serviceArea: dict.contact.map.serviceArea,
        }}
        locale={locale}
      />
    </>
  );
}
