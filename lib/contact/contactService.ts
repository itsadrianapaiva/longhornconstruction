import "server-only";
import nodemailer from "nodemailer";
import type { ContactFormPayload } from "./contactValidation";

export type ContactContext = {
  ip?: string | null;
  userAgent?: string | null;
};

function buildEmailBody(
  payload: ContactFormPayload,
  context: ContactContext
): string {
  const lines = [
    "New Contact Request | Longhorn Construction",
    "=".repeat(50),
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "(not provided)"}`,
    "",
    "Message:",
    payload.message,
    "",
    "-".repeat(50),
    "",
    "Metadata:",
    `Locale: ${payload.locale}`,
    `Submitted (UTC): ${new Date().toISOString()}`,
  ];

  if (context.ip) {
    lines.push(`IP: ${context.ip}`);
  }

  if (context.userAgent) {
    lines.push(`User-Agent: ${context.userAgent}`);
  }

  return lines.join("\n");
}

export async function sendContactMessage(
  payload: ContactFormPayload,
  context: ContactContext = {}
): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "0");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO ?? user;

  if (!host || !port || !user || !pass || !to) {
    throw new Error("Contact email configuration is incomplete.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  const subject = `New contact request from ${payload.name} | Longhorn Construction`;
  const text = buildEmailBody(payload, context);
  const from = `"Longhorn Construction" <${user}>`;

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: payload.email,
      subject,
      text,
    });
  } catch (error) {
    console.error("Failed to send Longhorn contact email", error);
    throw new Error("Failed to send contact message.");
  }
}