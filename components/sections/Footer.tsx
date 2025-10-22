"use client";

import Image from "next/image";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";

/** Locale & i18n (kept local and tiny) */
type Locale = "en" | "pt";
type FooterDict = {
  footer?: {
    company?: {
      legalName?: string;
      nif?: string;
      address?: string[];
      email?: string;
      phone?: string;
      logoAlt?: string;
    };
    columns?: {
      services?: { title?: string; items?: string[] };
      nav?: { title?: string; items?: { label?: string; href?: string }[] };
      contact?: {
        title?: string;
        addressLabel?: string;
        phoneLabel?: string;
        emailLabel?: string;
      };
    };
    cta?: { label?: string; href?: string };
    legalBar?: {
      privacy?: string;
      terms?: string;
      sitemap?: string;
      backToTop?: string;
    };
    copyright?: string;
  };
};

import enRaw from "@/i18n/en.json";
import ptRaw from "@/i18n/pt.json";
const EN: FooterDict = enRaw as unknown as FooterDict;
const PT: FooterDict = ptRaw as unknown as FooterDict;

/** Small helpers (keep main render lean) */
function useLocale(): Locale {
  let first = "";
  if (typeof window !== "undefined") {
    const p = window.location?.pathname ?? "/";
    first = p.split("/").filter(Boolean)[0] ?? "";
  }
  return first === "pt" ? "pt" : "en";
}
function withYear(template: string | undefined): string {
  const y = String(new Date().getFullYear());
  return (template ?? "").replace("{{year}}", y);
}

/** Small components to keep the main function under guardrails */
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
      {items
        .filter(Boolean)
        .map((it, i) => (
          <li key={i}>{it as React.ReactNode}</li>
        ))}
    </ul>
  );
}

export default function Footer() {
  const dict = useLocale() === "pt" ? PT.footer : EN.footer;

  const company = dict?.company ?? {};
  const cols = dict?.columns ?? {};
  const services = cols.services ?? {};
  const nav = cols.nav ?? {};
  const contact = cols.contact ?? {};
  const cta = dict?.cta ?? {};
  const legal = dict?.legalBar ?? {};

  const logoSrc = "/media/logo-white.png"; // same as NavMenu
  const logoAlt = company.logoAlt ?? "CÉU Construction";
  const copyright = withYear(dict?.copyright);

  return (
    <footer
      id="footer"
      className={[
        "bg-black text-white border-t border-white/10",
        // Prevent any sideways scrolling caused by nested layouts
        "overflow-x-clip",
      ].join(" ")}
    >
      {/* Top area: mirror Bravera scale/spacing */}
      <div className="mx-auto max-w-6xl px-8 py-7">
        {/* Bravera-like grid: 1 / 2 / 5 with larger gaps at lg */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Logo column — spans 2 on lg, centered on small */}
          <div className="col-span-1 lg:col-span-2 mb-4 flex justify-center lg:items-center lg:justify-start">
            <Link href="#" aria-label="CÉU Construction Home">
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

          {/* Navigate (left column of the right block on lg) */}
          <div className="mb-8 text-left">
            {nav.title ? <SectionHeading>{nav.title}</SectionHeading> : null}
            <nav aria-label="Footer Navigation">
              <ul className="flex flex-col gap-1 text-left font-light">
                {(nav.items ?? []).map((item, i) => {
                  const href = item.href ?? "#";
                  const label = item.label ?? "";
                  return (
                    <li key={i}>
                      <Link
                        href={href}
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

          {/* Services (middle column) — plain text, no links */}
          <div className="mb-8 text-left">
            {services.title ? (
              <SectionHeading>{services.title}</SectionHeading>
            ) : null}
            <FooterList items={(services.items ?? []) as string[]} />
          </div>

          {/* Get in touch (right column) — phone, email, ADDRESS LAST */}
          <div className="mb-8 text-left">
            {contact.title ? <SectionHeading>{contact.title}</SectionHeading> : null}
            <FooterList
              items={[
                company.phone ? (
                  <a
                    href={`tel:${company.phone.replace(/\s+/g, "")}`}
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
                // Address LAST (stacked lines)
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

            {/* CTA — same component, Bravera-like spacing */}
            {cta?.label && cta?.href ? (
              <div className="mt-4">
                <ButtonLink href={cta.href} className="justify-center">
                  {cta.label}
                </ButtonLink>
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom bar — Bravera-like spacing, size, and separators */}
        <div className="mt-6 flex flex-col-reverse items-start gap-4 border-t border-white/10 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-white/30">{copyright}</p>

          <div className="flex flex-row items-start justify-evenly gap-4 md:items-center md:gap-4">
            {/* Placeholders for now; we’ll wire routes later */}
            <span className="text-white/30">{legal.privacy ?? "Privacy Policy"}</span>
            <span className="text-white/30">|</span>
            <span className="text-white/30">{legal.terms ?? "Terms of Service"}</span>
            <span className="text-white/30">|</span>
            <span className="text-white/30">{legal.sitemap ?? "Sitemap"}</span>
          </div>

          {/* Optional back-to-top if provided in i18n */}
          {legal.backToTop ? (
            <button
              type="button"
              className="text-white/30 hover:text-[color:var(--brand)] focus:outline-none focus-visible:shadow-[0_0_0_3px_var(--ring)]"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              {legal.backToTop}
            </button>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
