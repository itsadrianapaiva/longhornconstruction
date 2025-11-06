"use client";

import * as React from "react";
import Image from "next/image";

type ServiceItem = {
  key: string;
  title: string;
  desc: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

type Props = {
  items: ServiceItem[];
};

export default function ServicesCarousel({ items }: Props) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const slideRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // Scroll to slide when activeIndex changes
  React.useEffect(() => {
    const slide = slideRefs.current[activeIndex];
    if (slide) {
      slide.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [activeIndex]);

  // Keyboard navigation for pills
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIndex((index + 1) % items.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex((index - 1 + items.length) % items.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(items.length - 1);
    }
  };

  if (!items.length) return null;

  return (
    <div className="mt-8">
      {/* Pills Row */}
      <div
        role="tablist"
        aria-label="Services navigation"
        className="mt-6 flex flex-wrap gap-2 justify-center"
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
              onClick={() => setActiveIndex(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`
                inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium
                transition-colors duration-200 ease-[var(--ease-gentle)]
                focus-visible:shadow-[0_0_0_3px_var(--ring)]
                ${
                  isSelected
                    ? "text-[color:var(--brand)] border-[color:var(--brand)] bg-[color:var(--brand)]/10"
                    : "text-ink/80 border-[color:var(--glass-border)] hover:border-[color:var(--glass-border-strong)]"
                }
              `}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      {/* Carousel */}
      <div
        ref={trackRef}
        className="relative mt-6 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-px-4 scrollbar-hide"
      >
        <div className="flex gap-4 pb-4">
          {items.map((item, index) => (
            <div
              key={item.key}
              id={`slide-${item.key}`}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              className="snap-start shrink-0 w-[88vw] sm:w-[75vw] md:w-[66vw] lg:w-[50vw] xl:w-[44vw] relative overflow-hidden rounded-2xl border border-[color:var(--glass-border)] bg-white/5"
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                className="h-[46vw] sm:h-[38vw] md:h-[32vw] lg:h-[28vw] xl:h-[26vw] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white backdrop-blur-sm px-4 py-3">
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-sm text-white/80 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
