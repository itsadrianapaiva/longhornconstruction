// components/animations/AboutAnimatedTitle.tsx
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

type AboutAnimatedTitleProps = {
  // Accept the common ref shape created via useRef<HTMLDivElement | null>(null)
  triggerRef: React.RefObject<HTMLDivElement | null>;
  glassRef?: React.RefObject<HTMLDivElement | null>;
  distance?: number;     // default -140
  duration?: number;     // default 0.9
  start?: string;        // default "top bottom-=35%"
  ease?: string;         // default "power2.out"
  className?: string;
  children: React.ReactNode;
};

export default function AboutAnimatedTitle({
  triggerRef,
  glassRef,
  distance = -140,
  duration = 0.9,
  start = "top bottom-=35%",
  ease = "power2.out",
  className,
  children,
}: AboutAnimatedTitleProps) {
  const titleRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    const triggerEl = triggerRef.current;
    const titleEl = titleRef.current;
    const glassEl = glassRef?.current ?? null;
    if (!triggerEl || !titleEl) return;

    if (prefersReducedMotion) {
      gsap.set(titleEl, { x: 0, opacity: 1 });
      if (glassEl) gsap.set(glassEl, { opacity: 1, scale: 1 });
      return;
    }

    // Initial state
    gsap.set(titleEl, { x: distance, opacity: 0.001 });
    if (glassEl) gsap.set(glassEl, { opacity: 0.85, scale: 0.98 });

    const tl = gsap.timeline({
      defaults: { ease, duration },
      scrollTrigger: {
        trigger: triggerEl,
        start,
        toggleActions: "play none none reverse",
      },
    });

    if (glassEl) tl.to(glassEl, { opacity: 1, scale: 1, duration: 0.5 }, 0);
    tl.to(titleEl, { x: 0, opacity: 1 }, 0.05);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [triggerRef, glassRef, distance, duration, start, ease, prefersReducedMotion]);

  return (
    <div ref={titleRef} className={className}>
      {children}
    </div>
  );
}
