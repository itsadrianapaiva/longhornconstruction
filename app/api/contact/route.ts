import { NextResponse } from "next/server";
import { validateContactPayload } from "@/lib/contact/contactValidation";
import { sendContactMessage } from "@/lib/contact/contactService";

export async function POST(request: Request): Promise<Response | NextResponse> {
  try {
    // Parse request body
    const body = await request.json();

    // Validate payload
    const result = validateContactPayload(body);

    if (!result.ok) {
      // Check if honeypot was triggered
      const hasHoneypot = result.errors.some(
        (err) => err.field === "honeypot" && err.code === "spam_detected"
      );

      if (hasHoneypot) {
        // Return success to honeypot spammers without sending email
        return NextResponse.json({ ok: true }, { status: 200 });
      }

      // Build field errors for real validation failures
      const fieldErrors: Record<string, string> = {};
      for (const error of result.errors) {
        fieldErrors[error.field] = error.code;
      }

      return NextResponse.json(
        { ok: false, fieldErrors },
        { status: 400 }
      );
    }

    // Extract context
    const ip = request.headers.get("x-forwarded-for") ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;

    // Send email
    await sendContactMessage(result.value, { ip, userAgent });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { ok: false, error: "serverError" },
      { status: 500 }
    );
  }
}
