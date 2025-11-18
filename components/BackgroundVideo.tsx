"use client";

import React from "react";

type BackgroundVideoProps = {
  src?: string;
  height?: string;
  opacity?: string;
  className?: string;
  zoom?: number;
  focal?: string;
  /** Percent of the element height that will participate in the fade at the bottom (0–100). */
  fadeHeightPct?: number;
  /** Optional: where the fade begins, percent from the top (0–100). If omitted, computed as 100 - fadeHeightPct. */
  fadeStartPct?: number;
  /** Optional poster or fallback image for the hero background. */
  posterSrc?: string;
};

export default function BackgroundVideo({
  src = "/media/hero/sky.mp4",
  height = "h-1/3",
  opacity = "opacity-30",
  className = "",
  zoom = 1,
  focal = "50% 50%",
  // Make the fade much more visible by default: bottom 45% fades
  fadeHeightPct = 45,
  fadeStartPct,
  // Default poster file that lives in /public
  posterSrc = "/media/hero/sky-poster.png",
}: BackgroundVideoProps) {
  // where the fade starts (opaque -> transparent)
  const start = Math.max(0, Math.min(100, fadeStartPct ?? 100 - fadeHeightPct));
  const end = 100;

  // Stronger ramp: keep most of the frame fully visible, then fade aggressively in the last stretch.
  const maskGradient = `linear-gradient(
    to bottom,
    black 0%,
    black ${start}%,
    transparent ${end}%
  )`;

  return (
    <div
      className={`absolute left-0 top-0 -z-10 w-full ${height} overflow-hidden ${className}`}
      style={{ isolation: "isolate" }}
    >
      {/* Apply mask to the video wrapper so only the video or poster fades, not the hero content */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          // Fallback poster as background in case video never plays
          backgroundImage: `url(${posterSrc})`,
          backgroundSize: "cover",
          backgroundPosition: focal,
          backgroundRepeat: "no-repeat",

          // Standards + Safari masking
          maskImage: maskGradient,
          WebkitMaskImage: maskGradient,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          willChange: "transform",
        }}
      >
        {/* 
          Cross-browser video sources:
          - sky.webm will serve Firefox and Chrome.
          - sky.mp4 serves Safari and Apple hardware.
        */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={posterSrc}
          className={`h-full w-full object-cover ${opacity} will-change-transform transform-gpu`}
          style={{
            transform: zoom !== 1 ? `scale(${zoom})` : undefined,
            objectPosition: focal,
          }}
        >
          <source src="/media/hero/sky.webm" type="video/webm" />
          <source src={src} type="video/mp4" />
          {/* If video tag fails completely, users still see the CSS background image */}
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Bottom-only page-bg overlay to guarantee a perfect meet with the next section.
          This sits over the video but under hero content due to the -z-10 on the container. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28vh] md:h-[34vh]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, var(--page-bg) 85%, var(--page-bg) 100%)",
        }}
      />
    </div>
  );
}
