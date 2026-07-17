import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateContactForm, ContactFormData } from "@/lib/validation";
import { sendContactAlertEmail } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json();

    // Server-side validation reusing the shared logic
    const errors = validateContactForm(body);
    if (Object.keys(errors).length > 0) {
      // Find the first error message to return
      const firstError = Object.values(errors).find((msg) => msg !== undefined);
      return NextResponse.json(
        { error: firstError || "Validation failed" },
        { status: 400 }
      );
    }

    // Insert into Supabase via Prisma
    const contact = await prisma.contact.create({
      data: {
        name: body.fullName,
        email: body.email,
        subject: body.subject || null,
        message: body.message,
      },
    });

    // Fire and forget the email alert (don't await it so we don't block the response)
    sendContactAlertEmail({
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("API Error (/api/contact):", error);
    // Don't leak database errors to the client
    return NextResponse.json(
      { error: "An unexpected error occurred while saving your message. Please try again later." },
      { status: 500 }
    );
  }
}
