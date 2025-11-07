"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const trackRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [slideW, setSlideW] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (!regionRef.current) return;
      setSlideW(regionRef.current.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (regionRef.current) ro.observe(regionRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transform = `translateX(${-index * slideW}px)`;
  }, [index, slideW]);

  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(
      () => setIndex((n) => (n + 1) % items.length),
      AUTO_MS
    );
    return () => clearInterval(id);
  }, [reduced, paused, items.length]);

  const onEnter = () => setPaused(true);
  const onLeave = () => setPaused(false);
  const onFocus = () => {
    setPaused(true);
    setFocused(true);
  };
  const onBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setPaused(false);
      setFocused(false);
    }
  };

  const goNext = useCallback(
    () => setIndex((n) => (n + 1) % items.length),
    [items.length]
  );
  const goPrev = useCallback(
    () => setIndex((n) => (n - 1 + items.length) % items.length),
    [items.length]
  );
  const toggle = () => setPaused((p) => !p);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  };

  const avatarSrcs = useMemo(
    () => items.map((_, i) => `/media/testimonials/avatar${i + 1}.svg`),
    [items]
  );

  // Color-only highlight
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
          p.on ? (
            <mark key={i} className="bg-transparent text-brand-accent">
              {p.txt}
            </mark>
          ) : (
            p.txt
          )
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
      className="relative focus:outline-none focus:ring-2 focus:ring-brand-accent/40 rounded-2xl"
    >
      {/* Viewport */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-out"
          style={{ willChange: "transform" }}
        >
          {items.map((item, i) => (
            <div key={i} className="min-w-full shrink-0">
              <div className="relative">
                <blockquote className="mx-auto max-w-5xl text-center text-balance leading-tight tracking-[-0.01em] px-4">
                  <p className="text-[clamp(24px,6.8vw,56px)] font-medium mb-6">
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

      {/* Centered avatar rail */}
      <AvatarRail avatars={avatarSrcs} activeIndex={index} />

      {/* Controls on PRM or focus */}
      {(reduced || focused) && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={goPrev}
            aria-label={ariaLabels.prev}
            className="px-3 py-1.5 rounded bg-ink/5 hover:bg-ink/10 text-sm"
          >
            Prev
          </button>
          <button
            onClick={toggle}
            aria-label={paused ? ariaLabels.play : ariaLabels.pause}
            className="px-3 py-1.5 rounded bg-ink/5 hover:bg-ink/10 text-sm"
          >
            {paused ? "Play" : "Pause"}
          </button>
          <button
            onClick={goNext}
            aria-label={ariaLabels.next}
            className="px-3 py-1.5 rounded bg-ink/5 hover:bg-ink/10 text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
