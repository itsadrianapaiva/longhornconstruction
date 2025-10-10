// components/BackgroundVideo.tsx
"use client";

import React from "react";

type BackgroundVideoProps = {
  src?: string;
  height?: string;
  opacity?: string;
  className?: string;
  zoom?: number;
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
    <div
      className={`absolute left-0 top-0 -z-10 w-full ${height} overflow-hidden ${className}`}
      style={{ isolation: "isolate" }} // keeps overlay separate
    >
      {/* Mask band isolated to its own wrapper so it won't clip overlays */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`h-full w-full object-cover ${opacity} will-change-transform transform-gpu`}
          style={{
            transform: zoom !== 1 ? `scale(${zoom})` : undefined,
            objectPosition: focal,
          }}
        >
          <source src={src} type="video/mp4; codecs=hvc1" />
          <source src={src} type="video/mp4; codecs=avc1" />
          <source src={src.replace(".mp4", ".webm")} type="video/webm" />
          <source src={src.replace(".mp4", ".ogv")} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
