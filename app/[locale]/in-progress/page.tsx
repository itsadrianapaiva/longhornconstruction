import type { JSX } from "react";
import { validateLocale, getDictionary } from "@/lib/i18n/getDictionary";
import InnerPageHeroShell from "@/components/InnerPageHeroShell";
import InProgressHero from "@/components/sections/InProgressHero";
import InProgress from "@/components/sections/InProgress";
import Contact from "@/components/sections/Contact";
import { PageCtaBanner } from "@/components/sections/PageCtaBanner";

type Params = Promise<{ locale?: string }>;

export default async function InProgressPage({
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
      <InnerPageHeroShell locale={locale}>
        <InProgressHero />
      </InnerPageHeroShell>

      <div className="w-full">
        <InProgress />
      </div>

      {/* CTA Banner */}
      <PageCtaBanner
        eyebrow={cta.eyebrow}
        title={cta.title}
        body={cta.body}
        primaryHref={`/${locale}/#contact`}
        primaryLabel={cta.primaryLabel}
        secondaryHref={`/${locale}/#projects`}
        secondaryLabel={cta.secondaryLabel}
        backgroundImage="/media/cta/inner-cta.JPEG"
        backgroundAlt={cta.backgroundAlt}
      />

      <Contact />
    </>
  );
}
