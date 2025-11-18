"use client";

import { SectionShell } from "@/components/sections/SectionShell";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useInProgressGallery } from "./in-progress/useInProgressGallery";
import InProgressModal from "./in-progress/InProgressModal";
import InProgressProjectBlock from "./in-progress/InProgressProjectBlock";

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

  const {
    selectedProject,
    selectedIndex,
    openModal,
    closeModal,
    goNext,
    goPrev,
  } = useInProgressGallery(items);

  return (
    <>
      <SectionShell
        id={id}
        pad="lg"
        container
        maxWidth="5xl"
        innerPx
        className="relative"
      >
        {/* Body paragraphs */}
        {body.length > 0 && (
          <div className="mx-auto mb-12 max-w-4xl space-y-4">
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
              <InProgressProjectBlock
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
