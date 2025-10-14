"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoMenu, IoClose } from "react-icons/io5";

export type NavItem = { id: string; label: string };

type NavMenuProps = {
  items: NavItem[];
  className?: string;
};

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/**
 * NavMenu
 * - Bravera-like: hamburger on the right that opens a right-side drawer
 * - Uses react-icons for the trigger/close icons
 * - Focus trap, ESC to close, backdrop click to close
 * - Smooth-scroll to section IDs without changing URL
 * - Background scroll lock while open
 */
export default function NavMenu({ items, className }: NavMenuProps) {
  const [open, setOpen] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  // Focus first interactive element when opening
  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>(
      'button,[href],[tabindex]:not([tabindex="-1"])'
    );
    first?.focus();
  }, [open]);

  // Trap focus inside panel + handle ESC
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      setOpen(false);
      return;
    }
    if (e.key !== "Tab") return;

    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    );
    if (!focusables || focusables.length === 0) return;

    const list = Array.from(focusables).filter(
      (el) => !el.hasAttribute("disabled")
    );
    const first = list[0];
    const last = list[list.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    }
  };

  // Close when clicking the dimmed backdrop (not the panel)
  const onBackdropMouseDown = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) setOpen(false);
  };

  // Smooth-scroll to section, then close
  const handleNavigate = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <>
      {/* Trigger (hamburger on the right, hidden on lg and up) */}
      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cx(
          "inline-flex items-center justify-center",
          className
        )}
      >
        <IoMenu className="h-12 w-12" />
      </button>

      {/* Drawer portal */}
      {open &&
        createPortal(
          <div
            ref={backdropRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-nav-title"
            onMouseDown={onBackdropMouseDown}
            onKeyDown={onKeyDown}
            className={cx(
              "fixed inset-0 z-[60]",
              "bg-black/60 backdrop-blur-sm",
              "flex justify-end"
            )}
          >
            <div
              ref={panelRef}
              className={cx(
                "relative h-full w-[70%] max-w-[22rem]",
                "bg-black/90 text-white",
                "backdrop-blur-md",
                "ring-1 ring-white/15",
                "translate-x-0",
                "transition-transform duration-700 ease-in-out motion-reduce:transition-none",
                "pr-4 pt-28" // leave space for close button and top rhythm
              )}
            >
              {/* Close button */}
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className={cx(
                  "absolute right-6 top-6",
                )}
              >
                <IoClose className="h-8 w-8" />
              </button>

              {/* SR title for dialog */}
              <h2 id="mobile-nav-title" className="sr-only">
                Main menu
              </h2>

              {/* Nav items */}
              <nav className="grid gap-6 px-6">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    className={cx(
                      "text-left text-lg font-light uppercase tracking-wide",
                      "text-white/90 hover:text-[color:var(--brand)]",
                      "focus:outline-none focus-visible:shadow-[0_0_0_3px_var(--ring)]",
                      "px-2 py-1 rounded-md",
                      "transition-[color,transform] duration-200 ease-[var(--ease-gentle)]",
                      "hover:-translate-y-[1px]"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
