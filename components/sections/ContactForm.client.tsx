"use client";

import * as React from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

/** i18n field types */
type FieldDef = string | { label?: string; placeholder?: string };

/** Helpers to read either string or {label, placeholder} */
function labelOf(v: FieldDef | undefined, fallback: string) {
  if (!v) return fallback;
  return typeof v === "string" ? v : v.label ?? fallback;
}
function placeholderOf(v: FieldDef | undefined, fallback: string) {
  if (!v) return fallback;
  return typeof v === "string" ? fallback : v.placeholder ?? fallback;
}

/** Soft validation (message has **no** validation per your request) */
function validate(fields: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const errs: Partial<Record<keyof typeof fields, boolean>> = {};
  if (fields.name.trim().length < 2) errs.name = true;
  if (!/^\S+@\S+\.\S+$/.test(fields.email.trim())) errs.email = true;
  if (fields.phone.trim() && fields.phone.replace(/\D/g, "").length < 6)
    errs.phone = true;
  // no message validation
  return errs;
}

/** Mailto composer */
function buildMailto({
  to,
  name,
  email,
  phone,
  message,
  locale,
}: {
  to: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  locale: "en" | "pt";
}) {
  const subject = `[CEU] Contact — ${name || "Prospect"}`;
  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "(not provided)"}`,
    "",
    "Message:",
    message || "(empty)",
    "",
    `Locale: ${locale}`,
    `Source URL: ${typeof window !== "undefined" ? window.location.href : ""}`,
  ].join("\n");

  return (
    `mailto:${encodeURIComponent(to)}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(lines)}`
  );
}

/** Contact form */
export default function ContactFormClient({
  to = "info@ceuconstruction.com",
}: {
  to?: string;
}) {
  const { locale, t } = useI18n();

  // Read i18n once (supports string or {label, placeholder})
  const f = t<{
    name?: FieldDef;
    email?: FieldDef;
    phone?: FieldDef;
    message?: FieldDef;
    honeypot?: FieldDef;
    submit?: string;
    success?: string;
    error?: string;
  }>("contact.form", {});

  const copy = {
    name: {
      label: labelOf(f.name, "Full name"),
      placeholder: placeholderOf(f.name, "Your full name"),
    },
    email: {
      label: labelOf(f.email, "Email"),
      placeholder: placeholderOf(f.email, "you@example.com"),
    },
    phone: {
      label: labelOf(f.phone, "Phone"),
      placeholder: placeholderOf(f.phone, "+351 ___ ___ ___"),
    },
    message: {
      label: labelOf(f.message, "Project details"),
      placeholder: placeholderOf(f.message, "Scope, location, timeline…"),
    },
    honeypotLabel: labelOf(f.honeypot, "Leave this field empty"),
    submit: f.submit ?? "Send message",
    success:
      f.success ?? "Thanks. Your email client will open with a draft to send.",
    error: f.error ?? "Please fix the fields highlighted.",
  };

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [honey, setHoney] = React.useState(""); // hidden
  const [submitting, setSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "ok" | "err">("idle");
  const [errors, setErrors] = React.useState<{
    name?: boolean;
    email?: boolean;
    phone?: boolean;
  }>({});

  // One-place field styling (darker base, darker-on-focus via CEU tokens)
  const fieldClass = (hasError?: boolean) =>
    [
      "mt-1 w-full rounded-md px-3 py-2 text-ink outline-none transition",
      "bg-[color-mix(in_srgb,var(--page-ink)_10%,transparent)]",
      "border border-ink/20 focus:border-ink/30 focus:ring-1 focus:ring-ink/20",
      "focus:bg-[color-mix(in_srgb,var(--page-ink)_14%,transparent)]",
      hasError ? "!border-red-500" : "",
    ].join(" ");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honey.trim()) return; // honeypot

    const errs = validate({ name, email, phone, message });
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus("err");
      return;
    }

    try {
      setSubmitting(true);
      const href = buildMailto({
        to,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        locale,
      });
      window.location.href = href;
      setStatus("ok");
    } catch {
      setStatus("err");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-4">
      {/* Honeypot (hidden) */}
      <label className="sr-only" aria-hidden="true">
        {copy.honeypotLabel}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
        />
      </label>

      {/* Name */}
      <div>
        <label className="block text-sm text-ink/80">{copy.name.label}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={copy.name.placeholder}
          className={fieldClass(errors.name)}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm text-ink/80">{copy.email.label}</label>
        <input
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={copy.email.placeholder}
          className={fieldClass(errors.email)}
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm text-ink/80">{copy.phone.label}</label>
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={copy.phone.placeholder}
          className={fieldClass(errors.phone)}
        />
      </div>

      {/* Message (no validation) */}
      <div>
        <label className="block text-sm text-ink/80">
          {copy.message.label}
        </label>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={copy.message.placeholder}
          className={fieldClass()}
        />
      </div>

      {/* Submit + status */}
      <div className="mt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-full px-4 py-2 text-white transition
                     focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40 disabled:opacity-60
                     bg-[var(--brand)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
        >
          {copy.submit}
        </button>

        {status === "ok" ? (
          <span className="text-sm text-emerald-600">{copy.success}</span>
        ) : status === "err" ? (
          <span className="text-sm text-red-600">{copy.error}</span>
        ) : null}
      </div>
    </form>
  );
}
