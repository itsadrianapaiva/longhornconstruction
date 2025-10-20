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
  const wrapperRef = useRef<HTMLDivElement | null>(null);
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
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      // ✅ Animate the first child if it exists; otherwise animate the wrapper.
      // This matches your usage where the pre-hide classes live on the <h2>.
      const target: HTMLElement =
        (wrapper.firstElementChild as HTMLElement) || (wrapper as HTMLElement);

      if (reduced) {
        gsap.set(target, {
          y: 0,
          opacity: 1,
          clearProps: "transform,opacity,willChange",
        });
        return;
      }

      const tween = gsap.fromTo(
        target,
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
            if (classesToRemove.length) target.classList.remove(...classesToRemove);
          },
          scrollTrigger: {
            trigger: wrapper, // trigger on the wrapper for consistent viewport math
            start,
            toggleActions: once ? "play none none none" : "play pause resume reverse",
            markers: debug,
            invalidateOnRefresh: true,
          },
        },
      );

      // Nudge ST after mount/layout settles
      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        tween?.scrollTrigger?.kill(true);
        tween?.kill();
      };
    },
    {
      scope: wrapperRef,
      // Keep deps tidy to avoid re-inits while still responding to prop changes.
      dependencies: [
        reduced,
        yFrom,
        opacityFrom,
        duration,
        ease,
        start,
        delay,
        once,
        debug,
        clearOnEnd,
        // Do not include removeClasses array itself to avoid re-runs on identity change.
      ],
    },
  );

  return <div ref={wrapperRef}>{children}</div>;
}
