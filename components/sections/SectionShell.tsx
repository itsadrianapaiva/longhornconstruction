// Bravera-like bounded container with your title/subtitle ergonomics.
// No external deps; tiny cn() replaces clsx.

type SectionShellProps = {
  id: string;
  title?: string;
  subtitle?: string;
  as?: React.ElementType;             // change root element (e.g., "section", "div")
  className?: string;                 // extra classes on outer wrapper
  innerClassName?: string;            // extra classes on inner container
  container?: boolean;                // toggle inner max-w container
  firstTopPad?: boolean;              // apply first:pt-10 rhythm
  pad?: "tight" | "normal" | "loose"; // vertical spacing scale
  children?: React.ReactNode;
};

// Minimal classnames joiner (keeps TS happy and avoids clsx dependency)
function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function SectionShell({
  id,
  title,
  subtitle,
  as: Comp = "section",
  className,
  innerClassName,
  container = true,
  firstTopPad = true,
  pad = "normal",
  children,
}: SectionShellProps) {
  // Vertical padding scales similarly to Bravera’s Bounded
  const padY =
    pad === "tight"
      ? "py-12 md:py-16 lg:py-20"
      : pad === "loose"
      ? "py-20 md:py-24 lg:py-28"
      : "py-14 md:py-20 lg:py-24";

  return (
    <Comp
      id={id}
      aria-labelledby={title ? `${id}-title` : undefined}
      className={cn("px-4 md:px-6", padY, firstTopPad && "first:pt-10", className)}
    >
      <div
        className={cn(
          container && "mx-auto w-full max-w-6xl",
          "flex flex-col",
          innerClassName,
        )}
      >
        {title ? (
          <header className="mb-8">
            <h2
              id={`${id}-title`}
              className="font-heading text-2xl md:text-3xl font-semibold tracking-tight"
            >
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-2 text-[hsl(var(--page-fg)/0.72)]">{subtitle}</p>
            ) : null}
          </header>
        ) : null}
        {children}
      </div>
    </Comp>
  );
}
