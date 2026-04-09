import "server-only";
import nodemailer from "nodemailer";
import type { ContactFormPayload } from "./contactValidation";

export type ContactContext = {
  ip?: string | null;
  userAgent?: string | null;
};

/**
 * Builds the email text body
 */
function buildEmailBody(payload: ContactFormPayload, context: ContactContext): string {
  const lines = [
    "New Contact Request – Longhorn Construction",
    "=" .repeat(50),
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "(not provided)"}`,
    "",
    "Message:",
    payload.message,
    "",
    "—".repeat(50),
    "",
    "Metadata:",
    `Locale: ${payload.locale}`,
    `Submitted: ${new Date().toISOString()}`,
  ];

  if (context.ip) {
    lines.push(`IP: ${context.ip}`);
  }

  if (context.userAgent) {
    lines.push(`User-Agent: ${context.userAgent}`);
  }

  return lines.join("\n");
}

/**
 * Sends contact message via LGH SMTP server
 */
export async function sendContactMessage(
  payload: ContactFormPayload,
  context: ContactContext = {}
): Promise<void> {
  // Read environment variables
  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO ?? user;

  // Validate configuration
  const port = Number(portRaw ?? "0");
  if (!host || port === 0 || !user || !pass || !to) {
    throw new Error("Longhorn contact email environment variables are not correctly configured.");
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false, // TLS with STARTTLS on port 587
    auth: { user, pass },
  });

  // Build email content
  const subject = `New contact request from ${payload.name} – Longhorn Construction`;
  const textBody = buildEmailBody(payload, context);
  const from = `"Longhorn Construction" <${user}>`;

  // Send email
  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: payload.email,
      subject,
      text: textBody,
    });
  } catch (error) {
    console.error("Failed to send Longhorn contact email", error);
    throw error;
  }
}
