"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Locale = "en" | "pt" | "es";

type Props = {
  locales?: readonly Locale[];
  className?: string;
  compact?: boolean;
  stripHashOnMount?: boolean;
};

/** Small className merger */
function merge(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

const pillBase = [
  "relative inline-flex items-center justify-center gap-2 rounded-full outline-none",
  "border border-glass backdrop-blur",
  "transition-[transform,filter] duration-200 ease-gentle hover:-translate-y-[1px]",
  "focus-visible:shadow-[0_0_0_3px_var(--ring)]",
  "before:content-[''] before:absolute before:inset-0 before:rounded-full before:pointer-events-none",
  "before:shadow-[inset_0_0_10px_6px_color-mix(in_srgb,white_20%,var(--brand)_30%)]",
  "before:opacity-0 before:transition-opacity before:duration-700",
  "hover:before:opacity-25 focus-visible:before:opacity-20",
].join(" ");

const activeClasses = [
  "cursor-default",
  "text-white/90 bg-white/12",
  "hover:-translate-y-0 before:opacity-0 hover:before:opacity-0 focus-visible:before:opacity-0",
].join(" ");

const inactiveClasses = ["text-white/72 bg-black/18", "hover:text-white"].join(
  " ",
);

function getLocaleMeta(locale: Locale) {
  switch (locale) {
    case "en":
      return { label: "EN", flag: "🇬🇧", aria: "English" };
    case "pt":
      return { label: "PT", flag: "🇵🇹", aria: "Português" };
    case "es":
      return { label: "ES", flag: "🇪🇸", aria: "Español" };
  }
}

export default function LanguageSwitcher({
  locales = ["en", "pt"] as const,
  className,
  compact = false,
  stripHashOnMount = true,
}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    if (!stripHashOnMount) return;
    if (typeof window === "undefined") return;
    if (!window.location.hash) return;

    const clean = window.location.pathname + window.location.search;
    window.history.replaceState(null, "", clean);
  }, [stripHashOnMount]);

  function isLocale(value: string | undefined): value is Locale {
    return (
      value !== undefined && (locales as readonly string[]).includes(value)
    );
  }

  const currentLocale: Locale = (() => {
    const segs = (pathname || "/").split("/");
    const first = segs.find(Boolean);

    return isLocale(first) ? first : (locales[0] as Locale);
  })();

  function swapLocaleInPath(target: Locale): string {
    const segs = (pathname || "/").split("/");
    let replaced = false;

    const out = segs.map((s) => {
      if (!replaced && s.length > 0) {
        replaced = true;
        return target;
      }
      return s;
    });

    const base =
      "/" + out.filter((_, i) => !(i === 0 && out[i] === "")).join("/");
    const qs = searchParams?.toString();
    const query = qs ? `?${qs}` : "";

    return `${base}${query}`;
  }

  function navigate(target: Locale) {
    router.push(swapLocaleInPath(target), { scroll: false });
  }

  const sizeClasses = compact
    ? "px-3 py-1.5 text-sm font-semibold min-w-[78px]"
    : "px-4 py-2 text-sm font-semibold min-w-[90px]";

  return (
    <nav
      aria-label="Language"
      className={merge("inline-flex items-center gap-2", className)}
    >
      {locales.map((loc) => {
        const active = loc === currentLocale;
        const href = swapLocaleInPath(loc);
        const meta = getLocaleMeta(loc);

        const content = (
          <>
            <span aria-hidden="true" className="text-base leading-none">
              {meta.flag}
            </span>
            <span className="relative">{meta.label}</span>
          </>
        );

        return active ? (
          <button
            key={loc}
            type="button"
            onClick={() => navigate(loc)}
            aria-current="page"
            aria-label={`${meta.aria} selected`}
            className={merge(pillBase, sizeClasses, activeClasses)}
          >
            {content}
          </button>
        ) : (
          <Link
            key={loc}
            href={href}
            scroll={false}
            aria-label={`Switch language to ${meta.aria}`}
            className={merge(pillBase, sizeClasses, inactiveClasses)}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
