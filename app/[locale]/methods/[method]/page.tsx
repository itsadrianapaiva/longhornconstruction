import type { JSX } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  validateLocale,
  getDictionary,
} from "@/lib/i18n/getDictionary";
import InnerPageHeroShell from "@/components/InnerPageHeroShell";
import SectionHeader from "@/components/SectionHeader";
import { I18nProvider } from "@/lib/i18n/I18nProvider";

type Params = Promise<{ locale?: string; method?: string }>;

// Valid method slugs
const VALID_METHODS = ["traditional", "icf", "lsf"] as const;
type Method = (typeof VALID_METHODS)[number];

function isValidMethod(method: string | undefined): method is Method {
  return VALID_METHODS.includes(method as Method);
}

type MethodCard = {
  label: string;
  tag: string;
  excerpt: string;
};

type MethodsDict = {
  section: {
    cards: {
      traditional: MethodCard;
      icf: MethodCard;
      lsf: MethodCard;
    };
  };
};

export default async function MethodPage({
  params,
}: {
  params: Params;
}): Promise<JSX.Element> {
  const { locale: raw, method: methodSlug } = await params;
  const locale = validateLocale(raw);

  // Validate method slug
  if (!isValidMethod(methodSlug)) {
    notFound();
  }

  const method = methodSlug;

  // Get dictionary
  const dict = await getDictionary(locale);
  const methodsDict = dict.methods as MethodsDict;
  const card = methodsDict.section.cards[method];

  // Get other methods for "Related methods" sidebar
  const otherMethods = VALID_METHODS.filter((m) => m !== method);

  // Placeholder content by locale
  const placeholders = {
    en: {
      relatedTitle: "Related methods",
      aboutHeading: `About ${card.label}`,
      para1:
        "This is a placeholder section for detailed content about this construction method. The full article content will be implemented in the next iteration.",
      para2:
        "For now, this page demonstrates the basic structure: hero section with background video, main content area, and related methods sidebar.",
    },
    pt: {
      relatedTitle: "Sistemas relacionados",
      aboutHeading: `Sobre ${card.label}`,
      para1:
        "Esta é uma secção de placeholder para conteúdo detalhado sobre este sistema construtivo. O conteúdo completo do artigo será implementado na próxima iteração.",
      para2:
        "Por agora, esta página demonstra a estrutura básica: secção hero com vídeo de fundo, área de conteúdo principal e barra lateral de sistemas relacionados.",
    },
  };

  const content = placeholders[locale];

  return (
    <I18nProvider locale={locale} dict={dict}>
      <InnerPageHeroShell locale={locale}>
        {/* Hero content */}
        <div className="px-4 py-12 sm:py-16">
          <SectionHeader
            title={card.label}
            intro={card.excerpt}
            className="mx-auto max-w-2xl"
            titleClassName="text-white"
            introClassName="text-white/85"
          />
        </div>
      </InnerPageHeroShell>

      {/* Main content area */}
      <div className="w-full bg-[color:var(--surface)]">
        <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            {/* Left column: Main content */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-ink lg:text-3xl">
                {content.aboutHeading}
              </h2>
              <p className="leading-relaxed text-ink/85">{content.para1}</p>
              <p className="leading-relaxed text-ink/85">{content.para2}</p>
            </div>

            {/* Right column: Related methods sidebar */}
            <div>
              <div className="rounded-2xl border border-[color:var(--card-border,rgba(255,255,255,0.22))] bg-[color:var(--card-bg,rgba(255,255,255,0.06))] p-6 backdrop-blur-sm dark:bg-[color:var(--card-bg-dark,rgba(0,0,0,0.25))]">
                <h3 className="mb-4 text-lg font-bold text-ink">
                  {content.relatedTitle}
                </h3>
                <ul className="space-y-3">
                  {otherMethods.map((otherMethod) => {
                    const otherCard = methodsDict.section.cards[otherMethod];
                    return (
                      <li key={otherMethod}>
                        <Link
                          href={`/${locale}/methods/${otherMethod}`}
                          className="group block rounded-lg border border-transparent p-3 transition-all duration-200 hover:border-[color:var(--brand)] hover:bg-[color:var(--brand)]/5"
                        >
                          <div className="font-medium text-ink group-hover:text-[color:var(--brand)]">
                            {otherCard.label}
                          </div>
                          <div className="mt-1 text-sm text-ink/70">
                            {otherCard.tag}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </I18nProvider>
  );
}
