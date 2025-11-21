"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { IoMenu, IoClose } from "react-icons/io5";
import ButtonLink from "@/components/ButtonLink";
import CeuSocialLinks from "@/components/CeuSocialLinks";

export type NavItem = { id: string; label: string };
export type NavMode = "scroll" | "link";

type NavMenuProps = {
  items: NavItem[];
  className?: string;
  logoSrc?: string; // defaults to /media/logo-white.png
  logoAlt?: string; // defaults to "CÉU Construction"
  ctaLabel?: string; // e.g. dict.hero.primaryCta
  ctaTargetId?: string; // defaults to "contact"
  mode?: NavMode; // "scroll" for homepage, "link" for inner pages
  locale?: string; // required when mode="link"
  showSocial?: boolean; // defaults to true
};

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/** Drawer with enter/exit animation. Keeps functions small and readable. */
function MobileDrawer({
  open,
  onClose,
  items,
  logoSrc = "/media/logo-white.png",
  logoAlt = "CÉU Construction",
  ctaLabel = "Request a consultation",
  ctaTargetId = "contact",
  mode = "scroll",
  locale,
  showSocial = true,
}: Required<Pick<NavMenuProps, "items">> & {
  open: boolean;
  onClose: () => void;
  logoSrc?: string;
  logoAlt?: string;
  ctaLabel?: string;
  ctaTargetId?: string;
  mode?: NavMode;
  locale?: string;
  showSocial?: boolean;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // (1) mounted controls portal presence; (2) visible controls CSS classes
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Open/close choreography with forced reflow before setting visible=true
  useEffect(() => {
    if (open) {
      setMounted(true);
    } else {
      // start exit transition
      setVisible(false);
    }
  }, [open]);

  // When mounted flips true, wait a tick, force a reflow, then set visible=true
  useEffect(() => {
    if (!mounted) return;
    // Ensure we start hidden state for animation
    setVisible(false);

    // Next frame: the panel is in the DOM with translate-x-full / opacity-0
    requestAnimationFrame(() => {
      // Force a reflow so the browser “registers” the starting style
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      panelRef.current && panelRef.current.getBoundingClientRect();
      // Now flip to visible to trigger the transition
      setVisible(true);
    });
  }, [mounted]);

  // When the panel finishes its transition and it's not visible, unmount
  const handlePanelTransitionEnd = useCallback(() => {
    if (!visible) setMounted(false);
  }, [visible]);

  // Lock background scroll while drawer is mounted & visible
  useEffect(() => {
    if (!mounted) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [mounted]);

  // Focus first focusable on open
  useEffect(() => {
    if (!visible) return;
    const first = panelRef.current?.querySelector<HTMLElement>(
      'button,[href],[tabindex]:not([tabindex="-1"])'
    );
    first?.focus();
  }, [visible]);

  // Focus trap + ESC
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;

    const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    );
    if (!nodes || nodes.length === 0) return;

    const list = Array.from(nodes).filter((el) => !el.hasAttribute("disabled"));
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

  // Backdrop click (only if clicking the backdrop, not the panel)
  const onBackdropMouseDown = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  // Navigation helper: scroll on homepage, link on inner pages
  const handleNavigate = (id: string) => {
    if (mode === "scroll") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-nav-title"
      onMouseDown={onBackdropMouseDown}
      onKeyDown={onKeyDown}
      className={cx(
        "fixed inset-0 z-[60] flex justify-end",
        // Fade the backdrop
        "bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        ref={panelRef}
        onTransitionEnd={handlePanelTransitionEnd}
        className={cx(
          "relative h-full w-[70%] max-w-[22rem]",
          "bg-black/90 text-white backdrop-blur-md ring-1 ring-white/15",
          // Slide from right -> left
          "transition-transform duration-300 ease-out motion-reduce:transition-none",
          visible ? "translate-x-0" : "translate-x-full",
          // Layout
          "flex flex-col"
        )}
      >
        {/* Close button */}
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="absolute right-6 top-6 inline-flex items-center justify-center"
        >
          <IoClose className="h-8 w-8" />
        </button>

        <h2 id="mobile-nav-title" className="sr-only">Main menu</h2>

        {/* Top: logo */}
        <div className="pl-6 pt-12 pb-4">
          {mode === "scroll" ? (
            <Link
              href="#"
              aria-label="Go to top"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate("hero");
              }}
              className="inline-block"
            >
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={208}
                height={56}
                priority={false}
                className="w-52 h-auto"
              />
            </Link>
          ) : (
            <Link
              href={`/${locale}`}
              aria-label="Go to homepage"
              onClick={onClose}
              className="inline-block"
            >
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={208}
                height={56}
                priority={false}
                className="w-52 h-auto"
              />
            </Link>
          )}
        </div>

        {/* Middle: nav items */}
        <nav className="grid gap-4 pl-14">
          {items.map((item) =>
            mode === "scroll" ? (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={cx(
                  "text-left text-lg font-light uppercase tracking-wide cursor-pointer",
                  "text-white/90 hover:text-[color:var(--brand)]",
                  "focus:outline-none focus-visible:shadow-[0_0_0_3px_var(--ring)]",
                  "px-2 rounded-md",
                  "transition-[color,transform] duration-200 ease-[var(--ease-gentle)] hover:-translate-y-[1px)]"
                )}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.id}
                href={`/${locale}#${item.id}`}
                onClick={onClose}
                className={cx(
                  "text-left text-lg font-light uppercase tracking-wide cursor-pointer",
                  "text-white/90 hover:text-[color:var(--brand)]",
                  "focus:outline-none focus-visible:shadow-[0_0_0_3px_var(--ring)]",
                  "px-2 rounded-md",
                  "transition-[color,transform] duration-200 ease-[var(--ease-gentle)] hover:-translate-y-[1px)]"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex-1" />

        {/* Bottom: Social links + CTA */}
        <div className="px-6 pb-8 pt-6 space-y-4">
          {showSocial && (
            <div className="flex justify-center">
              <CeuSocialLinks
                label={locale === "pt" ? "Siga nos" : "Follow us"}
                showLabel={true}
                variant="inline"
              />
            </div>
          )}
          {mode === "scroll" ? (
            <ButtonLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(ctaTargetId);
              }}
              className="w-full justify-center"
            >
              {ctaLabel}
            </ButtonLink>
          ) : (
            <ButtonLink
              href={`/${locale}#${ctaTargetId}`}
              onClick={onClose}
              className="w-full justify-center"
            >
              {ctaLabel}
            </ButtonLink>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * NavMenu
 * - Bravera-like hamburger that opens a right-side drawer
 * - Now slides in/out with backdrop fade before unmounting
 * - Focus trap, ESC, backdrop click, and scroll lock preserved
 * - Supports "scroll" mode (homepage) and "link" mode (inner pages)
 */
export default function NavMenu({
  items,
  className,
  logoSrc = "/media/logo-white.png",
  logoAlt = "CÉU Construction",
  ctaLabel = "Request a consultation",
  ctaTargetId = "contact",
  mode = "scroll",
  locale,
  showSocial = true,
}: NavMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cx("inline-flex items-center justify-center lg:hidden", className)}
      >
        <IoMenu className="h-10 w-10 text-white/60 mr-4 mb-2" />
      </button>

      {/* Drawer */}
      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        logoSrc={logoSrc}
        logoAlt={logoAlt}
        ctaLabel={ctaLabel}
        ctaTargetId={ctaTargetId}
        mode={mode}
        locale={locale}
        showSocial={showSocial}
      />
    </>
  );
}
