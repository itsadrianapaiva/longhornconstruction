"use client";

import * as React from "react";
import { validateContactPayload } from "@/lib/contact/contactValidation";

export type UseContactFormOptions = {
  locale: string;
};

export type UseContactFormReturn = {
  values: {
    name: string;
    email: string;
    phone: string;
    message: string;
    honeypot: string;
  };
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setMessage: (value: string) => void;
  setHoneypot: (value: string) => void;
  status: "idle" | "submitting" | "success" | "error";
  fieldErrors: Partial<Record<"name" | "email" | "phone" | "message", string>>;
  genericError: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function useContactForm(options: UseContactFormOptions): UseContactFormReturn {
  const { locale } = options;

  // Form field state
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [honeypot, setHoneypot] = React.useState("");

  // UI state
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [fieldErrors, setFieldErrors] = React.useState<
    Partial<Record<"name" | "email" | "phone" | "message", string>>
  >({});
  const [genericError, setGenericError] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Reset errors
      setFieldErrors({});
      setGenericError(false);

      // Build payload
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        message: message.trim(),
        locale,
        honeypot: honeypot.trim() || undefined,
      };

      // Client-side validation using shared validator
      const validationResult = validateContactPayload(payload);

      if (!validationResult.ok) {
        // Map validation errors to fieldErrors (ignore honeypot on client)
        const errors: Partial<Record<"name" | "email" | "phone" | "message", string>> = {};

        for (const error of validationResult.errors) {
          if (error.field !== "honeypot") {
            errors[error.field as "name" | "email" | "phone" | "message"] = error.code;
          }
        }

        setFieldErrors(errors);
        setStatus("error");
        return;
      }

      // Submit to API
      setStatus("submitting");

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.status === 200 && data.ok === true) {
          // Success
          setFieldErrors({});
          setGenericError(false);
          setStatus("success");

          // Clear form fields
          setName("");
          setEmail("");
          setPhone("");
          setMessage("");
          setHoneypot("");
        } else if (res.status === 400 && data.fieldErrors) {
          // Validation errors from server
          setFieldErrors(data.fieldErrors);
          setStatus("error");
        } else {
          // Rate limit, server error, or other error
          setGenericError(true);
          setStatus("error");
        }
      } catch (error) {
        // Network error
        console.error("Contact form submission error:", error);
        setGenericError(true);
        setStatus("error");
      }
    },
    [name, email, phone, message, honeypot, locale]
  );

  return {
    values: { name, email, phone, message, honeypot },
    setName,
    setEmail,
    setPhone,
    setMessage,
    setHoneypot,
    status,
    fieldErrors,
    genericError,
    handleSubmit,
  };
}
