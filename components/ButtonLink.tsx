import Link from "next/link";
import * as React from "react";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

type Props = React.ComponentPropsWithoutRef<"a"> & {
  href?: string;
  className?: string;
};

export default function ButtonLink({ href = "/", className, children, ...rest }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex h-fit w-fit items-center justify-center rounded-full transition-colors outline-none",
        "text-ink border border-glass bg-glass focus-visible:ring-brand",
        // glow layer (hidden until hover/focus)
        "after:absolute after:inset-0 after:-z-10 after:rounded-full after:blur-md after:bg-ring after:opacity-0 after:transition-all after:duration-500",
        "hover:text-ring hover:border-glass-strong hover:after:opacity-15",
        "px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base",
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
