"use client";

import * as React from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useContactForm } from "@/components/hooks/useContactForm";

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

/** Map error codes to i18n keys */
function getFieldErrorMessage(
  code: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any
): string {
  const key = `contact.validate.${code.replace("_invalid", "")}`;
  return t(key, code);
}

/** Contact form */
export default function ContactFormClient() {
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
    serverError?: string;
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
    success: f.success ?? "Thank you. Your message has been sent.",
    error: f.error ?? "Please fix the fields highlighted.",
    serverError: f.serverError ?? "Something went wrong. Please try again.",
  };

  // Use the contact form hook
  const {
    values,
    setName,
    setEmail,
    setPhone,
    setMessage,
    setHoneypot,
    status,
    fieldErrors,
    genericError,
    handleSubmit,
  } = useContactForm({ locale });

  // One-place field styling (darker base, darker-on-focus via CEU tokens)
  const fieldClass = (hasError?: boolean) =>
    [
      "mt-1 w-full rounded-md px-3 py-2 text-ink outline-none transition",
      "bg-[color-mix(in_srgb,var(--page-ink)_10%,transparent)]",
      "border border-ink/20 focus:border-ink/30 focus:ring-1 focus:ring-ink/20",
      "focus:bg-[color-mix(in_srgb,var(--page-ink)_14%,transparent)]",
      hasError ? "!border-red-500" : "",
    ].join(" ");

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
      {/* Honeypot (hidden) */}
      <label className="sr-only" aria-hidden="true">
        {copy.honeypotLabel}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          value={values.honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </label>

      {/* Name */}
      <div>
        <label className="block text-sm text-ink/80">{copy.name.label}</label>
        <input
          type="text"
          value={values.name}
          onChange={(e) => setName(e.target.value)}
          placeholder={copy.name.placeholder}
          className={fieldClass(!!fieldErrors.name)}
        />
        {fieldErrors.name && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldErrorMessage(fieldErrors.name, t)}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm text-ink/80">{copy.email.label}</label>
        <input
          type="email"
          inputMode="email"
          value={values.email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={copy.email.placeholder}
          className={fieldClass(!!fieldErrors.email)}
        />
        {fieldErrors.email && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldErrorMessage(fieldErrors.email, t)}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm text-ink/80">{copy.phone.label}</label>
        <input
          type="tel"
          inputMode="tel"
          value={values.phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={copy.phone.placeholder}
          className={fieldClass(!!fieldErrors.phone)}
        />
        {fieldErrors.phone && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldErrorMessage(fieldErrors.phone, t)}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm text-ink/80">
          {copy.message.label}
        </label>
        <textarea
          rows={5}
          value={values.message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={copy.message.placeholder}
          className={fieldClass(!!fieldErrors.message)}
        />
        {fieldErrors.message && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldErrorMessage(fieldErrors.message, t)}
          </p>
        )}
      </div>

      {/* Submit + status */}
      <div className="mt-2 flex flex-col gap-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center rounded-full px-4 py-2 text-white transition
                     focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40 disabled:opacity-60
                     bg-[var(--brand)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
        >
          {status === "submitting" ? "Sending..." : copy.submit}
        </button>

        {status === "success" && (
          <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
            {copy.success}
          </div>
        )}

        {genericError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {copy.serverError}
          </div>
        )}
      </div>
    </form>
  );
}
