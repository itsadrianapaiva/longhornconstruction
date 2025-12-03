"use client";

import Image from "next/image";
import { SectionShell } from "@/components/sections/SectionShell";
import ContactFormClient from "@/components/sections/ContactForm.client";
import { MapChatBubble } from "@/components/sections/ContactChatBubble";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

/** Local shapes to keep props tidy */
type Person = { name: string; phone?: string; email?: string };

type ContactSectionProps = {
  title: string;
  intro: string;
  backgroundAlt: string;
  what: {
    title: string;
    intro: string;
    items: string[];
  };
  direct: {
    title: string;
    labels: {
      phone: string;
      email: string;
      hours: string;
      location: string;
    };
    hours: string;
    location: string;
    people: Person[];
  };
  map: {
    title: string;
    serviceArea: string;
  };
};

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
      <h3 className="text-3xl font-semibold text-ink uppercase text-balance">
        {title}
      </h3>
      <p className="mt-4 max-w-md text-ink/80">{intro}</p>

      <ul className="mt-8 space-y-8">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 border-b border-black/10 pb-8"
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
      <h4 className="text-xl font-semibold text-ink uppercase">{title}</h4>

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

export default function ContactSection({
  backgroundAlt,
  what,
  direct,
  map,
}: ContactSectionProps) {
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

      {/* Glass card with subtle contact background */}
      <div
        className="relative z-10 mt-16 grid items-stretch gap-8 rounded-2xl bg-clip-padding px-6 py-8 backdrop-blur-[12px]
                   shadow-[0_8px_30px_rgba(0,0,0,0.35)] md:grid-cols-2 lg:px-10 lg:py-12"
      >
        {/* Background image behind the glass */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl">
          <Image
            src="/media/contact/contact2.JPEG"
            alt={backgroundAlt}
            fill
            sizes="100vw"
            priority={false}
            className="object-cover opacity-10"
          />
          {/* brand-tinted gradient mask (image → gradients → content) */}
          <div className="absolute inset-0">
            {/* soft brand diagonal tint */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand) 20%, transparent 60%)",
                opacity: 0.28,
              }}
            />
            {/* subtle vertical sky fade using CEU sky tokens */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, var(--sky-700) 0%, var(--sky-500) 35%, transparent 75%)",
              }}
            />
          </div>
        </div>

        {/* Left: What to expect */}
        <WhatToExpect title={what.title} intro={what.intro} items={what.items} />

        {/* Right: the real form with mailto handoff */}
        <div className="relative flex flex-col">
          <ContactFormClient />
        </div>
      </div>

      {/* Lower grid: Map left, Direct contact right */}
      <div className="relative z-10 mt-6 grid gap-6 lg:grid-cols-2">
        {/* Map with solid chat bubble */}
        <div
          className="relative h-[16rem] overflow-hidden rounded-2xl border border-ink/10 md:h-[22rem]"
          aria-label={map.title}
        >
          <Image
            src="/media/contact/algarve.jpg"
            alt={map.title}
            fill
            sizes="100vw"
            priority={false}
            className="object-cover"
          />
          <MapChatBubble
            message={map.serviceArea}
            className="top-4 left-4 md:top-8 md:left-12"
          />
        </div>

        {/* Direct contact card with icons + hours/location */}
        <DirectContact
          title={direct.title}
          labels={direct.labels}
          hours={direct.hours}
          location={direct.location}
          people={direct.people}
        />
      </div>
    </SectionShell>
  );
}

export type { ContactSectionProps };
