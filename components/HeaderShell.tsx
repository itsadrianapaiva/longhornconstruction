"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import type { NavItem } from "@/components/NavMenu";
import type { Locale } from "@/lib/i18n/getDictionary";

type HeaderShellProps = {
  locale: Locale;
  items: NavItem[];
  ctaLabel: string;
  logoSrc: string;
  logoAlt: string;
  className?: string;
};

/**
 * Route-aware header wrapper that:
 * - Shows Header only on homepage routes (/<locale>)
 * - Returns null on inner pages (/<locale>/*)
 * This prevents duplicate headers when inner pages use InnerPageHeroShell
 */
export default function HeaderShell({
  locale,
  items,
  ctaLabel,
  logoSrc,
  logoAlt,
  className,
}: HeaderShellProps) {
  const pathname = usePathname();

  // Check if we're on the homepage for this locale
  const isHomepage = pathname === `/${locale}` || pathname === `/${locale}/`;

  // On inner pages, don't render the homepage header
  // (InnerPageHeader will be rendered by InnerPageHeroShell instead)
  if (!isHomepage) {
    return null;
  }

  // On homepage, render the header with scroll mode
  return (
    <Header
      items={items}
      className={className}
      ctaLabel={ctaLabel}
      ctaTargetId="contact"
      logoSrc={logoSrc}
      logoAlt={logoAlt}
    />
  );
}
