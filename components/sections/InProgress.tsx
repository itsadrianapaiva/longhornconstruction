"use client";

import * as React from "react";
import { SectionShell } from "@/components/sections/SectionShell";
import { useI18n } from "@/lib/i18n/I18nProvider";
import OptimizedImage from "@/components/OptimizedImage";

// --- Types ---

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
  location?: string;
  description?: string;
  progressPercent?: number;
  progressLabel?: string;
  gallery: GalleryItem[];
};

type InProgressLabels = {
  progress: string;
  viewMore: string;
  modalPrev: string;
  modalNext: string;
  modalClose: string;
};

type InProgressDict = {
  id: string;
  title: string;
  intro: string;
  body?: string[];
  labels: InProgressLabels;
  empty: string;
  items: InProgressItem[];
};

// --- Constants ---

const MAX_STRIP_IMAGES = 3;

// --- Helper: Get JPG source from gallery item ---

function getJpgSrc(item: GalleryItem): string {
  const jpg = item.sources.find((s) => s.format === "jpg");
  return jpg?.src || item.sources[0]?.src || "";
}

// --- Modal Component ---

type ModalProps = {
  project: InProgressItem;
  currentIndex: number;
  labels: InProgressLabels;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

function InProgressModal({
  project,
  currentIndex,
  labels,
  onClose,
  onPrev,
  onNext,
}: ModalProps) {
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

// --- Project Block Component ---

type ProjectBlockProps = {
  item: InProgressItem;
  labels: InProgressLabels;
  onOpenModal: (projectId: string, imageIndex: number) => void;
};

function ProjectBlock({ item, labels, onOpenModal }: ProjectBlockProps) {
  const stripImages = item.gallery.slice(0, MAX_STRIP_IMAGES);

  return (
    <div className="border-b border-ink/10 pb-10 last:border-b-0">
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:items-start">
        {/* Text content */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-ink">{item.projectTitle}</h3>

          {item.progressLabel && (
            <p className="text-sm text-ink/70">
              {labels.progress}: {item.progressLabel}
            </p>
          )}

          {item.description && (
            <p className="text-sm leading-relaxed text-ink/80">
              {item.description}
            </p>
          )}

          <button
            type="button"
            onClick={() => onOpenModal(item.id, 0)}
            aria-label={`${labels.viewMore} ${item.projectTitle}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--brand)] hover:underline focus:outline-none focus-visible:ring"
          >
            {labels.viewMore}
            <span className="text-xs">→</span>
          </button>
        </div>

        {/* Horizontal image strip */}
        <div className="flex gap-3 overflow-x-auto pb-2 lg:overflow-x-visible lg:flex-wrap">
          {stripImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onOpenModal(item.id, idx)}
              aria-label={img.alt}
              className="group relative flex-shrink-0 overflow-hidden rounded-lg shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] motion-reduce:transition-none"
            >
              <OptimizedImage
                src={getJpgSrc(img)}
                alt={img.alt}
                width={img.width}
                height={img.height}
                priority={false}
                className="h-32 w-48 object-cover transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none sm:h-40 sm:w-56"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function InProgress() {
  const { t } = useI18n();

  const dict = t<InProgressDict>("inProgress", {
    id: "in-progress",
    title: "",
    intro: "",
    body: [],
    labels: {
      progress: "",
      viewMore: "",
      modalPrev: "",
      modalNext: "",
      modalClose: "",
    },
    empty: "",
    items: [],
  });

  const { id, body = [], labels, empty, items } = dict;

  // Modal state
  const [selectedProjectId, setSelectedProjectId] = React.useState<
    string | null
  >(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const selectedProject = React.useMemo(() => {
    if (!selectedProjectId) return null;
    return items.find((p) => p.id === selectedProjectId) || null;
  }, [selectedProjectId, items]);

  const openModal = (projectId: string, imageIndex: number) => {
    setSelectedProjectId(projectId);
    setSelectedIndex(imageIndex);
  };

  const closeModal = () => {
    setSelectedProjectId(null);
    setSelectedIndex(0);
  };

  const goNext = () => {
    if (!selectedProject) return;
    setSelectedIndex((i) => (i + 1) % selectedProject.gallery.length);
  };

  const goPrev = () => {
    if (!selectedProject) return;
    setSelectedIndex(
      (i) => (i - 1 + selectedProject.gallery.length) % selectedProject.gallery.length
    );
  };

  return (
    <>
      <SectionShell
        id={id}
        pad="lg"
        container
        maxWidth="7xl"
        innerPx
        className="relative"
      >
        {/* Body paragraphs */}
        {body.length > 0 && (
          <div className="mx-auto mb-12 max-w-3xl space-y-4">
            {body.map((paragraph, idx) => (
              <p key={idx} className="text-base leading-relaxed text-ink/80">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Projects list */}
        {items.length === 0 ? (
          <p className="text-center text-ink/60">{empty}</p>
        ) : (
          <div className="space-y-10">
            {items.map((item) => (
              <ProjectBlock
                key={item.id}
                item={item}
                labels={labels}
                onOpenModal={openModal}
              />
            ))}
          </div>
        )}
      </SectionShell>

      {/* Modal */}
      {selectedProject && (
        <InProgressModal
          project={selectedProject}
          currentIndex={selectedIndex}
          labels={labels}
          onClose={closeModal}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </>
  );
}
