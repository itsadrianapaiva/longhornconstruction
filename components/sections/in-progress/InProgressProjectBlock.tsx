"use client";

import OptimizedImage from "@/components/OptimizedImage";
import { MAX_STRIP_IMAGES, getJpgSrc } from "./galleryUtils";
import InProgressProgressBar from "./InProgressProgressBar";

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
  progressPercent?: number;
  progressLabel?: string; // can hold custom text like "70%" or "Structure complete"
  description?: string;
  gallery: GalleryItem[];
};

type ProjectLabels = {
  progress: string; // localized "Progress"
  viewMore: string;
};

type InProgressProjectBlockProps = {
  item: InProgressItem;
  labels: ProjectLabels;
  onOpenModal: (projectId: string, imageIndex: number) => void;
};

export default function InProgressProjectBlock({
  item,
  labels,
  onOpenModal,
}: InProgressProjectBlockProps) {
  const stripImages = item.gallery.slice(0, MAX_STRIP_IMAGES);

  // Progress bar logic
  const { progressPercent, progressLabel } = item;
  const hasProgress =
    typeof progressPercent === "number" && Number.isFinite(progressPercent);

  const clampedPercent = hasProgress
    ? Math.max(0, Math.min(100, progressPercent as number))
    : null;

  // Value text on the right: prefer progressLabel, fall back to numeric percent
  const progressValueText =
    hasProgress && clampedPercent !== null
      ? progressLabel ?? `${clampedPercent}%`
      : null;

  return (
    <div className="border-b border-ink/10 pb-10 last:border-b-0">
      <div className="grid gap-6 lg:grid-cols-[0.5fr_2fr] lg:items-start">
        {/* Text content */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-ink">
            {item.projectTitle}
          </h3>

          {hasProgress &&
            clampedPercent !== null &&
            progressValueText && (
              <InProgressProgressBar
                label={labels.progress}         // always "Progress"
                valueText={progressValueText}   // e.g. "70%"
                percent={clampedPercent}
                className="mt-2"
              />
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
        <div className="flex gap-4 overflow-x-auto pb-2 lg:overflow-x-visible lg:flex-wrap">
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
