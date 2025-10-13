import Link from "next/link";
import * as React from "react";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

type Props = React.ComponentPropsWithoutRef<"a"> & {
  href?: string;
  className?: string;
};

export default function ButtonLink({
  href = "/",
  className,
  children,
  ...rest
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        // Structure
        "relative inline-flex h-fit w-fit items-center justify-center rounded-full outline-none",
        // Sizing + typography
        "px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base font-semibold",
        // Glass at rest: fully transparent bg, but with blur+saturation and a thin glass border
        "bg-transparent border border-glass-border-strong/10 text-page-ink/60",
        "backdrop-blur",
        // Motion + transitions
        "transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-gentle",
        // Hover: subtle lift + stronger border + blue-tinted glass + blue text
        "hover:translate-y-[-1px] hover:border-glass-bg-hover",
        "hover:bg-[color-mix(in_srgb,var(--brand)_26%,transparent)]",
        "hover:text-white/60",
        // Focus-visible: accessible ring + a touch more glow
        "focus-visible:shadow-[0_0_0_3px_var(--brand)]",
        // Glow layer (pseudo-element) — blue halo on hover/focus only
        "after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-full",
        "after:blur-md after:bg-[var(--brand)] after:opacity-0 after:transition-opacity after:duration-300",
        "hover:after:opacity-20 focus-visible:after:opacity-30",
        className
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
