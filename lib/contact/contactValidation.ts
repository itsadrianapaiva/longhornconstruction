/**
 * Contact form validation module
 * Safe for both client and server imports
 */

export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  locale: string;
  honeypot?: string;
};

export type ContactValidationError = {
  field: "name" | "email" | "phone" | "message" | "honeypot";
  code: string;
};

export type ContactValidationResult =
  | { ok: true; value: ContactFormPayload }
  | { ok: false; errors: ContactValidationError[] };

/**
 * Basic email validation
 */
function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 100) return false;
  if (!trimmed.includes("@") || !trimmed.includes(".")) return false;

  // Basic structure check: should have chars before @, between @ and ., and after .
  const parts = trimmed.split("@");
  if (parts.length !== 2) return false;
  if (parts[0].length === 0) return false;

  const domainParts = parts[1].split(".");
  if (domainParts.length < 2) return false;
  if (domainParts.some(part => part.length === 0)) return false;

  return true;
}

/**
 * Phone validation: digits, spaces, parentheses, hyphen, plus
 */
function isValidPhone(phone: string): boolean {
  if (!phone) return true; // optional field

  const trimmed = phone.trim();
  if (trimmed.length === 0) return true;

  // Allow only: digits, spaces, parentheses, hyphen, plus
  if (!/^[\d\s()\-+]+$/.test(trimmed)) return false;

  // After stripping spaces, must be at least 7 chars
  const digitsOnly = trimmed.replace(/\s/g, "");
  if (digitsOnly.length < 7) return false;

  return true;
}

/**
 * Validates contact form payload
 */
export function validateContactPayload(input: unknown): ContactValidationResult {
  const errors: ContactValidationError[] = [];

  // Coerce input into working shape
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;

  // Extract and trim fields
  const name = String(raw.name ?? "").trim();
  const email = String(raw.email ?? "").trim();
  const phone = raw.phone ? String(raw.phone).trim() : undefined;
  const message = String(raw.message ?? "").trim();
  const locale = String(raw.locale ?? "en").trim() || "en";
  const honeypot = raw.honeypot ? String(raw.honeypot).trim() : undefined;

  // Validate name
  if (name.length < 2 || name.length > 80) {
    errors.push({ field: "name", code: "name_invalid" });
  }

  // Validate email
  if (!isValidEmail(email)) {
    errors.push({ field: "email", code: "email_invalid" });
  }

  // Validate phone (optional)
  if (phone && !isValidPhone(phone)) {
    errors.push({ field: "phone", code: "phone_invalid" });
  }

  // Validate message
  if (message.length < 20) {
    errors.push({ field: "message", code: "message_invalid" });
  }

  // Check honeypot
  if (honeypot && honeypot.length > 0) {
    errors.push({ field: "honeypot", code: "spam_detected" });
  }

  // Return result
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: { name, email, phone, message, locale, honeypot },
  };
}
