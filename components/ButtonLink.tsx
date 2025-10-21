import Link from "next/link";
import * as React from "react";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

type Props = React.ComponentPropsWithoutRef<"a"> & {
  href?: string;
  className?: string;
  /** Darker outline for light/white backgrounds. Defaults to false (glass border). */
  strongBorder?: boolean;
};

/**
 * ButtonLink — CEU tokens + Bravera-style hover glow
 * - Glass pill base with brand glow only on hover/focus
 * - Optional darker border for high-contrast on white backgrounds (strongBorder)
 * - Accessible focus ring (var(--ring))
 */
export default function ButtonLink({
  href = "/",
  className,
  children,
  strongBorder = false,
  ...rest
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        // Layout and shape
        "relative inline-flex h-fit w-fit items-center justify-center rounded-full outline-none",
        // Sizing & typography
        "px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base font-semibold",
        // Surface + border (switches based on strongBorder)
        "bg-glass",
        strongBorder ? "border border-ink/40" : "border border-glass",
        "text-ink/90",
        // Transitions and hover lift
        "transition-[color,border-color,transform] duration-200 ease-[var(--ease-gentle)] hover:-translate-y-px",
        // Focus ring
        "focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        // ::after — brand glow only on hover/focus
        "after:content-[''] after:absolute after:inset-0 after:-z-10 after:rounded-full after:bg-[var(--brand)] after:blur-md after:opacity-0 after:transition-opacity after:duration-500",
        "hover:after:opacity-40 focus-visible:after:opacity-50",
        // Hover tint for text + border
        "hover:text-brand hover:border-brand",
        className
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
