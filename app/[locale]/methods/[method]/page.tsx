import type { JSX } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { validateLocale, getDictionary } from "@/lib/i18n/getDictionary";
import InnerPageHeroShell from "@/components/InnerPageHeroShell";
import SectionHeader from "@/components/SectionHeader";
import type { MethodSlug } from "@/lib/methods/types";
import { getMethodArticle } from "@/lib/methods/getMethodArticle";
import { methodImagePath } from "@/lib/methods/images";

type Params = Promise<{ locale?: string; method?: string }>;

// Valid method slugs
const VALID_METHODS: readonly MethodSlug[] = ["traditional", "icf", "lsf"];

function isValidMethod(method: string | undefined): method is MethodSlug {
  return VALID_METHODS.includes(method as MethodSlug);
}

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

  // Get article content
  const article = getMethodArticle(locale, methodSlug);

  // Get dictionary for sidebar labels
  const dict = await getDictionary(locale);
  const methodsDict = dict.methods as {
    section: {
      cards: Record<MethodSlug, { label: string; tag: string }>;
    };
  };

  // Sidebar title by locale
  const relatedTitle = locale === "en" ? "Related methods" : "Sistemas relacionados";

  // Hero image path
  const heroImgSrc = methodImagePath(
    article.slug,
    article.heroImage.index,
    "lg",
    "jpg"
  );

  return (
    <>
      <InnerPageHeroShell locale={locale}>
        {/* Hero content */}
        <div className="px-4 py-12 sm:py-16">
          <SectionHeader
            title={article.title}
            intro={article.subtitle}
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
            <div className="space-y-8">
              {/* Hero image */}
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src={heroImgSrc}
                  alt={article.heroImage.alt}
                  width={1200}
                  height={800}
                  className="h-auto w-full"
                  priority={false}
                />
              </div>

              {/* Intro paragraph */}
              <p className="text-lg leading-relaxed text-ink/85">
                {article.intro}
              </p>

              {/* Article sections */}
              {article.sections.map((section) => (
                <section key={section.id} className="space-y-4">
                  <h2 className="text-2xl font-bold text-ink lg:text-3xl">
                    {section.heading}
                  </h2>
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="leading-relaxed text-ink/85">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}

              {/* Benefits list (if present) */}
              {article.benefits && article.benefits.length > 0 && (
                <div className="rounded-2xl border border-[color:var(--card-border,rgba(255,255,255,0.22))] bg-[color:var(--card-bg,rgba(255,255,255,0.06))] p-6 backdrop-blur-sm dark:bg-[color:var(--card-bg-dark,rgba(0,0,0,0.25))]">
                  <h3 className="mb-4 text-lg font-bold text-ink">
                    {locale === "en" ? "Key Benefits" : "Benefícios Principais"}
                  </h3>
                  <ul className="space-y-2">
                    {article.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[color:var(--brand)]" />
                        <span className="text-ink/85">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right column: Related methods sidebar */}
            <div>
              <div className="sticky top-20 rounded-2xl border border-[color:var(--card-border,rgba(255,255,255,0.22))] bg-[color:var(--card-bg,rgba(255,255,255,0.06))] p-6 backdrop-blur-sm dark:bg-[color:var(--card-bg-dark,rgba(0,0,0,0.25))]">
                <h3 className="mb-4 text-lg font-bold text-ink">
                  {relatedTitle}
                </h3>
                <ul className="space-y-3">
                  {article.related.map((relatedSlug) => {
                    const relatedCard = methodsDict.section.cards[relatedSlug];
                    return (
                      <li key={relatedSlug}>
                        <Link
                          href={`/${locale}/methods/${relatedSlug}`}
                          className="group block rounded-lg border border-transparent p-3 transition-all duration-200 hover:border-[color:var(--brand)] hover:bg-[color:var(--brand)]/5"
                        >
                          <div className="font-medium text-ink group-hover:text-[color:var(--brand)]">
                            {relatedCard.label}
                          </div>
                          <div className="mt-1 text-sm text-ink/70">
                            {relatedCard.tag}
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
    </>
  );
}
