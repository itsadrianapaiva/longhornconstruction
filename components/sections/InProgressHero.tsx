"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import SectionHeader from "@/components/SectionHeader";

type InProgressHeroDict = {
  title: string;
  intro: string;
};

export default function InProgressHero() {
  const { t } = useI18n();

  const dict = t<InProgressHeroDict>("inProgress", {
    title: "",
    intro: "",
  });

  return (
    <div className="px-4 py-12 sm:py-16">
      <SectionHeader
        title={dict.title}
        intro={dict.intro}
        className="mx-auto max-w-2xl"
        titleClassName="text-white"
        introClassName="text-white/85"
      />
    </div>
  );
}
