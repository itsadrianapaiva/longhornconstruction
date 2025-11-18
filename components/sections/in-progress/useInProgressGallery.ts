import { useState, useMemo } from "react";

type GalleryItem = {
  alt: string;
  width: number;
  height: number;
  sources: Array<{ src: string; format: string }>;
};

type ItemWithGallery = {
  id: string;
  gallery: GalleryItem[];
};

type UseInProgressGalleryResult<T extends ItemWithGallery> = {
  selectedProject: T | null;
  selectedIndex: number;
  openModal: (projectId: string, imageIndex: number) => void;
  closeModal: () => void;
  goNext: () => void;
  goPrev: () => void;
};

/**
 * Hook for managing in-progress gallery modal state
 * Generic over any item type that has id and gallery array
 */
export function useInProgressGallery<T extends ItemWithGallery>(
  items: T[]
): UseInProgressGalleryResult<T> {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedProject = useMemo(() => {
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
      (i) =>
        (i - 1 + selectedProject.gallery.length) %
        selectedProject.gallery.length
    );
  };

  return {
    selectedProject,
    selectedIndex,
    openModal,
    closeModal,
    goNext,
    goPrev,
  };
}
