"use client";

import { ComponentProps } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NavMenu, { NavItem } from "@/components/NavMenu";

type HeaderProps = {
  /** Drawer items -> section ids + localized labels */
  items: NavItem[];
  /** Localized CTA label and optional target id/logo for the drawer */
  ctaLabel?: string;
  ctaTargetId?: string;
  logoSrc?: string;
  logoAlt?: string;
} & ComponentProps<"header">;

export default function Header({
  items,
  ctaLabel,
  ctaTargetId,
  logoSrc,
  logoAlt,
  className,
  ...rest
}: HeaderProps) {
  return (
    <header
      {...rest}
      className={[
        "absolute inset-x-0 top-0 z-50",
        "h-14 bg-transparent",
        className,
      ].join(" ")}
      role="banner"
    >
      <div
        className={[
          "mx-auto max-w-screen-xl",
          "px-4 sm:px-6",
          "h-full",
          "flex items-center justify-between",
        ].join(" ")}
      >
        {/* Left: Language Switcher (visible at all sizes) */}
        <div className="mr-2">
          <LanguageSwitcher compact />
        </div>

        {/* Right: Hamburger (mobile only). Desktop hides it via internal lg:hidden. */}
        <NavMenu
          items={items}
          ctaLabel={ctaLabel}
          ctaTargetId={ctaTargetId}
          logoSrc={logoSrc}
          logoAlt={logoAlt}
        />
      </div>
    </header>
  );
}
