"use client";

import * as React from "react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

type GallerySource = { src: string; format: "jpg" | "webp" };
type GalleryItem = {
  alt: string;
  width: number;
  height: number;
  sources: GallerySource[];
};

type ProjectItem = {
  id: string;
  title: string;
  gallery?: GalleryItem[];
};

type Labels = { prev: string; next: string; close: string };

type Props = {
  open: boolean;
  project: ProjectItem | null;
  labels: Labels;
  onClose: () => void;
};

export default function ProjectsModal({
  open,
  project,
  labels,
  onClose,
}: Props) {
  const prefersReduced = usePrefersReducedMotion();
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = React.useState(0);

  // Reset slide when new project opens
  React.useEffect(() => {
    if (open) setIdx(0);
  }, [open, project?.id]);

  // Focus handling
  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => prev?.focus();
  }, [open]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!open || !project) return;
    const slides = project.gallery ?? [];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % slides.length);
      if (e.key === "ArrowLeft")
        setIdx((i) => (i - 1 + slides.length) % slides.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, project, onClose]);

  if (!open || !project) return null;

  const slides = project.gallery ?? [];
  const current = slides[idx] ?? null;

  // Derive webp and jpg sources
  const webp = current?.sources?.find(s => s.format === "webp")?.src || null;
  const jpg = current?.sources?.find(s => s.format === "jpg")?.src || current?.sources?.[0]?.src || null;
  const alt = current?.alt || project.title;

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
          prefersReduced ? "" : "animate-fade-in",
        ].join(" ")}
      />

      {/* Modal content */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={[
          "relative z-[101] mx-4 w-full max-w-5xl outline-none",
          prefersReduced ? "transition-none" : "animate-scale-in",
        ].join(" ")}
      >
        <div className="mb-2 flex items-center justify-between">
          <h3
            id="project-modal-title"
            className="text-lg font-medium text-white"
          >
            {project.title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-md bg-white/10 px-3 py-1 text-sm text-white backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring"
          >
            {labels.close}
          </button>
        </div>

        {/* Stage */}
        <div className="relative overflow-hidden rounded-xl bg-black">
          {jpg ? (
            <picture>
              {webp && <source srcSet={webp} type="image/webp" />}
              <img
                src={jpg}
                alt={alt}
                width={current?.width || 2560}
                height={current?.height || 1600}
                loading="eager"
                decoding="sync"
                className="mx-auto h-auto max-h-[70vh] w-auto object-contain"
              />
            </picture>
          ) : (
            <div className="flex h-[60vh] items-center justify-center text-white/60">
              Image not available
            </div>
          )}

          {slides.length > 1 && (
            <>
              <button
                onClick={() =>
                  setIdx((i) => (i - 1 + slides.length) % slides.length)
                }
                aria-label={labels.prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md bg-white/10 px-3 py-2 text-white backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring"
              >
                ‹
              </button>
              <button
                onClick={() => setIdx((i) => (i + 1) % slides.length)}
                aria-label={labels.next}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-white/10 px-3 py-2 text-white backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring"
              >
                ›
              </button>

              <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-2">
                {slides.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === idx ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.98);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.18s ease-out both;
        }
        .animate-scale-in {
          animation: scale-in 0.18s ease-out both;
        }
      `}</style>
    </div>
  );
}
