// components/sections/SectionShell.tsx
// Minimal, flexible shell for non-hero sections.
// - No HSL, no external deps.
// - Pad presets: "none" | "sm" | "md" | "lg"
// - Optional centered container with max width and inner px.
// - Optional <header> with title/subtitle (aria-labelledby handled).

type Pad = "none" | "sm" | "md" | "lg";

type SectionShellProps = {
  id: string;
  title?: string;
  subtitle?: string;
  as?: React.ElementType;          // root tag (defaults to <section>)
  pad?: Pad;                       // vertical rhythm
  container?: boolean;             // wrap content in centered container
  maxWidth?: "5xl" | "6xl" | "7xl"; // container width
  innerPx?: boolean;               // add horizontal padding inside container
  className?: string;              // extra classes on root
  innerClassName?: string;         // extra classes on inner wrapper
  children?: React.ReactNode;
};

// Tiny joiner to avoid dependencies
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// Map pad → vertical spacing classes
function padY(pad: Pad): string {
  switch (pad) {
    case "none": return "py-0";
    case "sm":   return "py-12 md:py-16";
    case "md":   return "py-16 md:py-20";
    case "lg":   return "py-20 md:py-24";
    default:     return "py-16 md:py-20";
  }
}

export function SectionShell({
  id,
  title,
  subtitle,
  as: Comp = "section",
  pad = "md",
  container = true,
  maxWidth = "6xl",
  innerPx = true,
  className,
  innerClassName,
  children,
}: SectionShellProps) {
  return (
    <Comp
      id={id}
      aria-labelledby={title ? `${id}-title` : undefined}
      className={cn(padY(pad), className)}
    >
      <div
        className={cn(
          container && "mx-auto w-full",
          container && (maxWidth === "5xl" && "max-w-5xl") || (maxWidth === "6xl" && "max-w-6xl") || (maxWidth === "7xl" && "max-w-7xl"),
          container && innerPx && "px-4 md:px-6",
          innerClassName,
        )}
      >
        {title ? (
          <header className="mb-8">
            <h2 id={`${id}-title`} className="text-2xl md:text-3xl font-semibold tracking-tight">
              {title}
            </h2>
            {subtitle ? <p className="mt-2 text-ink/80">{subtitle}</p> : null}
          </header>
        ) : null}

        {children}
      </div>
    </Comp>
  );
}
