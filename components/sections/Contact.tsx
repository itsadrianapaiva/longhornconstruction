"use client";

import Image from "next/image";
import { SectionShell } from "@/components/sections/SectionShell";
import ContactFormClient from "@/components/sections/ContactForm.client";
import { MapChatBubble } from "@/components/sections/ContactChatBubble";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

/** i18n types (strict: no fallbacks) */
type Locale = "en" | "pt";
type Person = { name: string; phone?: string; email?: string };

type ContactDict = {
  contact: {
    title: string;
    subtitle: string;
    backgroundAlt: string;
    what: { title: string; intro: string; items: string[] };
    form: unknown; // handled by ContactFormClient
    validate: unknown;
    direct: {
      title: string;
      labels: { phone: string; email: string; hours: string; location: string };
      hours: string;
      location: string;
      people: Person[];
    };
    map: { title: string; serviceArea: string };
  };
};

import enRaw from "@/i18n/en.json";
import ptRaw from "@/i18n/pt.json";
const EN = enRaw as unknown as ContactDict;
const PT = ptRaw as unknown as ContactDict;

/** Locale from first path segment (client-safe) */
function useLocale(): Locale {
  let path = "/";
  if (typeof window !== "undefined") {
    const p = window.location?.pathname;
    path = typeof p === "string" ? p : "/";
  }
  const first = path.split("/").filter(Boolean)[0] ?? "";
  return first === "pt" ? "pt" : "en";
}

/** Read i18n — strict, no defaults/fallbacks */
function useContactCopy() {
  const dict = useLocale() === "pt" ? PT : EN;
  return dict.contact;
}

/** What to expect list (presentational) */
function WhatToExpect({
  title,
  intro,
  items,
}: {
  title: string;
  intro: string;
  items: string[];
}) {
  return (
    <div className="relative mb-2">
      <h3 className="text-3xl font-semibold text-ink">{title}</h3>
      <p className="mt-4 max-w-md text-ink/80">{intro}</p>

      <ul className="mt-8 space-y-8">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 border-b pb-8 border-black/10"
          >
            <span className="mt-1 text-ink/70" aria-hidden="true">
              {/* minimal check icon inline to avoid deps */}
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                <path
                  d="M16.667 5.833L8.75 13.75 5 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="text-ink/85">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Direct contact (icons + global hours/location) */
function DirectContact({
  title,
  labels,
  hours,
  location,
  people,
}: {
  title: string;
  labels: { phone: string; email: string; hours: string; location: string };
  hours: string;
  location: string;
  people: Person[];
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-surface/80 p-6">
      <h4 className="text-xl font-semibold text-ink">{title}</h4>

      {/* Company-level info */}
      <div className="mt-4 space-y-2">
        <p className="flex items-center gap-2 text-ink/80">
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">{labels.hours}: </span>
          <span aria-label={labels.hours}>{hours}</span>
        </p>
        <p className="flex items-center gap-2 text-ink/80">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">{labels.location}: </span>
          <span aria-label={labels.location}>{location}</span>
        </p>
      </div>

      {/* People grid */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {people.map((p, i) => (
          <div key={i} className="space-y-2">
            <p className="font-medium text-ink">{p.name}</p>

            {p.phone ? (
              <p className="flex items-center gap-2 text-ink/80">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">{labels.phone}: </span>
                <a
                  className="underline decoration-ink/20 underline-offset-2 hover:decoration-ink/50"
                  href={`tel:${p.phone.replace(/\s+/g, "")}`}
                  aria-label={`${labels.phone}: ${p.phone}`}
                >
                  {p.phone}
                </a>
              </p>
            ) : null}

            {p.email ? (
              <p className="flex items-center gap-2 text-ink/80">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">{labels.email}: </span>
                <a
                  className="underline decoration-ink/20 underline-offset-2 hover:decoration-ink/50"
                  href={`mailto:${p.email}`}
                  aria-label={`${labels.email}: ${p.email}`}
                >
                  {p.email}
                </a>
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Contact() {
  const copy = useContactCopy();

  return (
    <SectionShell
      id="contact"
      pad="lg"
      container
      maxWidth="7xl"
      innerPx
      className="relative"
      innerClassName="relative"
    >
      {/* Title block */}
      <div className="relative overflow-visible -mb-6">
        <h2 className="text-balance text-center text-5xl font-semibold text-ink md:text-6xl">
          {copy.title}
        </h2>
        <p className="mt-4 text-center text-ink/80">{copy.subtitle}</p>
      </div>

      {/* Glass card with subtle contact background */}
      <div
        className="relative z-10 mt-16 grid items-stretch gap-8 rounded-2xl bg-clip-padding px-6 py-8 backdrop-blur-[12px]
                   shadow-[0_8px_30px_rgba(0,0,0,0.35)] md:grid-cols-2 lg:px-10 lg:py-12"
      >
        {/* Background image behind the glass */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl">
          <Image
            src="/media/contact/contact1.jpg"
            alt={copy.backgroundAlt}
            fill
            sizes="100vw"
            priority={false}
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-surface/70 via-transparent to-surface/70" />
        </div>

        {/* Left: What to expect */}
        <WhatToExpect
          title={copy.what.title}
          intro={copy.what.intro}
          items={copy.what.items}
        />

        {/* Right: the real form with mailto handoff (no fallback button) */}
        <div className="relative flex flex-col">
          <ContactFormClient />
        </div>
      </div>

      {/* Lower grid: Map left, Direct contact right */}
      <div className="relative z-10 mt-6 grid gap-6 lg:grid-cols-2">
        {/* Map with solid chat bubble */}
        <div
          className="relative hidden h-[22rem] overflow-hidden rounded-2xl border border-ink/10 md:block"
          aria-label={copy.map.title}
        >
          <Image
            src="/media/contact/algarve.jpg"
            alt={copy.map.title}
            fill
            sizes="(min-width:1024px) 50vw, 100vw"
            priority={false}
            className="object-cover"
          />
          <MapChatBubble
            message={copy.map.serviceArea}
            className="top-8 left-12"
          />
        </div>

        {/* Direct contact card with icons + hours/location */}
        <DirectContact
          title={copy.direct.title}
          labels={copy.direct.labels}
          hours={copy.direct.hours}
          location={copy.direct.location}
          people={copy.direct.people}
        />
      </div>
    </SectionShell>
  );
}
