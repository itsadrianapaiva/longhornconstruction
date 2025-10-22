"use client";

import Image from "next/image";
import * as React from "react";
import { SectionShell } from "@/components/sections/SectionShell";
import { useI18n } from "@/lib/i18n/I18nProvider";
import ProjectsModal from "@/components/sections/ProjectsModal";

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

  // Localized dict (no hardcoded strings)
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

  return (
    <SectionShell
      id="projects"
      pad="lg"
      container
      maxWidth="7xl"
      innerPx
      className="relative"
      innerClassName="relative"
    >
      {/* Header (keep your title + optional intro) */}
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="text-balance text-5xl font-semibold text-ink md:text-6xl">
          {dict.title}
        </h2>
        {dict.intro ? (
          <p className="mx-auto mt-6 text-lg text-ink/85">{dict.intro}</p>
        ) : null}
      </div>

      {/* GRID — minimal, no dead space */}
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
                className="overflow-hidden rounded-xl border bg-white"
              >
                <button
                  type="button"
                  onClick={() => setSelectedProjectId(p.id)}
                  data-project-id={p.id}
                  aria-label={
                    (dict.viewGallery || "Open gallery") + " — " + p.title
                  }
                  className="block w-full text-left focus:outline-none focus-visible:ring cursor-pointer"
                >
                  {/* Media keeps the entire card height tidy */}
                  <div className="relative aspect-[16/10] w-full">
                    {img ? (
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        priority={img.priority ?? false}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-neutral-200" />
                    )}

                    {/* Title + click hint (no gradient, no extra height) */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3
                          className="rounded px-1.5 py-0.5 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                          style={{ background: "rgba(0,0,0,0.55)" }}
                        >
                          {p.title}
                        </h3>
                        <span
                          className="shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium"
                          style={{
                            background: "var(--brand)",
                            borderColor: "var(--brand-border)",
                            color: "var(--brand-ink)",
                          }}
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
