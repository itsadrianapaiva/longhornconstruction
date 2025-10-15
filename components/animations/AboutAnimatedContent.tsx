"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

type Props = {
  children: ReactNode;
  yFrom?: number; // default 100
  opacityFrom?: number; // default 0
  duration?: number; // default 1
  ease?: string; // default "power2.inOut"
  start?: string; // default "top 80%"
  delay?: number; // default 0
  once?: boolean; // default false
  debug?: boolean; // default false
};

export default function AboutAnimatedContent({
  children,
  yFrom = 100,
  opacityFrom = 0,
  duration = 1,
  ease = "power2.inOut",
  start = "top 80%", // more forgiving than "top bottom-=40%"
  delay = 0,
  once = false,
  debug = false,
}: Props) {
  const el = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // ✅ Explicitly register BOTH plugins (matches your Hero pattern)
  gsap.registerPlugin(useGSAP, ScrollTrigger);

  useGSAP(
    () => {
      const node = el.current;
      if (!node) return;

      if (reduced) {
        gsap.set(node, {
          y: 0,
          opacity: 1,
          clearProps: "transform,opacity,willChange",
        });
        return;
      }

      const tween = gsap.fromTo(
        node,
        { y: yFrom, opacity: opacityFrom, willChange: "transform,opacity" },
        {
          y: 0,
          opacity: 1,
          duration,
          ease,
          delay,
          force3D: true,
          overwrite: "auto",
          clearProps: once ? "transform,opacity,willChange" : undefined,
          scrollTrigger: {
            trigger: node,
            start,
            toggleActions: once
              ? "play none none none"
              : "play pause resume reverse",
            markers: debug,
            invalidateOnRefresh: true,
          },
        }
      );

      // Recalculate after layout shifts (e.g., hero/video/fonts)
      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        tween?.scrollTrigger?.kill(true);
        tween?.kill();
      };
    },
    {
      scope: el,
      dependencies: [reduced, yFrom, duration, ease, start, delay, once, debug],
    }
  );

  return <div ref={el}>{children}</div>;
}
