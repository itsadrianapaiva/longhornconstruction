"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

type Props = {
  children: ReactNode;
  /** Vertical offset in px the block animates up from (Bravera uses ~100). */
  yFrom?: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** GSAP ease name. */
  ease?: string;
  /** ScrollTrigger start position (Bravera: "top bottom-=40%"). */
  start?: string;
  /** Optional delay in seconds. */
  delay?: number;
};

export default function AboutAnimatedContent({
  children,
  yFrom = 100,
  duration = 1,
  ease = "power2.inOut",
  start = "top bottom-=40%",
  delay = 0,
}: Props) {
  const el = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  gsap.registerPlugin(useGSAP, ScrollTrigger);

  useGSAP(
    () => {
      // Respect OS-level reduced motion preference: render in-place, no animation.
      if (prefersReducedMotion) {
        gsap.set(el.current, { y: 0, opacity: 1 });
        return;
      }

      // Mirror Bravera: slide from below, fade in, ease inOut, trigger on scroll into view.
      gsap.fromTo(
        el.current,
        { y: yFrom, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          ease,
          delay,
          overwrite: "auto",
          scrollTrigger: {
            trigger: el.current,
            start,
            // Play when entering, pause when leaving the viewport downward,
            // resume if re-entered, reverse when scrolling back up.
            toggleActions: "play pause resume reverse",
            // markers: true, // uncomment for debugging alignment
          },
        },
      );
    },
    { scope: el },
  );

  return <div ref={el}>{children}</div>;
}
