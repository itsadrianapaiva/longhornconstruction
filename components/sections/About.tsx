// components/sections/About.tsx
"use client";

import { useRef } from "react";
import { SectionShell } from "@/components/sections/SectionShell";
import AboutAnimatedTitle from "@/components/animations/AboutAnimatedTitle";

type AboutProps = {
  id?: string;
  title: string;        // from i18n: about.title
  body: string;         // from i18n: about.body
  bullets?: string[];   // from i18n: about.bullets
};

export default function About({ id = "about", title, body, bullets = [] }: AboutProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);

  return (
    <SectionShell
      id={id}
      pad="lg"
      container
      maxWidth="6xl"
      innerPx
      // Keep root simple; we provide our own heading so the animation can control it
      innerClassName="relative"
      className="relative"
    >
      {/* Decorative glow: centered toward the top-right, but within section bounds */}
      <div aria-hidden="true" className="pointer-events-none absolute -z-10 inset-0">
        <div
          className="absolute top-[8%] right-[18%] h-72 w-72 rounded-full blur-[70px]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, rgba(53,131,233,0.26) 0%, rgba(53,131,233,0.12) 45%, rgba(53,131,233,0.00) 100%)",
            filter: "saturate(120%)",
          }}
        />
      </div>

      {/* Content grid */}
      <div ref={triggerRef} className="grid items-start gap-8 md:gap-10 md:grid-cols-5">
        {/* Left: glass box + sliding title arranged in a row (no absolute positioning) */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            {/* Glass element that gets a subtle lift during the scroll animation */}
            <div
              ref={glassRef}
              className="glass-container rounded-xl border border-glass bg-glass shadow-glass px-5 py-6 min-w-[160px] min-h-[88px]"
              aria-hidden="true"
            />
            {/* Title slides out from left on scroll; stays fully visible otherwise */}
            <AboutAnimatedTitle triggerRef={triggerRef} glassRef={glassRef}>
              <h2
                id={`${id}-title`}
                className="text-2xl md:text-3xl font-semibold tracking-tight text-ink"
              >
                {title}
              </h2>
            </AboutAnimatedTitle>
          </div>
        </div>

        {/* Right: proof paragraph + bullets (always visible) */}
        <div className="md:col-span-3">
          <p className="text-base md:text-lg text-ink/90">{body}</p>

          {bullets.length > 0 && (
            <ul className="mt-5 space-y-2">
              {bullets.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-brand"
                  />
                  <span className="text-ink/90">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
