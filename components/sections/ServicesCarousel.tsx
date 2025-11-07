"use client";

import * as React from "react";
import Image from "next/image";

type ServiceItem = {
  key: string;
  title: string;
  desc: string;
  image: { src: string; alt: string; width: number; height: number };
};

type Props = { items: ServiceItem[] };

/**
 * ServicesCarousel
 * - One pill row for all breakpoints; it WRAPS on mobile with smaller pills.
 * - Smooth programmatic scroll (no tug-of-war with scroll-sync).
 * - Non-active slides are softly masked.
 * - Taller (not full-bleed) mobile images.
 */
export default function ServicesCarousel({ items }: Props) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const slideRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const programmaticUntil = React.useRef<number>(0);
  const rafId = React.useRef<number | null>(null);

  const scrollToIndex = React.useCallback((index: number) => {
    const track = trackRef.current;
    const slide = slideRefs.current[index];
    if (!track || !slide) return;

    // Ignore scroll-sync for a short window while smooth-scrolling
    programmaticUntil.current = performance.now() + 450;

    // Center the slide in view (we use snap-center)
    const slideLeft = slide.offsetLeft;
    const slideWidth = slide.offsetWidth;
    const trackWidth = track.clientWidth;
    const targetLeft = Math.max(0, slideLeft - (trackWidth - slideWidth) / 2);

    track.scrollTo({ left: targetLeft, behavior: "smooth" });
  }, []);

  const goTo = React.useCallback(
    (index: number) => {
      setActiveIndex(index);
      requestAnimationFrame(() => scrollToIndex(index));
    },
    [scrollToIndex]
  );

  // Scroll-sync: when user drags, update activeIndex to nearest slide
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      if (performance.now() < programmaticUntil.current) return;
      if (rafId.current != null) return; // throttle with RAF
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;

        const rect = track.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;

        let nearest = 0;
        let min = Number.POSITIVE_INFINITY;

        slideRefs.current.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const d = Math.abs(cx - centerX);
          if (d < min) {
            min = d;
            nearest = i;
          }
        });

        if (nearest !== activeIndex) setActiveIndex(nearest);
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [activeIndex]);

  // stable ref setter for TS
  const setSlideRef = React.useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      slideRefs.current[i] = el;
    },
    []
  );

  // Guard after hooks (Rules of Hooks)
  if (items.length === 0) return null;

  return (
    <div className="mt-8">
      {/* Single pill row — wraps on mobile with compact pills */}
      <div
        role="tablist"
        aria-label="Services navigation"
        className="mt-2 flex flex-wrap justify-center gap-1 sm:gap-2"
      >
        {items.map((item, index) => {
          const isSelected = index === activeIndex;
          return (
            <button
              key={item.key}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`slide-${item.key}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => goTo(index)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  goTo((index + 1) % items.length);
                } else if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  goTo((index - 1 + items.length) % items.length);
                } else if (e.key === "Home") {
                  e.preventDefault();
                  goTo(0);
                } else if (e.key === "End") {
                  e.preventDefault();
                  goTo(items.length - 1);
                }
              }}
              className={[
                // Compact on mobile, larger from sm+
                "inline-flex items-center rounded-full border font-medium transition-colors duration-200 ease-[var(--ease-gentle)] focus-visible:shadow-[0_0_0_3px_var(--ring)]",
                "px-2 py-1 text-[11px] leading-5 sm:px-3 sm:py-1.5 sm:text-sm",
                // Base: everyone blue-tinted
                "text-[color:var(--brand)] border-[color:var(--brand)] bg-[color:var(--brand)]/10",
                // Active: darker blue and brand ink
                isSelected &&
                  "text-[color:var(--brand-ink)] bg-[color:var(--brand-hover)] border-[color:var(--brand-border)]",
              ].join(" ")}
            >
              {/* Prevent tall wraps on tiny screens */}
              <span className="max-w-[68vw] truncate sm:max-w-none">{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Carousel */}
      <div
        ref={trackRef}
        className="
          relative mt-4 overflow-x-auto overscroll-x-contain
          snap-x snap-mandatory scroll-px-4
          scrollbar-hide
        "
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="flex gap-4 pb-4">
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={item.key}
                id={`slide-${item.key}`}
                ref={setSlideRef(index)}
                className="
                  relative snap-center snap-always shrink-0
                  w-[92vw] sm:w-[76vw] md:w-[66vw] lg:w-[55vw] xl:w-[48vw]
                "
              >
                {/* Card */}
                <div className="relative overflow-hidden rounded-2xl border border-[color:var(--glass-border)] bg-white/5">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    // Taller on mobile, not full-bleed
                    className="
                      w-full object-cover
                      h-[78vw] sm:h-[40vw] md:h-[34vw] lg:h-[30vw] xl:h-[28vw]
                    "
                    sizes="(min-width:1280px) 48vw, (min-width:1024px) 55vw, (min-width:768px) 66vw, 92vw"
                  />

                  {/* Bottom description band */}
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 px-4 py-3 text-white backdrop-blur-sm">
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-white/80">{item.desc}</p>
                  </div>

                  {/* Mask on NON-selected slides */}
                  {!isActive && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-black/35 transition-opacity duration-200"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
