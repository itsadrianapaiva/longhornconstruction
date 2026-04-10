"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ButtonLink from "@/components/ButtonLink";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { complaintBookUrl, cimaalUrl } from "@/lib/legalLinks";
import SocialLinks from "@/components/SocialLinks";

// Helper: detect and normalize internal hash hrefs like "#id", "/#id", "/en/#id", or same-origin absolute URLs with hash.
// Keeps functions tiny and testable.
function getInternalTargetId(href?: string): string | null {
  if (!href) return null;

  try {
    // If it starts with "#", treat as same-page anchor
    if (href.startsWith("#")) {
      return href.slice(1);
    }

    // Normalize "/#id" or "/locale/#id"
    const hashFromPath =
      href.match(/\/#([\w\-\:]+)/)?.[1] ||
      href.match(/\/[a-zA-Z\-]+\/#([\w\-\:]+)/)?.[1];
    if (hashFromPath) return hashFromPath;

    // Same-origin absolute URLs with a hash
    const url = new URL(
      href,
      typeof window !== "undefined" ? window.location.href : "http://localhost",
    );
    if (
      typeof window !== "undefined" &&
      url.origin === window.location.origin &&
      url.pathname === window.location.pathname &&
      url.hash
    ) {
      return url.hash.replace(/^#/, "");
    }
  } catch {
    // Ignore malformed hrefs gracefully
  }
  return null;
}

// Helper: smooth scroll with reduced-motion fallback.
function scrollToIdNoHash(id: string) {
  const el =
    typeof document !== "undefined" ? document.getElementById(id) : null;
  if (!el) return;
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({
    behavior: prefersReduced ? "auto" : "smooth",
    block: "start",
  });
}

// Helper: detect if we're on the homepage (not an inner page)
function isHomepagePath(
  pathname: string | null,
  locale: string | undefined,
): boolean {
  if (!pathname) return false;
  if (!locale) {
    // default locale homepage (if used)
    return pathname === "/";
  }
  // localized homepage like "/en" or "/pt"
  return pathname === `/${locale}` || pathname === `/${locale}/`;
}

/** Helper: replace {{year}} in i18n template safely */
function withYear(template: string | undefined): string {
  const y = String(new Date().getFullYear());
  return (template ?? "").replace("{{year}}", y);
}

/** Small components to keep the main function tidy */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="mb-3 text-base font-medium uppercase text-white/90">
      {children}
    </h5>
  );
}

function FooterList({
  items,
}: {
  items: Array<React.ReactNode | string | undefined>;
}) {
  return (
    <ul className="flex flex-col gap-3 text-left font-light text-white/70">
      {items.filter(Boolean).map((it, i) => (
        <li key={i}>{it as React.ReactNode}</li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const isHomepage = isHomepagePath(pathname, locale);

  // Pull everything from the provider (SSR-stable)
  const company = t<{
    legalName?: string;
    nif?: string;
    address?: string[];
    email?: string;
    phone?: string;
    logoAlt?: string;
  }>("footer.company", {});

  const services = t<{ title?: string; items?: string[] }>(
    "footer.columns.services",
    {},
  );
  const nav = t<{
    title?: string;
    items?: { label?: string; href?: string }[];
  }>("footer.columns.nav", {});
  const contact = t<{
    title?: string;
    addressLabel?: string;
    phoneLabel?: string;
    emailLabel?: string;
  }>("footer.columns.contact", {});

  const cta = t<{ label?: string; href?: string }>("footer.cta", {});
  const legal = t<{
    privacy?: string;
    terms?: string;
    complaintBook?: string;
    cimaal?: string;
    ral?: string;
    backToTop?: string;
  }>("footer.legalBar", {});
  const copyright = withYear(t<string>("footer.copyright", ""));

  const logoSrc = "/media/logo-footer.jpg"; // same as NavMenu
  const logoAlt = company.logoAlt ?? "Longhorn Construction";

  return (
    <footer
      id="footer"
      className={[
        "bg-black text-white border-t border-white/10",
        // Prevent sideways scroll caused by nested layouts
        "overflow-x-clip",
      ].join(" ")}
    >
      {/* Top area: Bravera-like scale/spacing */}
      <div className="mx-auto max-w-6xl px-8 py-7">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Logo column — spans 2 on lg, centered on small */}
          <div className="col-span-1 lg:col-span-2 mb-4 flex justify-center lg:items-center lg:justify-start">
            <Link
              href={isHomepage ? "#hero" : locale ? `/${locale}` : "/"}
              aria-label="Longhorn Construction Home"
              onClick={(e) => {
                if (isHomepage) {
                  e.preventDefault();
                  scrollToIdNoHash("hero");
                }
              }}
            >
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={384}
                height={110}
                className="w-[19.5rem] md:w-96 h-auto max-w-full"
                priority={false}
              />
            </Link>
          </div>

          {/* Navigate */}
          <div className="mb-8 text-left">
            {nav.title ? <SectionHeading>{nav.title}</SectionHeading> : null}
            <nav aria-label="Footer Navigation">
              <ul className="flex flex-col gap-1 text-left font-light">
                {(nav.items ?? []).map((item, i) => {
                  const originalHref = item?.href ?? "#";
                  const label = item?.label ?? "";
                  const targetId = getInternalTargetId(originalHref);

                  // Special case: contact links go to dedicated page
                  if (targetId === "contact") {
                    return (
                      <li key={i}>
                        <Link
                          href={`/${locale}/contact`}
                          className="inline-flex min-h-8 items-center text-white/70 transition-colors duration-200 ease-[var(--ease-gentle)] hover:text-[color:var(--brand)]"
                        >
                          {label}
                        </Link>
                      </li>
                    );
                  }

                  // On homepage: use original href (e.g., "#stats")
                  // On inner pages: use /${locale}#${targetId} to navigate back to homepage
                  const href = isHomepage
                    ? originalHref
                    : targetId
                      ? `/${locale}#${targetId}`
                      : originalHref;

                  return (
                    <li key={i}>
                      <Link
                        href={href}
                        onClick={(e) => {
                          if (targetId && isHomepage) {
                            e.preventDefault();
                            scrollToIdNoHash(targetId);
                          }
                        }}
                        className="inline-flex min-h-8 items-center text-white/70 transition-colors duration-200 ease-[var(--ease-gentle)] hover:text-[color:var(--brand)]"
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Services — plain text, no links */}
          <div className="mb-8 text-left">
            {services.title ? (
              <SectionHeading>{services.title}</SectionHeading>
            ) : null}
            <FooterList items={(services.items ?? []) as string[]} />
          </div>

          {/* Get in touch — phone, email, address, social links, CTA */}
          <div className="mb-8 text-left">
            {contact.title ? (
              <SectionHeading>{contact.title}</SectionHeading>
            ) : null}
            <FooterList
              items={[
                company.phone ? (
                  <a
                    href={`tel:${(company.phone || "").replace(/\s+/g, "")}`}
                    className="hover:text-[color:var(--brand)]"
                  >
                    {company.phone}
                  </a>
                ) : undefined,
                company.email ? (
                  <a
                    href={`mailto:${company.email}`}
                    className="hover:text-[color:var(--brand)]"
                  >
                    {company.email}
                  </a>
                ) : undefined,
                Array.isArray(company.address) && company.address.length > 0 ? (
                  <div className="text-white/70">
                    {company.address.map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </div>
                ) : undefined,
              ]}
            />

            {/* Social Links */}
            <div className="mt-4">
              <SocialLinks
                label={locale === "pt" ? "Siga nos" : "Follow us"}
                showLabel={true}
                variant="footer"
              />
            </div>

            {/* CTA */}
            {cta?.label && cta?.href
              ? (() => {
                  const originalCtaHref = cta.href;
                  const ctaTargetId = getInternalTargetId(originalCtaHref);

                  // Special case: contact links go to dedicated page
                  if (ctaTargetId === "contact") {
                    return (
                      <div className="mt-4">
                        <ButtonLink
                          href={`/${locale}/contact`}
                          className="justify-center"
                        >
                          {cta.label}
                        </ButtonLink>
                      </div>
                    );
                  }

                  // On homepage: use original href (e.g., "#projects")
                  // On inner pages: use /${locale}#${ctaTargetId} to navigate back to homepage
                  const ctaHref = isHomepage
                    ? originalCtaHref
                    : ctaTargetId
                      ? `/${locale}#${ctaTargetId}`
                      : originalCtaHref;

                  return (
                    <div className="mt-4">
                      <ButtonLink
                        href={ctaHref}
                        onClick={(e) => {
                          if (ctaTargetId && isHomepage) {
                            e.preventDefault();
                            scrollToIdNoHash(ctaTargetId);
                          }
                        }}
                        className="justify-center"
                      >
                        {cta.label}
                      </ButtonLink>
                    </div>
                  );
                })()
              : null}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col-reverse items-start gap-4 border-t border-white/10 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-white/30">{copyright}</p>

          <div className="flex flex-row items-start justify-evenly gap-4 md:items-center md:gap-4">
            <Link
              href={`/${locale}/privacy`}
              className="text-white/30 hover:text-[color:var(--brand)] transition-colors"
            >
              {legal.privacy ?? "Privacy Policy"}
            </Link>
            <span className="text-white/30">|</span>
            <Link
              href={`/${locale}/terms`}
              className="text-white/30 hover:text-[color:var(--brand)] transition-colors"
            >
              {legal.terms ?? "Terms of Service"}
            </Link>
            <span className="text-white/30">|</span>
            <a
              href={complaintBookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-[color:var(--brand)] transition-colors"
            >
              {legal.complaintBook ?? "Complaint book"}
            </a>
            <span className="text-white/30">|</span>
            <a
              href={cimaalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-[color:var(--brand)] transition-colors"
            >
              {legal.cimaal ?? "CIMAAL"}
            </a>
          </div>

          {legal.backToTop ? (
            <button
              type="button"
              className="text-white/30 hover:text-[color:var(--brand)] focus:outline-none focus-visible:shadow-[0_0_0_3px_var(--ring)]"
              onClick={() => {
                const prefersReduced =
                  typeof window !== "undefined" &&
                  window.matchMedia &&
                  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

                window.scrollTo({
                  top: 0,
                  behavior: prefersReduced ? "auto" : "smooth",
                });
              }}
            >
              {legal.backToTop}
            </button>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
