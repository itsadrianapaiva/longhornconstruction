"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Locale = "en" | "pt";

type Props = {
  locales?: readonly Locale[];
  className?: string;
  compact?: boolean;
  /** If true, remove any existing #hash from the URL bar on mount. Defaults to true. */
  stripHashOnMount?: boolean;
};

/**
 * LanguageSwitcher
 * - Swaps only the first path segment (/en|/pt).
 * - Preserves query string.
 * - Never appends a hash to the URL.
 * - Optionally removes any existing hash from the URL bar on mount.
 */
export default function LanguageSwitcher({
  locales = ["en", "pt"],
  className,
  compact,
  stripHashOnMount = true,
}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Remove an existing hash from the URL bar for clean URLs.
  React.useEffect(() => {
    if (!stripHashOnMount) return;
    if (typeof window === "undefined") return;
    if (!window.location.hash) return;
    const clean = window.location.pathname + window.location.search;
    window.history.replaceState(null, "", clean);
  }, [stripHashOnMount]);

  // Determine current locale from first non-empty segment.
  const currentLocale: Locale = (() => {
    const segs = (pathname || "/").split("/");
    const first = segs.find(Boolean) as Locale | undefined;
    return locales.includes(first as Locale) ? (first as Locale) : (locales[0] as Locale);
  })();

  // Replace only the first non-empty segment with target locale. Do not include hash.
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

  // Navigate without scrolling the page unexpectedly.
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
        className={merge(
          "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ring-1 ring-zinc-300/60 hover:bg-zinc-50",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          className
        )}
        aria-label={`Switch language to ${target.toUpperCase()}`}
      >
        {target.toUpperCase()}
      </button>
    );
  }

  return (
    <nav aria-label="Language" className={merge("inline-flex rounded-full ring-1 ring-zinc-300/60 p-0.5", className)}>
      {locales.map((loc) => {
        const active = loc === currentLocale;
        const href = swapLocaleInPath(loc);
        return (
          <Link
            key={loc}
            href={href}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={merge("px-3 py-1 text-sm rounded-full", active ? "bg-zinc-900 text-white" : "hover:bg-zinc-50 text-zinc-700")}
          >
            {loc.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}

/** Tiny className merger to avoid a dependency. */
function merge(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}
