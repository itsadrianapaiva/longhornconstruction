// components/SectionHeader.tsx  (PATCH)
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
  titleClassName?: string; // section decides the color
  introClassName?: string; // section decides the color
  underline?: UnderlineConfig | null;
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

  // Removed hardcoded "text-ink"
  const baseH2Cls = [
    "text-balance",
    "text-5xl",
    "font-semibold",
    "md:text-6xl",
    "uppercase",
    titleClassName, // color comes from caller
  ]
    .filter(Boolean)
    .join(" ");

  // Removed hardcoded "text-ink/85"
  const baseIntroCls = [
    "mx-auto",
    "mt-6",
    "text-lg",
    introClassName, // color comes from caller
  ]
    .filter(Boolean)
    .join(" ");

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
