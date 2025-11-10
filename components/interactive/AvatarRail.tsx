"use client";

import Image from "next/image";
import React from "react";

type AvatarRailProps = {
  avatars: string[];
  activeIndex: number;
};

/**
 * AvatarRail 3.1
 * - Centers the active small avatar under the big one.
 * - Non-active small avatars are consistently vignetted using a ::before overlay,
 *   plus grayscale and slight blur for depth. This is more reliable than CSS mask-image.
 * - Active small avatar stays clean and a touch dim so the big avatar remains the hero.
 */
export default function AvatarRail({ avatars, activeIndex }: AvatarRailProps) {
  const rowRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  // Center the active item
  React.useEffect(() => {
    const row = rowRef.current;
    const item = itemRefs.current[activeIndex];
    if (!row || !item) return;

    const rowRect = row.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const nextScrollLeft =
      item.offsetLeft + itemRect.width / 2 - rowRect.width / 2;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    row.scrollTo({
      left: nextScrollLeft,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }, [activeIndex, avatars.length]);

  // Recenter on resize
  React.useEffect(() => {
    const onResize = () => {
      const row = rowRef.current;
      const item = itemRefs.current[activeIndex];
      if (!row || !item) return;
      const rowRect = row.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      row.scrollTo({
        left: item.offsetLeft + itemRect.width / 2 - rowRect.width / 2,
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex]);

  return (
    <div className="relative mt-8">
      {/* Small avatars viewport */}
      <div
        ref={rowRef}
        className="overflow-x-auto no-scrollbar flex justify-center px-2"
        aria-hidden="true"
      >
        <div className="flex items-center gap-3 md:gap-4 py-1">
          {avatars.map((src, i) => {
            const isActive = i === activeIndex;
            const base =
              "relative shrink-0 rounded-full overflow-hidden border border-white/15 transition-all duration-200";
            const size = "w-8 h-8 md:w-9 md:h-9";
            const inactiveFx =
              // ::before radial vignette + grayscale + slight blur + lower opacity
              "opacity-90 grayscale-[65%] contrast-90 " +
              "before:content-[''] before:absolute before:inset-0 before:rounded-full " +
              "before:bg-[radial-gradient(circle,_rgba(0,0,0,0)_58%,_rgba(0,0,0,0.55)_100%)] " +
              "before:pointer-events-none " +
              "filter saturate-90";
            const activeFx = "opacity-60"; // a bit dim so big avatar dominates

            return (
              <div
                key={i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={`${base} ${size} ${
                  isActive ? activeFx : inactiveFx
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  width={36}
                  height={36}
                  className={`w-full h-full object-cover ${
                    isActive ? "" : "blur-[0.2px]"
                  }`}
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Centered, enlarged active avatar */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="
            relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden
            ring-2 ring-[color:var(--ring)]
            shadow-[0_6px_24px_rgba(54,144,247,0.25)]
            bg-white/5
          "
        >
          <Image
            src={avatars[activeIndex] ?? avatars[0]}
            alt=""
            width={56}
            height={56}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
