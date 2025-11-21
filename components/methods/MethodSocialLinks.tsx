import type { JSX } from "react";
import type { Locale } from "@/lib/i18n/getDictionary";
import CeuSocialLinks from "@/components/CeuSocialLinks";

/**
 * Social media links component for method articles
 * Now a thin wrapper around CeuSocialLinks to maintain API compatibility
 */
export default function MethodSocialLinks({
  locale,
  variant = "inline",
}: {
  locale: Locale;
  variant?: "inline" | "sidebar";
}): JSX.Element {
  const label = locale === "en" ? "Follow us" : "Siga nos";

  // Map variant to CeuSocialLinks variant
  const ceuVariant = variant === "inline" ? "inline" : "footer";

  // Preserve mb-6 spacing for inline variant to match previous layout
  const outerClassName = variant === "inline" ? "mb-6" : "";

  return (
    <CeuSocialLinks
      label={label}
      showLabel={true}
      variant={ceuVariant}
      className={outerClassName}
    />
  );
}
