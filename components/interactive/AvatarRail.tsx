// components/interactive/AvatarRail.tsx
"use client";

import Image from "next/image";

type AvatarRailProps = {
  avatars: string[];     // e.g. ["/media/testimonials/avatar1.svg", ...]
  activeIndex: number;   // which is active
};

export default function AvatarRail({ avatars, activeIndex }: AvatarRailProps) {
  return (
    <div className="relative mt-8">
      {/* Row of smaller avatars (decorative context) */}
      <div
        className="flex justify-center items-center gap-2 px-2"
        aria-hidden="true"
      >
        {avatars.map((src, i) => (
          <div
            key={i}
            className="relative w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border border-white/15"
            style={{
              maskImage:
                i === activeIndex
                  ? "none"
                  : "radial-gradient(circle at 50% 50%, black 62%, transparent 100%)",
              opacity: i === activeIndex ? 0.2 : 0.9,
              filter: i === activeIndex ? "saturate(0.9)" : "saturate(0.85)",
            }}
          >
            <Image
              src={src}
              alt=""
              width={36}
              height={36}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Active avatar centered and larger, floats above the row */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden ring-2 ring-black/10">
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
