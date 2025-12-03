import type { JSX } from "react";
import { validateLocale, getDictionary } from "@/lib/i18n/getDictionary";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Methods from "@/components/sections/Methods";
import Testimonials from "@/components/sections/Testimonials";
import { PageCtaBanner } from "@/components/sections/PageCtaBanner";

type Params = Promise<{ locale?: string }>;

// Prod will have only MVP sections to go live asap
export default async function Page({
  params,
}: {
  params: Params;
}): Promise<JSX.Element> {
  const { locale: raw } = await params;
  const locale = validateLocale(raw);

  // Get CTA content from dictionary
  const dict = await getDictionary(locale);
  const cta = dict.cta.innerBanner;

  return (
    <>
      <Hero />
      <About />
      <Stats />
      <Methods />
      <Services />
      <Projects />
      <Testimonials />

      {/* CTA Banner - primary button links to new contact page */}
      <PageCtaBanner
        eyebrow={cta.eyebrow}
        title={cta.title}
        body={cta.body}
        primaryHref={`/${locale}/contact`}
        primaryLabel={cta.primaryLabel}
        secondaryHref={`/${locale}/#projects`}
        secondaryLabel={cta.secondaryLabel}
        backgroundImage="/media/cta/inner-cta.JPEG"
        backgroundAlt={cta.backgroundAlt}
      />
    </>
  );
}
