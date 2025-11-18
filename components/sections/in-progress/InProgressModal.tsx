"use client";

import * as React from "react";
import { getJpgSrc } from "./galleryUtils";

type GallerySource = { src: string; format: "jpg" | "webp" };
type GalleryItem = {
  alt: string;
  width: number;
  height: number;
  sources: GallerySource[];
};

type InProgressItem = {
  id: string;
  projectTitle: string;
  gallery: GalleryItem[];
};

type ModalLabels = {
  modalPrev: string;
  modalNext: string;
  modalClose: string;
};

type InProgressModalProps = {
  project: InProgressItem;
  currentIndex: number;
  labels: ModalLabels;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function InProgressModal({
  project,
  currentIndex,
  labels,
  onClose,
  onPrev,
  onNext,
}: InProgressModalProps) {
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const gallery = project.gallery;
  const current = gallery[currentIndex];

  // Focus management
  React.useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => prev?.focus();
  }, []);

  // Keyboard navigation
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  // Prevent body scroll
  React.useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const webpSrc = current?.sources.find((s) => s.format === "webp")?.src;
  const jpgSrc = getJpgSrc(current);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${labels.modalClose} ${project.projectTitle}`}
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label={labels.modalClose}
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
      />

      {/* Content */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-[101] mx-4 w-full max-w-5xl outline-none"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">
            {project.projectTitle}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-white/10 px-3 py-1 text-sm text-white backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring"
          >
            {labels.modalClose}
          </button>
        </div>

        {/* Image stage */}
        <div className="relative overflow-hidden rounded-xl bg-black">
          {jpgSrc ? (
            <picture>
              {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
              <img
                src={jpgSrc}
                alt={current?.alt || project.projectTitle}
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

          {/* Navigation controls */}
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={onPrev}
                aria-label={labels.modalPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md bg-white/10 px-3 py-2 text-white backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring"
              >
                {labels.modalPrev}
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label={labels.modalNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-white/10 px-3 py-2 text-white backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring"
              >
                {labels.modalNext}
              </button>

              {/* Dots indicator */}
              <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-2">
                {gallery.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === currentIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
