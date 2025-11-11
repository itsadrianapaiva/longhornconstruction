"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import AvatarRail from "@/components/interactive/AvatarRail";

type Testimonial = {
  quote: string;
  highlights?: string[];
  author: { name: string };
  avatarHint?: string;
};

type Props = {
  items: Testimonial[];
  ariaLabels: {
    regionLabel: string;
    pause: string;
    play: string;
    next: string;
    prev: string;
  };
};

const AUTO_MS = 4000;

export function TestimonialsScroller({ items, ariaLabels }: Props) {
  const regionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [slideW, setSlideW] = useState(0);

  // prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Measure viewport width
  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current) return;
      setSlideW(viewportRef.current.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  // Apply transform
  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translateX(${-index * slideW}px)`;
  }, [index, slideW]);

  // Auto-advance
  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => setIndex((n) => (n + 1) % items.length), AUTO_MS);
    return () => clearInterval(id);
  }, [reduced, paused, items.length]);

  // Hover/focus pause
  const onEnter = () => setPaused(true);
  const onLeave = () => setPaused(false);
  const onFocus = () => { setPaused(true); setFocused(true); };
  const onBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setPaused(false);
      setFocused(false);
    }
  };

  // Controls
  const goNext = useCallback(() => setIndex((n) => (n + 1) % items.length), [items.length]);
  const goPrev = useCallback(() => setIndex((n) => (n - 1 + items.length) % items.length), [items.length]);
  const toggle  = () => setPaused((p) => !p);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(); }
  };

  // Avatars by index
  const avatarSrcs = useMemo(
    () => items.map((_, i) => `/media/testimonials/avatar${i + 1}.svg`),
    [items]
  );

  // Simple non-overlapping highlighter
  const highlightText = (text: string, highlights?: string[]) => {
    if (!highlights?.length) return text;
    const parts: Array<{ txt: string; on: boolean }> = [];
    let rest = text;
    highlights.forEach((h) => {
      const idx = rest.indexOf(h);
      if (idx >= 0) {
        if (idx) parts.push({ txt: rest.slice(0, idx), on: false });
        parts.push({ txt: h, on: true });
        rest = rest.slice(idx + h.length);
      }
    });
    if (rest) parts.push({ txt: rest, on: false });
    return (
      <>
        {parts.map((p, i) =>
          p.on ? <mark key={i} className="bg-transparent text-[color:var(--brand)]">{p.txt}</mark> : p.txt
        )}
      </>
    );
  };

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label={ariaLabels.regionLabel}
      tabIndex={0}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className="relative focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]/40 rounded-2xl"
    >
      {/* Viewport */}
      <div ref={viewportRef} className="overflow-hidden w-full">
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-out"
          style={{ willChange: "transform" }}
        >
          {items.map((item, i) => (
            <div key={i} className="shrink-0 w-full">
              <div className="relative">
                {/* Absolute quotation top-left, low opacity, no layout impact */}
                <div
                  className="pointer-events-none absolute left-3 sm:left-5 md:left-7 top-3 sm:top-5 md:top-7 opacity-25"
                  aria-hidden="true"
                >
                  <Image
                    src="/media/testimonials/quotation1.svg"
                    alt=""
                    width={84}
                    height={84}
                    className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
                    priority={i === 0}
                  />
                </div>

                {/* Centered, responsive text */}
                <blockquote className="mx-auto max-w-[92vw] sm:max-w-[44rem] md:max-w-[60rem] text-center text-balance leading-tight tracking-[-0.01em] px-3 sm:px-4 md:px-6">
                  <p className="text-[clamp(20px,6.5vw,52px)] font-medium mb-6">
                    {highlightText(item.quote, item.highlights)}
                  </p>
                  <footer>
                    <cite className="not-italic text-base md:text-lg text-ink/80">
                      {item.author.name}
                    </cite>
                  </footer>
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Avatar rail stays centered and follows index */}
      <AvatarRail avatars={avatarSrcs} activeIndex={index} />

      {/* Controls visible when PRM or focus */}
      {(reduced || focused) && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button onClick={goPrev} aria-label={ariaLabels.prev} className="px-3 py-1.5 rounded bg-ink/5 hover:bg-ink/10 text-sm">
            Prev
          </button>
          <button onClick={toggle} aria-label={paused ? ariaLabels.play : ariaLabels.pause} className="px-3 py-1.5 rounded bg-ink/5 hover:bg-ink/10 text-sm">
            {paused ? "Play" : "Pause"}
          </button>
          <button onClick={goNext} aria-label={ariaLabels.next} className="px-3 py-1.5 rounded bg-ink/5 hover:bg-ink/10 text-sm">
            Next
          </button>
        </div>
      )}
    </div>
  );
}