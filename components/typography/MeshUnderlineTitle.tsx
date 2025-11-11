"use client";

import * as React from "react";

type MeshUnderlineTitleProps = {
  /** The full title text */
  title: string;
  /** The word or phrase to underline using the mesh effect */
  highlightTarget?: string | null;
  /**
   * Your existing function. It must accept (text, target) and return a ReactNode.
   * Example: renderWithMeshUnderline(title, highlightTarget)
   */
  renderEffect: (text: string, target: string) => React.ReactNode;
  /** Optional: force uppercase normalization for consistent matching */
  uppercase?: boolean;
};

/**
 * MeshUnderlineTitle
 * A thin wrapper that delegates to your existing renderWithMeshUnderline(text, target).
 * It keeps the signature and behavior intact and only adds safe normalization.
 */
export function MeshUnderlineTitle({
  title,
  highlightTarget,
  renderEffect,
  uppercase = true,
}: MeshUnderlineTitleProps) {
  // 1) Normalize text and target if requested so global uppercase styles do not break matching
  const normalizedTitle = React.useMemo(
    () => (uppercase ? title.toUpperCase() : title),
    [title, uppercase]
  );

  const normalizedTarget = React.useMemo(
    () =>
      uppercase && highlightTarget
        ? highlightTarget.toUpperCase()
        : highlightTarget || "",
    [highlightTarget, uppercase]
  );

  // 2) If there is no target, just render the title as is
  if (!normalizedTarget) return <>{normalizedTitle}</>;

  // 3) Delegate the decorated rendering to your existing function
  return <>{renderEffect(normalizedTitle, normalizedTarget)}</>;
}
