import type { JSX } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { validateLocale, getDictionary } from "@/lib/i18n/getDictionary";
import InnerPageHeroShell from "@/components/InnerPageHeroShell";
import SectionHeader from "@/components/SectionHeader";
import MethodSocialLinks from "@/components/methods/MethodSocialLinks";
import InlineMethodImagePair from "@/components/methods/InlineMethodImagePair";
import RelatedMethodCard from "@/components/methods/RelatedMethodCard";
import MethodBenefits from "@/components/methods/MethodBenefits";
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
  const relatedTitle =
    locale === "en" ? "Related methods" : "Sistemas relacionados";

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
              {/* Inline follow us bar */}
              <MethodSocialLinks locale={locale} variant="inline" />

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
                <div key={section.id}>
                  <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-ink lg:text-3xl">
                      {section.heading}
                    </h2>
                    {section.body.map((paragraph, i) => (
                      <p key={i} className="leading-relaxed text-ink/85">
                        {paragraph}
                      </p>
                    ))}
                  </section>

                  {/* Inject inline image pair after target section */}
                  {article.extraImageGroup &&
                    article.extraImageGroup.afterSectionId === section.id && (
                      <div className="mt-8">
                        <InlineMethodImagePair
                          slug={article.slug}
                          images={article.extraImageGroup.images}
                        />
                      </div>
                    )}
                </div>
              ))}

              {/* Benefits list */}
              {article.benefits && article.benefits.length > 0 && (
                <MethodBenefits locale={locale} benefits={article.benefits} />
              )}
            </div>

            {/* Right column: Related methods sidebar */}
            <div>
              <div className="sticky top-20 space-y-6">
                {/* Related methods heading */}
                <h3 className="text-lg font-bold text-ink">{relatedTitle}</h3>

                {/* Related methods list with vertical cards */}
                <ul className="space-y-6">
                  {article.related.map((relatedSlug) => {
                    const relatedCard = methodsDict.section.cards[relatedSlug];
                    const thumbnailSrc = methodImagePath(
                      relatedSlug,
                      1,
                      "lg",
                      "jpg"
                    );
                    return (
                      <li key={relatedSlug}>
                        <RelatedMethodCard
                          locale={locale}
                          slug={relatedSlug}
                          label={relatedCard.label}
                          tag={relatedCard.tag}
                          thumbnailSrc={thumbnailSrc}
                        />
                      </li>
                    );
                  })}
                </ul>

                {/* Sidebar follow us block */}
                <MethodSocialLinks locale={locale} variant="sidebar" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
