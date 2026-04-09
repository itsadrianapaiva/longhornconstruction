// components/sections/Projects.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { SectionShell } from "@/components/sections/SectionShell";
import { useI18n } from "@/lib/i18n/I18nProvider";
import ProjectsModal from "@/components/sections/ProjectsModal";
import OptimizedImage from "@/components/OptimizedImage";
import SectionHeader from "@/components/SectionHeader";

type GallerySource = { src: string; format: "jpg" | "webp" };
type GalleryItem = {
  alt: string;
  width: number;
  height: number;
  sources: GallerySource[];
};
type Thumbnail = { src: string; alt: string; width: number; height: number };

type ProjectItem = {
  id: string;
  title: string;
  category?: string;
  technology?: string[];
  thumbnail?: Thumbnail;
  gallery?: GalleryItem[];
};

type RoughWorkCard = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
};

type ProjectsDict = {
  title: string;
  intro: string;
  viewGallery?: string;
  empty: string;
  modal: { prev: string; next: string; close: string };
  items: ProjectItem[];
  roughWorkCard?: RoughWorkCard;
};

export default function Projects() {
  const { t, locale } = useI18n();

  const dict = t<ProjectsDict>("projects", {
    title: "",
    intro: "",
    viewGallery: "",
    empty: "",
    modal: { prev: "", next: "", close: "" },
    items: [],
    roughWorkCard: {
      eyebrow: "",
      title: "",
      body: "",
      cta: "",
      href: "",
    },
  });

  // Extract top-level fields for consistency
  const { title, intro, viewGallery, empty, modal, items, roughWorkCard } = dict;
  const hasRoughWorkCard = Boolean(roughWorkCard && roughWorkCard.href);

  const SHOW_ONLY_WITH_MEDIA = true;

  const visibleItems = React.useMemo(() => {
    const base: ProjectItem[] = Array.isArray(items) ? items : [];
    const visible = SHOW_ONLY_WITH_MEDIA
      ? base.filter((p) =>
          Boolean(p.thumbnail?.src || (p.gallery && p.gallery.length > 0))
        )
      : base;

    if (process.env.NODE_ENV === "development") {
      console.debug(
        "projects.visible",
        visible.map((p) => ({
          id: p.id,
          hasThumb: !!p.thumbnail?.src,
          slides: p.gallery?.length || 0,
        }))
      );
    }
    return visible;
  }, [items, SHOW_ONLY_WITH_MEDIA]);

  // Locale aware href for the rough work card
  const localizedRoughHref =
    roughWorkCard && roughWorkCard.href
      ? `/${locale}${
          roughWorkCard.href.startsWith("/")
            ? roughWorkCard.href
            : `/${roughWorkCard.href}`
        }`
      : undefined;

  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(
    null
  );

  const selectedProject = selectedProjectId
    ? visibleItems.find((p) => p.id === selectedProjectId) ?? null
    : null;

  const MESH_SRC = "/media/gradients/mesh1.png";

  return (
    <SectionShell
      id="projects"
      pad="lg"
      container
      maxWidth="7xl"
      innerPx
      className="relative isolate"
      innerClassName="relative pt-16 md:pt-28"
    >
      {/* FULL-BLEED mesh background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-y-0 -z-10
          left-[calc(50%-50svw)] w-[100svw]
          overflow-hidden
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
              opacity-60 dark:opacity-40
              will-change-transform transform-gpu
              motion-reduce:transform-none motion-reduce:transition-none
              select-none
            "
          />
        </div>

        <div
          className="
            absolute inset-0
            bg-[color:var(--surface-tint,rgba(255,255,255,0.0))]
            dark:bg-[color:var(--surface-tint-dark,rgba(0,0,0,0.1))]
          "
        />
      </div>

      {/* Standardized header */}
      <SectionHeader
        title={title}
        intro={intro}
        className="mx-auto mb-16 max-w-2xl"
        titleClassName="text-ink"
        introClassName="text-ink/85"
      />

      {/* GRID */}
      {!visibleItems.length ? (
        <p className="text-neutral-600 dark:text-neutral-300">{empty}</p>
      ) : (
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label={title}
        >
          {visibleItems.map((p) => {
            let imgSrc = p.thumbnail?.src;
            let imgAlt = p.thumbnail?.alt || p.title;
            let imgWidth = p.thumbnail?.width || 1600;
            let imgHeight = p.thumbnail?.height || 1000;

            if (!imgSrc && p.gallery && p.gallery.length > 0) {
              const firstGallery = p.gallery[0];
              const jpgSrc = firstGallery.sources?.find(
                (s) => s.format === "jpg"
              )?.src;
              imgSrc = jpgSrc || firstGallery.sources?.[0]?.src;
              imgAlt = firstGallery.alt || p.title;
              imgWidth = firstGallery.width || 1600;
              imgHeight = firstGallery.height || 1000;
            }

            const hasGallery = (p.gallery?.length ?? 0) > 0;

            return (
              <article
                key={p.id}
                role="listitem"
                className="
                  group relative overflow-hidden rounded-2xl
                  border border-[color:var(--card-border,rgba(255,255,255,0.22))]
                  bg-[color:var(--card-bg,rgba(255,255,255,0.06))]
                  dark:bg-[color:var(--card-bg-dark,rgba(0,0,0,0.25))]
                  shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                  transition-shadow duration-300
                  will-change-transform transform-gpu
                  hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]
                  motion-reduce:transform-none motion-reduce:transition-none
                  focus-within:ring-2 focus-within:ring-[color:var(--brand)] focus-within:ring-offset-0
                "
              >
                <button
                  type="button"
                  onClick={() => hasGallery && setSelectedProjectId(p.id)}
                  data-project-id={p.id}
                  aria-label={
                    viewGallery && viewGallery.trim().length > 0
                      ? `${viewGallery} ${p.title}`
                      : p.title
                  }
                  disabled={!hasGallery}
                  className="block w-full text-left focus:outline-none cursor-pointer disabled:cursor-default"
                >
                  <div className="relative aspect-[4/3] w-full">
                    {imgSrc ? (
                      <OptimizedImage
                        src={imgSrc}
                        alt={imgAlt}
                        width={imgWidth}
                        height={imgHeight}
                        priority={false}
                        className="h-full w-full object-cover will-change-transform transform-gpu [backface-visibility:hidden]"
                      />
                    ) : (
                      <div className="h-full w-full bg-neutral-200 dark:bg-neutral-800" />
                    )}

                    {/* Label bar */}
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
                          {viewGallery}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}

          {/* Work in progress card */}
          {hasRoughWorkCard && roughWorkCard && (
            <article
              role="listitem"
              className="
                group relative overflow-hidden rounded-2xl
                border border-[color:var(--card-border,rgba(255,255,255,0.22))]
                bg-[color:var(--card-bg,rgba(255,255,255,0.06))]
                dark:bg-[color:var(--card-bg-dark,rgba(0,0,0,0.25))]
                shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                transition-shadow duration-300
                will-change-transform transform-gpu
                hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]
                motion-reduce:transform-none motion-reduce:transition-none
                focus-within:ring-2 focus-within:ring-[color:var(--brand)] focus-within:ring-offset-0
              "
            >
              <Link
                href={localizedRoughHref ?? "/"}
                aria-label={roughWorkCard.title}
                className="block w-full focus:outline-none"
              >
                <div className="relative aspect-[4/3] w-full">
                  {/* Background image */}
                  <OptimizedImage
                    src="/media/projects/in-progress/1-sm.jpg"
                    alt=""
                    width={800}
                    height={600}
                    priority={false}
                    className="h-full w-full object-cover opacity-30 grayscale"
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40" />

                  {/* Centered text content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <span className="mb-2 text-xs font-medium uppercase tracking-wider text-white/70">
                      {roughWorkCard.eyebrow}
                    </span>
                    <h3 className="mb-3 text-lg font-semibold text-white sm:text-xl">
                      {roughWorkCard.title}
                    </h3>
                    <p className="mb-4 max-w-xs text-sm leading-relaxed text-white/80">
                      {roughWorkCard.body}
                    </p>
                    <span
                      className="
                        inline-flex items-center gap-2
                        rounded-full
                        border border-[color:var(--brand-border)]
                        bg-black/40
                        px-4 py-1.5
                        text-sm font-medium text-white
                      "
                    >
                      <span>{roughWorkCard.cta}</span>
                      <span
                        className="
                          inline-block transition-transform duration-200
                          group-hover:translate-x-1
                          motion-reduce:transform-none motion-reduce:transition-none
                        "
                      >
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          )}
        </div>
      )}

      <ProjectsModal
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProjectId(null)}
        project={selectedProject}
        labels={modal}
      />
    </SectionShell>
  );
}
