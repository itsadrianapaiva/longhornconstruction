"use client";

import { useEffect, useState } from "react";

const MEDIA_QUERY = "(prefers-reduced-motion: no-preference)";

type MQLExtended = MediaQueryList & {
  addListener?: (
    listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void
  ) => void;
  removeListener?: (
    listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void
  ) => void;
};

/**
 * Returns true when the user prefers reduced motion.
 * Safe for SSR and supports modern and legacy matchMedia listeners.
 */
export default function usePrefersReducedMotion(): boolean {
  // Default to true during SSR and first render so animations do not run before hydration.
  const [prefersReduced, setPrefersReduced] = useState<boolean>(true);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mql: MQLExtended = window.matchMedia(MEDIA_QUERY);

    // When the query is "no-preference", the user does not prefer reduced motion.
    // We invert to get prefersReduced.
    const update = (matches: boolean) => setPrefersReduced(!matches);

    // Initial value
    update(mql.matches);

    // One handler works for both modern and legacy APIs
    const handler = (e: MediaQueryListEvent) => update(e.matches);

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener?.("change", handler);
    }

    // Legacy Safari
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener?.("change", handler);
    }

    // If neither API exists, nothing to clean up
    return;
  }, []);

  return prefersReduced;
}
