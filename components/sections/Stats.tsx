"use client";

import * as React from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type StatItem = {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  note?: string;
};

/* Easing kept tiny: easeOutCubic */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/* Counter: < 50 lines, RAF-based, reduced-motion aware */
function Counter({
  target,
  decimals = 0,
  prefix = "",
  suffix = "",
  inView,
  locale,
  duration = 3000,
}: {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  inView: boolean;
  locale: string;
  duration?: number;
}) {
  const [val, setVal] = React.useState(0);
  const startRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!inView) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setVal(target);
      return;
    }

    let raf = 0;
    const tick = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const t = Math.min(1, (ts - startRef.current) / duration);
      const eased = easeOutCubic(t);
      const next =
        Math.round(eased * target * Math.pow(10, decimals)) / Math.pow(10, decimals);
      setVal(next);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, decimals, duration]);

  const formatter = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [locale, decimals]
  );

  const final = `${prefix}${formatter.format(target)}${suffix}`;
  return (
    <span aria-label={final}>
      {prefix}
      {formatter.format(val)}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const { t, locale } = useI18n();

  // Leaf-level i18n reads with safe defaults
  const id = t<string>("stats.id", "stats");
  const title = t<string>("stats.title", "");
  const intro = t<string>("stats.intro", "");
  const sectionLabel = t<string>("stats.a11y.sectionLabel", "Statistics");
  const items = t<StatItem[]>("stats.items", []);

  // Trigger animation once when grid comes into view
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = gridRef.current;
    if (!el || inView) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView]);

  return (
    <section
      id={id}
      aria-label={sectionLabel || undefined}
      // Guard: never allow x-overflow from this section
      className="bg-black text-white py-16 md:py-24 overflow-x-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header: title + intro (no pretitle) */}
        {(title || intro) && (
          <div className="mb-12 text-center">
            {title ? (
              <h2 className="text-4xl md:text-5xl font-semibold">{title}</h2>
            ) : null}
            {intro ? (
              <p className="mx-auto mt-3 max-w-2xl text-lg text-white/70">{intro}</p>
            ) : null}
          </div>
        )}

        {/* Grid */}
        <div
          ref={gridRef}
          // min-w-0 prevents grid content from forcing columns wider than container
          className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6 min-w-0"
        >
          {items.map((it) => {
            const decimals = it.decimals ?? 0;
            const prefix = it.prefix ?? "";
            const suffix = it.suffix ?? "";
            return (
              <div
                key={it.id}
                // min-w-0 ensures long labels/notes wrap inside the card and never push the grid
                className="min-w-0 flex min-h-[160px] flex-col items-center rounded-xl border border-white/20 bg-white/5 px-4 py-6 text-center shadow"
              >
                {/* Big, centered number */}
                <div className="text-5xl md:text-6xl font-semibold leading-tight">
                  <Counter
                    target={Number(it.value) || 0}
                    decimals={decimals}
                    prefix={prefix}
                    suffix={suffix}
                    inView={inView}
                    locale={locale}
                  />
                </div>

                {/* Optional note sits above the bottom label */}
                {it.note ? (
                  <p className="mt-2 max-w-[12rem] text-xs text-white/60">{it.note}</p>
                ) : null}

                {/* Bottom-pinned label */}
                <p className="mt-auto pt-3 text-xs font-semibold uppercase tracking-wide text-white/80 break-words">
                  {it.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
