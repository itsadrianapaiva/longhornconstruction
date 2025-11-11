"use client";

import * as React from "react";

type UnderlineConfig = {
  highlightTarget: string;
  renderEffect: (title: string, target: string) => React.ReactNode;
};

type SectionHeaderProps = {
  title: string;
  intro?: string | null;
  className?: string;
  titleClassName?: string;
  introClassName?: string;

  // Optional mesh underline variant
  underline?: UnderlineConfig | null;

  // Advanced escape hatch to wrap the final <h2> (e.g., animated About header)
  renderTitle?: (baseH2ClassName: string, content: React.ReactNode) => React.ReactNode;
};

export default function SectionHeader({
  title,
  intro,
  className,
  titleClassName,
  introClassName,
  underline,
  renderTitle,
}: SectionHeaderProps) {
  const containerCls = ["text-center", className].filter(Boolean).join(" ");

  const baseH2Cls = [
    "text-balance",
    "text-5xl",
    "font-semibold",
    "text-ink",
    "md:text-6xl",
    "uppercase",
    titleClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const baseIntroCls = [
    "mx-auto",
    "mt-6",
    "text-lg",
    "text-ink/85",
    introClassName,
  ]
    .filter(Boolean)
    .join(" ");

  // Always normalize to uppercase for consistent look
  const normalizedTitle = React.useMemo(() => title.toUpperCase(), [title]);

  const titleContent: React.ReactNode = underline
    ? underline.renderEffect(normalizedTitle, underline.highlightTarget.toUpperCase())
    : normalizedTitle;

  const h2Node = renderTitle
    ? renderTitle(baseH2Cls, titleContent)
    : <h2 className={baseH2Cls}>{titleContent}</h2>;

  return (
    <div className={containerCls}>
      {h2Node}
      {intro ? <p className={baseIntroCls}>{intro}</p> : null}
    </div>
  );
}
