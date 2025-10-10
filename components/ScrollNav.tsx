"use client";

import * as React from "react";

type Item = { id: string; label: string };
type Props = {
  items: Item[];
  className?: string;
  /** px offset for sticky headers (e.g., 64). Default 0. */
  topOffset?: number;
};

/**
 * ScrollNav
 * - No URL hashes; uses buttons + scrollIntoView().
 * - Highlights the section currently in view (IntersectionObserver).
 * - Respects prefers-reduced-motion.
 */
export default function ScrollNav({ items, className, topOffset = 0 }: Props) {
  const [active, setActive] = React.useState<string | null>(null);

  // Reduced motion detection (cached)
  const prefersReducedMotion = React.useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);

  // Observe sections to update active item
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) setActive(visible.target.id);
      },
      {
        threshold: [0.25, 0.6, 0.9],
        rootMargin: topOffset ? `-${topOffset}px 0px 0px 0px` : "0px",
      }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items, topOffset]);

  // Scroll helper (no hash, no history changes)
  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    // Prefer CSS scroll-margin-top via a typed, standards-compliant API.
    if (topOffset > 0) {
      // Use setProperty instead of casting to any
      (el as HTMLElement).style.setProperty("scroll-margin-top", `${topOffset}px`);
    }

    el.scrollIntoView({
      block: "start",
      inline: "nearest",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    // Move focus for a11y without altering URL
    const heading =
      el.querySelector<HTMLElement>("h1, h2, h3, [role='heading']") ?? (el as HTMLElement);

    const prevTabIndex = heading.getAttribute("tabindex");
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
    // Cleanup tabindex after a short delay
    window.setTimeout(() => {
      if (prevTabIndex === null) heading.removeAttribute("tabindex");
      else heading.setAttribute("tabindex", prevTabIndex);
    }, 300);
  }

  return (
    <nav
      aria-label="Page sections"
      className={merge(
        "inline-flex gap-2 rounded-full border border-zinc-200 bg-white/80 p-1 backdrop-blur",
        "supports-[backdrop-filter]:bg-white/60",
        className
      )}
    >
      {items.map(({ id, label }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            className={merge(
              "px-3 py-1 text-sm rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              isActive ? "bg-zinc-900 text-white" : "hover:bg-zinc-50 text-zinc-700"
            )}
            aria-current={isActive ? "true" : undefined}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}

/** Tiny className merger to keep deps minimal. */
function merge(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}
