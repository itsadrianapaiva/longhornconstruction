"use client";

/**
 * Projects Section – Downsized Thumbnail Workflow
 * ────────────────────────────────────────────────
 *
 * Grid cards now expect each project's first media item to reference a DOWNSIZED
 * asset ending in "-sm.jpg" (or WebP equivalent). These optimized thumbnails live
 * next to the originals in /public/media/projects/...
 *
 * Example:
 *   Original (full-res):   /public/media/projects/casa-no-alto/1.jpg
 *   Downsized (thumbnail): /public/media/projects/casa-no-alto/1-sm.jpg
 *
 * Target specs for downsized assets:
 *   - Max width: ~1600px
 *   - Quality: ~75% JPG or WebP
 *   - File size: under ~200KB each
 *
 * The i18n dictionary (projects.items[*].media) should be updated so that the
 * first media entry (the one displayed in the grid card) uses the "-sm" path.
 *
 * The modal (ProjectsModal) can still reference high-res entries later in the
 * same media array, because it loads on demand and shows one image at a time.
 *
 * After adding the "-sm" files and updating the i18n paths, test in:
 *   DevTools → Network → Img (with cache disabled)
 * to confirm that thumbnails are not multi-megabyte originals.
 */

import Image from "next/image";
import * as React from "react";
import { SectionShell } from "@/components/sections/SectionShell";
import { useI18n } from "@/lib/i18n/I18nProvider";
import ProjectsModal from "@/components/sections/ProjectsModal";
import OptimizedImage from "@/components/OptimizedImage";

/** Types aligned to i18n shape (minimal by design) */
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
  category?: string;
  technology?: string[];
  media: ProjectMediaImage[];
};

type ProjectsDict = {
  title: string;
  intro: string;
  viewGallery?: string;
  empty: string;
  modal: { prev: string; next: string; close: string };
  items: ProjectItem[];
};

export default function Projects() {
  const { t } = useI18n();

  // Localized dict (no hardcoded UI strings)
  const dict = t<ProjectsDict>("projects", {
    title: "",
    intro: "",
    viewGallery: "",
    empty: "",
    modal: { prev: "", next: "", close: "" },
    items: [],
  });

  // Toggle later to hide items with no images
  const SHOW_ONLY_WITH_MEDIA = true;

  // Visible list (stable deps)
  const visibleItems = React.useMemo(() => {
    const base: ProjectItem[] = Array.isArray(dict.items) ? dict.items : [];
    return SHOW_ONLY_WITH_MEDIA
      ? base.filter((p) => p.media?.length > 0)
      : base;
  }, [dict.items, SHOW_ONLY_WITH_MEDIA]);

  // Modal state
  const [selectedProjectId, setSelectedProjectId] = React.useState<
    string | null
  >(null);
  const selectedProject = selectedProjectId
    ? visibleItems.find((p) => p.id === selectedProjectId) ?? null
    : null;

  // Your gradient mesh asset in /public
  const MESH_SRC = "/media/gradients/mesh3.png";

  return (
    <SectionShell
      id="projects"
      pad="lg"
      container
      maxWidth="7xl"
      innerPx
      className="relative"
      innerClassName="relative pt-16 md:pt-28"
    >
      {/* Gradient mesh background (subtle) */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 -z-10 overflow-hidden
          [mask-image:radial-gradient(90%_70%_at_50%_20%,#000_60%,transparent_100%)]
        "
      >
        <div className="absolute inset-0">
          <Image
            src={MESH_SRC}
            alt=""
            fill
            priority={false}
            sizes="100vw"
            className="
              object-cover
              opacity-60
              dark:opacity-40
              mix-blend-normal
              will-change-transform
              motion-reduce:transform-none motion-reduce:transition-none
            "
          />
        </div>

        {/* Soft overlay to unify colors and improve contrast */}
        <div
          className="
            absolute inset-0
            bg-[color:var(--surface-tint,rgba(255,255,255,0.0))]
            dark:bg-[color:var(--surface-tint-dark,rgba(0,0,0,0.1))]
          "
        />
      </div>

      {/* Header */}
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="text-balance text-5xl font-semibold text-ink md:text-6xl">
          {dict.title}
        </h2>
        {dict.intro ? (
          <p className="mx-auto mt-6 text-lg text-ink/85">{dict.intro}</p>
        ) : null}
      </div>

      {/* GRID */}
      {!visibleItems.length ? (
        <p className="text-neutral-600 dark:text-neutral-300">{dict.empty}</p>
      ) : (
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label={dict.title}
        >
          {visibleItems.map((p) => {
            const img = p.media?.find((m) => m.type === "image");

            return (
              <article
                key={p.id}
                role="listitem"
                className="
                  group relative overflow-hidden rounded-2xl
                  border border-[color:var(--card-border,rgba(255,255,255,0.22))]
                  bg-[color:var(--card-bg,rgba(255,255,255,0.06))]
                  dark:bg-[color:var(--card-bg-dark,rgba(0,0,0,0.25))]
                  backdrop-blur-md
                  shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                  transition-transform transition-shadow
                  duration-300
                  will-change-transform
                  hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]
                  hover:-translate-y-0.5
                  motion-reduce:transform-none motion-reduce:transition-none
                  focus-within:ring-2 focus-within:ring-[color:var(--brand)] focus-within:ring-offset-0
                "
              >
                <button
                  type="button"
                  onClick={() => setSelectedProjectId(p.id)}
                  data-project-id={p.id}
                  aria-label={
                    (dict.viewGallery || "Open gallery") + " — " + p.title
                  }
                  className="block w-full text-left focus:outline-none cursor-pointer"
                >
                  {/* Media keeps the entire card height tidy */}
                  <div className="relative aspect-[4/3] w-full">
                    {img ? (
                      <OptimizedImage
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        priority={img.priority ?? false}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-neutral-200 dark:bg-neutral-800" />
                    )}

                    {/* Frosted glass label bar */}
                    <div className="pointer-events-none absolute inset-x-3 bottom-3">
                      <div
                        className="
                          flex items-center justify-between gap-3
                          rounded-lg
                          border border-[color:var(--chip-border,rgba(255,255,255,0.25))]
                          bg-[color:var(--chip-bg,rgba(0,0,0,0.35))]
                          backdrop-blur-sm
                          px-2.5 py-1.5
                          shadow-[0_2px_6px_rgba(0,0,0,0.25)]
                        "
                      >
                        <h3 className="text-sm font-medium text-white">
                          {p.title}
                        </h3>
                        <span
                          className="
                            shrink-0 rounded-2xl
                            border border-[color:var(--brand-border)]
                            bg-black/40
                            px-2 py-0.5 text-xs font-semibold
                            text-white/80
                          "
                        >
                          {dict.viewGallery || "Open gallery"}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal viewer */}
      <ProjectsModal
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProjectId(null)}
        project={selectedProject}
        labels={dict.modal}
      />
    </SectionShell>
  );
}
