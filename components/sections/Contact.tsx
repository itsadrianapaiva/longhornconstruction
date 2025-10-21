"use client";

import Image from "next/image";
import { SectionShell } from "@/components/sections/SectionShell";
import ButtonLink from "@/components/ButtonLink";

/** i18n types */
type Locale = "en" | "pt";

type Person = {
  name: string;
  phone?: string;
  email?: string;
};

type ContactDict = {
  contact?: {
    title?: string;
    subtitle?: string;
    backgroundAlt?: string;
    what?: { title?: string; intro?: string; items?: string[] };
    form?: {
      name?: { label?: string; placeholder?: string };
      email?: { label?: string; placeholder?: string };
      phone?: { label?: string; placeholder?: string };
      message?: { label?: string; placeholder?: string };
      submit?: string;
    };
    validate?: {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    };
    direct?: { title?: string; people?: Person[] };
    map?: { title?: string; serviceArea?: string };
  };
};

import enRaw from "@/i18n/en.json";
import ptRaw from "@/i18n/pt.json";
const EN = enRaw as unknown as ContactDict;
const PT = ptRaw as unknown as ContactDict;

/** Locale from path (client-side) */
function useLocale(): Locale {
  let path = "/";
  if (typeof window !== "undefined") {
    const p = window.location?.pathname;
    path = typeof p === "string" ? p : "/";
  }
  const first = path.split("/").filter(Boolean)[0] ?? "";
  return first === "pt" ? "pt" : "en";
}

/** Normalize i18n with safe fallbacks */
function useContactDict() {
  const dict = useLocale() === "pt" ? PT : EN;
  const c = dict.contact ?? {};

  const whatItems =
    c.what?.items && c.what.items.length
      ? c.what.items
      : [
          "Project goals and constraints",
          "Timeline and permitting realities",
          "Budget ranges and cost drivers",
          "Method options (incl. Sismo) and trade-offs",
          "Next steps and site visit scheduling",
        ];

  const people =
    c.direct?.people && c.direct.people.length
      ? c.direct.people
      : [
          {
            name: "CÉU Construction",
            phone: "+351 000 000 000",
            email: "info@ceuconstruction.com",
          },
        ];

  return {
    title: c.title ?? "Let’s build",
    subtitle:
      c.subtitle ??
      "Tell us about your project. We will reply quickly with next steps.",
    backgroundAlt:
      c.backgroundAlt ?? "Subtle workshop photograph behind the contact card",
    whatTitle: c.what?.title ?? "What to expect",
    whatIntro:
      c.what?.intro ??
      "We self-perform every phase. In our first conversation, we’ll align on:",
    whatItems,
    directTitle: c.direct?.title ?? "Or call us directly",
    people,
    mapTitle: c.map?.title ?? "Where we work",
    serviceArea: c.map?.serviceArea ?? "Serving the Algarve and beyond",
  };
}

/** Temporary placeholder; replaced in Step 3 with the real client form */
function ContactFormPlaceholder() {
  return (
    <div className="mt-4 rounded-lg border border-ink/10 bg-surface/60 p-4 backdrop-blur-sm">
      <p className="text-ink/80">
        The contact form (name, email, telephone, message) will appear here in
        the next step.
      </p>
      <div className="mt-3">
        <ButtonLink href="mailto:info@ceuconstruction.com" strongBorder>
          info@ceuconstruction.com
        </ButtonLink>
      </div>
    </div>
  );
}

/** Chat bubble wing (tail), adapted from your reference */
function ChatBubbleWing({
  className = "",
  pathClassName = "",
}: {
  className?: string;
  pathClassName?: string;
}) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="27"
      aria-hidden="true"
    >
      <path
        className={pathClassName}
        d="M21.843 37.001c3.564 0 5.348-4.309 2.829-6.828L3.515 9.015A12 12 0 0 1 0 .53v36.471h21.843z"
      />
    </svg>
  );
}

/** VideoChatMessage-style bubble for the service area text */
function MapChatBubble({ message }: { message: string }) {
  // Pick a solid color once and apply to both bubble + wing
  const SOLID = "#0E0F12"; // tweak to your brand dark if needed

  return (
    <div
      className="absolute top-8 left-12 z-10 max-w-[17.5rem]
                 pt-2.5 pr-2.5 pb-7 pl-5
                 rounded-t-xl rounded-br-xl
                 text-white shadow-lg"
      /* IMPORTANT: solid background; no blur, no opacity utilities */
      style={{ backgroundColor: SOLID }}
    >
      <p className="text-sm pr-2 pt-2">{message}</p>

      <ChatBubbleWing
        className="absolute right-full bottom-0 -scale-x-100"
        /* Wing matches bubble exactly */
        pathClassName="fill-[#0E0F12]"
      />
    </div>
  );
}


export default function Contact() {
  const {
    title,
    subtitle,
    backgroundAlt,
    whatTitle,
    whatIntro,
    whatItems,
    directTitle,
    people,
    mapTitle,
    serviceArea,
  } = useContactDict();

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
      {/* Title block (no motion here) */}
      <div className="relative overflow-visible -mb-6">
        <h2 className="text-balance text-center text-5xl font-semibold text-ink md:text-6xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-4 text-center text-ink/80">{subtitle}</p>
        ) : null}
      </div>

      {/* Glass card with subtle background image */}
      <div
        className="relative z-10 mt-16 grid items-stretch gap-8 rounded-2xl bg-clip-padding px-6 py-8 backdrop-blur-[12px]
                   shadow-[0_8px_30px_rgba(0,0,0,0.35)] md:grid-cols-2 lg:px-10 lg:py-12"
      >
        {/* Background image */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl">
          <Image
            src="/media/contact/contact1.jpg"
            alt={backgroundAlt}
            fill
            sizes="100vw"
            priority={false}
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-surface/70 via-transparent to-surface/70" />
        </div>

        {/* Left: What to expect */}
        <div className="relative">
          <h3 className="text-xl font-semibold text-ink">{whatTitle}</h3>
          <p className="mt-2 text-ink/80">{whatIntro}</p>

          <ul className="mt-6 space-y-3">
            {whatItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 text-ink/70">
                  {/* Minimal check icon to keep deps small */}
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
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

        {/* Right: Intro + (placeholder) Form */}
        <div className="relative flex flex-col">
          <ContactFormPlaceholder />
        </div>
      </div>

      {/* Lower grid: Map (left) + Direct contact (right) */}
      <div className="relative z-10 mt-6 grid gap-6 lg:grid-cols-2">
        {/* Map block with background image and chat bubble */}
        <div className="relative hidden h-[22rem] overflow-hidden rounded-2xl border border-ink/10 md:block">
          <Image
            src="/media/contact/algarve.jpg"
            alt={mapTitle}
            fill
            sizes="(min-width:1024px) 50vw, 100vw"
            priority={false}
            className="object-cover"
          />
          {/* Chat-style bubble on top */}
          <MapChatBubble message={serviceArea} />
        </div>

        {/* Direct contact card */}
        <div className="rounded-2xl border border-ink/10 bg-surface/80 p-6">
          <h4 className="text-xl font-semibold text-ink">{directTitle}</h4>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {people.map((p, i) => (
              <div key={i} className="space-y-1">
                <p className="font-medium text-ink">{p.name}</p>
                {p.phone ? <p className="text-ink/75">{p.phone}</p> : null}
                {p.email ? (
                  <p className="text-ink/75">
                    <a
                      className="underline decoration-ink/30 underline-offset-2 hover:decoration-ink/60"
                      href={`mailto:${p.email}`}
                    >
                      {p.email}
                    </a>
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
