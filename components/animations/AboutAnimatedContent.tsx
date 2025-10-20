
"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

type Props = {
  children: ReactNode;
  yFrom?: number;
  opacityFrom?: number;
  duration?: number;
  ease?: string;
  start?: string;
  delay?: number;
  once?: boolean;
  debug?: boolean;
  /** Remove these CSS classes exactly when the tween starts (e.g., ['opacity-0','translate-y-16']). */
  removeClasses?: string[] | string | null | undefined;
  /** If true, clear inline transform/opacity after the tween completes. */
  clearOnEnd?: boolean;
};

export default function AboutAnimatedContent({
  children,
  yFrom = 100,
  opacityFrom = 0,
  duration = 1,
  ease = "power2.inOut",
  start = "top 80%",
  delay = 0,
  once = false,
  debug = false,
  removeClasses,
  clearOnEnd = true,
}: Props) {
  const el = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // Normalize removeClasses → always an array
  const classesToRemove: string[] = Array.isArray(removeClasses)
    ? removeClasses.filter(Boolean)
    : typeof removeClasses === "string"
    ? removeClasses.split(/\s+/).filter(Boolean)
    : [];

  gsap.registerPlugin(useGSAP, ScrollTrigger);

  useGSAP(
    () => {
      const node = el.current;
      if (!node) return;

      if (reduced) {
        gsap.set(node, { y: 0, opacity: 1, clearProps: "transform,opacity,willChange" });
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
          clearProps: once && clearOnEnd ? "transform,opacity,willChange" : undefined,
          onStart: () => {
            if (classesToRemove.length) node.classList.remove(...classesToRemove);
          },
          scrollTrigger: {
            trigger: node,
            start,
            toggleActions: once ? "play none none none" : "play pause resume reverse",
            markers: debug,
            invalidateOnRefresh: true,
          },
        },
      );

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        tween?.scrollTrigger?.kill(true);
        tween?.kill();
      };
    },
    // Keep deps simple; no joins/splits here
    { scope: el, dependencies: [reduced, yFrom, duration, ease, start, delay, once, debug, clearOnEnd] },
  );

  return <div ref={el}>{children}</div>;
}
