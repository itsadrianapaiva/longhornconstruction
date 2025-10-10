"use client";

import React from "react";

type BackgroundVideoProps = {
  /** Path to the source video; defaults to your hero folder. */
  src?: string;
  /** Tailwind height utility for the video band (e.g., "h-1/3", "h-1/2", "h-[65svh]", "h-full"). */
  height?: string;
  /** Tailwind opacity utility (e.g., "opacity-30", "opacity-40"). */
  opacity?: string;
  /** Optional extra classes on the outer wrapper. */
  className?: string;
  /** Optional scale factor to gently zoom the video. 1 = no zoom. Typical: 1.05–1.12 */
  zoom?: number;
  /** CSS object-position for focal point, e.g., "50% 50%", "center top", "40% 60%". */
  focal?: string;
};

export default function BackgroundVideo({
  src = "/media/hero/sky.mp4",
  height = "h-1/3",
  opacity = "opacity-30",
  className = "",
  zoom = 1,
  focal = "50% 50%",
}: BackgroundVideoProps) {
  return (
    <div className={`absolute left-0 top-0 -z-10 w-full ${height} overflow-hidden ${className}`}>
      {/* Bravera-style mask: soft band that reveals center more than edges */}
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent)]">
        <div className="absolute inset-0 h-full w-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            // GPU-friendly transform with optional scale to "zoom in" a touch
            className={`h-full w-full object-cover ${opacity} will-change-transform transform-gpu`}
            style={{
              transform: zoom !== 1 ? `scale(${zoom})` : undefined,
              objectPosition: focal,
            }}
          >
            {/* Multiple formats for broad compatibility */}
            <source src={src} type="video/mp4; codecs=hvc1" />
            <source src={src} type="video/mp4; codecs=avc1" />
            <source src={src.replace(".mp4", ".webm")} type="video/webm" />
            <source src={src.replace(".mp4", ".ogv")} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
