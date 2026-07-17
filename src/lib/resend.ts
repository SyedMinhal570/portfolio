import { Resend } from "resend";

interface ContactAlertParams {
  name: string;
  email: string;
  subject: string | null;
  message: string;
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set. Cannot send contact alert.");
    return null;
  }
  return new Resend(apiKey);
}

export async function sendContactAlertEmail(contact: ContactAlertParams) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.error("ADMIN_EMAIL is not set. Cannot send contact alert.");
      return;
    }

    const resend = getResendClient();
    if (!resend) return;

    const emailSubject = `New Contact Form Submission${
      contact.subject ? ": " + contact.subject : ""
    }`;

    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333; margin-top: 0;">New Contact Form Submission</h2>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>Name:</strong> ${contact.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
          ${contact.subject ? `<p style="margin: 5px 0;"><strong>Subject:</strong> ${contact.subject}</p>` : ""}
        </div>
        <h3 style="color: #444; margin-bottom: 10px;">Message:</h3>
        <div style="white-space: pre-wrap; color: #555; background-color: #f9f9f9; padding: 15px; border-radius: 6px;">
          ${contact.message}
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: adminEmail,
      subject: emailSubject,
      html: htmlBody,
    });

    if (error) {
      console.error("Resend API returned an error:", error);
    } else {
      console.log("Contact alert email sent successfully:", data);
    }
  } catch (err) {
    console.error("Failed to send contact alert email:", err);
  }
}
