"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Locale = "en" | "pt";

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

/** LanguageSwitcher pill with subtle inner white glow on hover */
const pillBaseInner =
  [
    // Structure
    "relative inline-flex items-center justify-center rounded-full outline-none",
    // Size + type (compact by default for header)
    "px-3 py-1 text-sm font-semibold",
    // Rest state (unchanged)
    "bg-transparent border border-glass text-white/40 backdrop-blur",
    // Motion without color changes
    "transition-[transform,filter] duration-200 ease-gentle hover:-translate-y-[1px]",
    // Accessible focus ring
    "focus-visible:shadow-[0_0_0_3px_var(--ring)]",
    // ::before inner glow layer (stays inside the pill)
    "before:content-[''] before:absolute before:inset-0 before:rounded-full before:pointer-events-none",
    // Use a white-leaning mix for soft, neutral light; keep it subtle
    "before:shadow-[inset_0_0_10px_6px_color-mix(in_srgb,white_20%,var(--brand)_30%)]",
    // Animate only opacity; do not change border or text
    "before:opacity-0 before:transition-opacity before:duration-700",
    "hover:before:opacity-25 focus-visible:before:opacity-20",
  ].join(" ");

export default function LanguageSwitcher({
  locales = ["en", "pt"],
  className,
  compact,
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

  const currentLocale: Locale = (() => {
    const segs = (pathname || "/").split("/");
    const first = segs.find(Boolean) as Locale | undefined;
    return locales.includes(first as Locale) ? (first as Locale) : (locales[0] as Locale);
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
    const base = "/" + out.filter((_, i) => !(i === 0 && out[i] === "")).join("/");
    const qs = searchParams?.toString();
    const query = qs ? `?${qs}` : "";
    return `${base}${query}`;
  }

  function navigate(target: Locale) {
    router.push(swapLocaleInPath(target), { scroll: false });
  }

  const others = locales.filter((l) => l !== currentLocale) as Locale[];

  if (compact) {
    const target = others[0] ?? currentLocale;
    return (
      <button
        type="button"
        onClick={() => navigate(target)}
        className={merge(pillBaseInner, className)}
        aria-label={`Switch language to ${target.toUpperCase()}`}
      >
        {target.toUpperCase()}
      </button>
    );
  }

  return (
    <nav aria-label="Language" className={merge("inline-flex items-center gap-1", className)}>
      {locales.map((loc) => {
        const active = loc === currentLocale;
        const href = swapLocaleInPath(loc);

        // Active: same rest style, no glow, non-interactive
        const activeClasses = merge(
          pillBaseInner,
          "cursor-pointer",
          "hover:-translate-y-0 before:opacity-0 hover:before:opacity-0 focus-visible:before:opacity-0",
          "text-page-ink/80"
        );

        const inactiveClasses = pillBaseInner;

        return active ? (
          <span key={loc} aria-current="page" className={activeClasses}>
            {loc.toUpperCase()}
          </span>
        ) : (
          <Link
            key={loc}
            href={href}
            scroll={false}
            className={inactiveClasses}
            aria-label={`Switch language to ${loc.toUpperCase()}`}
          >
            {loc.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
