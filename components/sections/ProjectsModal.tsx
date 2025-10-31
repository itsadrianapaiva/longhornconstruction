"use client";

/*
  IMAGE SIZE EXPECTATION FOR MODAL:
  Each media entry in project.media should point to a mid-sized "-lg" asset
  (~2560px wide, ~400-600KB) instead of the original multi-megabyte photo.
  The true full-res originals should NOT be referenced at runtime anymore.
  Adriana will generate these "-lg" assets and update i18n accordingly.
*/

import * as React from "react";
import Image from "next/image";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

type ProjectMediaImage = {
  type: "image";
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
};

type ProjectItem = {
  id: string;
  title: string;
  media: ProjectMediaImage[];
};

type Labels = { prev: string; next: string; close: string };

type Props = {
  open: boolean;
  project: ProjectItem | null;
  labels: Labels;
  onClose: () => void;
};

export default function ProjectsModal({ open, project, labels, onClose }: Props) {
  const prefersReduced = usePrefersReducedMotion();
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = React.useState(0);

  // Reset slide index when project changes or modal opens
  React.useEffect(() => {
    if (open) setIdx(0);
  }, [open, project?.id]);

  // Basic focus management
  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const node = dialogRef.current;
    node?.focus();
    return () => prev?.focus();
  }, [open]);

  // Keyboard handlers: Esc closes, Left/Right navigate
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (!project?.media?.length) return;
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % project.media.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + project.media.length) % project.media.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, project?.media]);

  if (!open || !project) return null;
  const m = project.media;
  const current = m[idx];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      {/* Overlay */}
      <button
        aria-label={labels.close}
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black/60",
          prefersReduced ? "" : "animate-fade-in"
        ].join(" ")}
      />

      {/* Modal panel */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={[
          "relative z-[101] mx-4 w-full max-w-5xl outline-none",
          prefersReduced ? "transition-none" : "animate-scale-in"
        ].join(" ")}
      >
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <h3 id="project-modal-title" className="text-lg font-medium text-white">
            {project.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-white/10 px-3 py-1 text-sm text-white backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring"
            aria-label={labels.close}
          >
            {labels.close}
          </button>
        </div>

        {/* Media stage */}
        <div className="relative overflow-hidden rounded-xl bg-black">
          {current?.type === "image" ? (
            // Note: The modal should use a mid-sized "-lg" asset from 'current.src'
            // (~2560px wide, ~400-600KB target) instead of the raw multi-MB original.
            // Thumbnails in the grid use OptimizedImage with downsized '-sm' assets (~1600px, <200KB).
            // The modal only renders on demand and shows one image at a time,
            // so moderately large files are acceptable here for quality.
            <Image
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              priority={true}
              className={[
                "mx-auto h-auto max-h-[70vh] w-auto object-contain",
                prefersReduced ? "" : "transition-transform"
              ].join(" ")}
            />
          ) : null}

          {/* Prev/Next controls (only if multiple) */}
          {m.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setIdx((i) => (i - 1 + m.length) % m.length)}
                aria-label={labels.prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md bg-white/10 px-3 py-2 text-white backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setIdx((i) => (i + 1) % m.length)}
                aria-label={labels.next}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-white/10 px-3 py-2 text-white backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring"
              >
                ›
              </button>

              {/* Dots */}
              <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-2">
                {m.map((_, i) => (
                  <span
                    key={i}
                    className={[
                      "h-1.5 w-1.5 rounded-full",
                      i === idx ? "bg-white" : "bg-white/50"
                    ].join(" ")}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Simple animations */}
      <style jsx>{`
        @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scale-in { from { transform: scale(.98); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        .animate-fade-in { animation: fade-in .18s ease-out both }
        .animate-scale-in { animation: scale-in .18s ease-out both }
      `}</style>
    </div>
  );
}
