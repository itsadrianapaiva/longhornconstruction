import type { JSX } from "react";
import type { Locale } from "@/lib/i18n/getDictionary";

/**
 * Benefits list component for method articles
 * Displays key benefits in a styled card with bullet points
 */
export default function MethodBenefits({
  locale,
  benefits,
}: {
  locale: Locale;
  benefits: string[];
}): JSX.Element {
  const title = locale === "en" ? "Key Benefits" : "Benefícios Principais";

  return (
    <div className="rounded-2xl border border-[color:var(--card-border,rgba(255,255,255,0.22))] bg-[color:var(--card-bg,rgba(255,255,255,0.06))] p-6 backdrop-blur-sm dark:bg-[color:var(--card-bg-dark,rgba(0,0,0,0.25))]">
      <h3 className="mb-4 text-lg font-bold text-ink">{title}</h3>
      <ul className="space-y-2">
        {benefits.map((benefit, i) => (
          <li key={i} className="flex items-start">
            <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[color:var(--brand)]" />
            <span className="text-ink/85">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
