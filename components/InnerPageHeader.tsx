"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nProvider";
import NavMenu, { type NavItem } from "@/components/NavMenu";
import ButtonLink from "@/components/ButtonLink";
import type { Locale } from "@/lib/i18n/getDictionary";

type InnerHeaderDict = {
  mainNavLabel: string;
  home: string;
};

type NavDict = {
  home: string;
  about: string;
  stats: string;
  services: string;
  projects: string;
  sismo: string;
  testimonials: string;
  contact: string;
};

type HeroDict = {
  primaryCta: string;
};

type InnerPageHeaderProps = {
  locale: Locale;
  className?: string;
};

export default function InnerPageHeader({ locale, className }: InnerPageHeaderProps) {
  const { t } = useI18n();

  const innerHeader = t<InnerHeaderDict>("innerHeader", {
    mainNavLabel: "",
    home: "",
  });

  const nav = t<NavDict>("nav", {
    home: "",
    about: "",
    stats: "",
    services: "",
    projects: "",
    sismo: "",
    testimonials: "",
    contact: "",
  });

  const hero = t<HeroDict>("hero", {
    primaryCta: "",
  });

  // Desktop nav links back to homepage sections
  const desktopNavLinks = [
    { label: innerHeader.home, href: `/${locale}#hero` },
    { label: nav.about, href: `/${locale}#about` },
    { label: nav.services, href: `/${locale}#services` },
    { label: nav.projects, href: `/${locale}#projects` },
    { label: nav.contact, href: `/${locale}#contact` },
  ];

  // Mobile drawer items (section IDs for scrolling)
  const mobileNavItems: NavItem[] = [
    { id: "hero", label: nav.home },
    { id: "about", label: nav.about },
    { id: "stats", label: nav.stats },
    { id: "services", label: nav.services },
    { id: "projects", label: nav.projects },
    { id: "sismo", label: nav.sismo },
    { id: "testimonials", label: nav.testimonials },
    { id: "contact", label: nav.contact },
  ];

  return (
    <header
      className={[
        "absolute inset-x-0 top-0 z-50",
        "h-14",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="banner"
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Mobile: logo + hamburger */}
        <div className="flex items-center justify-between w-full md:hidden">
          <Link href={`/${locale}`} aria-label="Go to homepage">
            <Image
              src="/media/logo-white.png"
              alt="CÉU Construction"
              width={160}
              height={43}
              priority={false}
              className="w-40 h-auto"
            />
          </Link>
          <NavMenu
            items={mobileNavItems}
            ctaLabel={hero.primaryCta}
            ctaTargetId="contact"
            logoSrc="/media/logo-white.png"
            logoAlt="CÉU Construction"
          />
        </div>

        {/* Desktop: logo + nav + CTA */}
        <div className="hidden md:flex items-center justify-between w-full">
          <Link href={`/${locale}`} aria-label="Go to homepage">
            <Image
              src="/media/logo-white.png"
              alt="CÉU Construction"
              width={180}
              height={49}
              priority={false}
              className="w-44 h-auto"
            />
          </Link>

          <nav aria-label={innerHeader.mainNavLabel}>
            <ul className="flex items-center gap-6">
              {desktopNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium uppercase tracking-wide text-white/90 hover:text-[color:var(--brand)] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <ButtonLink href={`/${locale}#contact`} className="text-white">
                  {hero.primaryCta}
                </ButtonLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
