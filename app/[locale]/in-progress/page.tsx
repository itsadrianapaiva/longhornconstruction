import type { JSX } from "react";
import { validateLocale } from "@/lib/i18n/getDictionary";
import InnerPageHeroShell from "@/components/InnerPageHeroShell";
import InProgressHero from "@/components/sections/InProgressHero";
import InProgress from "@/components/sections/InProgress";
import Contact from "@/components/sections/Contact";

type Params = Promise<{ locale?: string }>;

export default async function InProgressPage({
  params,
}: {
  params: Params;
}): Promise<JSX.Element> {
  const { locale: raw } = await params;
  const locale = validateLocale(raw);

  return (
    <>
      <InnerPageHeroShell locale={locale}>
        <InProgressHero />
      </InnerPageHeroShell>

      <div className="w-full">
        <InProgress />
        <Contact />
      </div>
    </>
  );
}
