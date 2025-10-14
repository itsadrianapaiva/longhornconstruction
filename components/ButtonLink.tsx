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
        // Sizing + type
        "px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base font-semibold",

        // REST — unchanged
        "bg-transparent border border-glass-border-strong/10 text-page-ink/60 backdrop-blur",

        // Motion (no color/border changes)
        "transition-[transform,filter] duration-200 ease-gentle hover:-translate-y-[1px]",

        // Accessible focus ring
        "focus-visible:shadow-[0_0_0_3px_var(--ring)]",

        // ::after — outer neon from the pill border outward
        "after:content-[''] after:absolute after:inset-0 after:rounded-full after:pointer-events-none",

        // GLOW COLOR via token:
        //   Use var(--brand) so it stays on-brand and easy to tune in globals.css
        // INTENSITY KNOBS:
        //   - First pair numbers: near-border halo (radius, spread)
        //   - Second pair numbers: secondary halo (slightly larger)
        //   Increase spread for more bloom; reduce for tighter glow.
        "after:shadow-[0_0_10px_4px_var(--brand),0_0_18px_8px_var(--brand-border)]",

        // OPACITY KNOB:
        //   Change these percentages to strengthen or soften without changing size.
        "after:opacity-0 after:transition-opacity after:duration-800",
        "hover:after:opacity-50 focus-visible:after:opacity-65",

        className
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
