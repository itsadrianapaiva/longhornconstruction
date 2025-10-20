// components/animations/AboutAnimatedContent.tsx
"use client";

import { useRef, type ReactNode, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

export default function AboutAnimatedContent({
  children,
}: {
  children: ReactNode;
}) {
  const container = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = container.current;
    if (!el) return;

    if (prefersReducedMotion) {
      gsap.set(el, { y: 0 });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { y: 45 },
      {
        y: 0,
        ease: "power2.inOut",
        duration: 1,
        scrollTrigger: {
          trigger: el,
          start: "top bottom-=40%",
          toggleActions: "play pause resume reverse",
          once: false,
        },
      }
    );

    // Force ScrollTrigger to recalc once it mounts
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [prefersReducedMotion]);

  return <div ref={container}>{children}</div>;
}
