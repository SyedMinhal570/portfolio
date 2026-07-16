"use client";

/**
 * ContactForm — client-side validated contact form (frontend only for Task 1/2).
 *
 * Validation runs on blur AND on submit attempt for inline error feedback.
 * The actual API/database call will be added in Task 4 inside `handleContactSubmit`.
 */

import { FormEvent, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Send } from "lucide-react";
import {
  ContactFormData,
  ContactFormErrors,
  MESSAGE_MAX_LENGTH,
  validateContactForm,
  validateEmail,
  validateFullName,
  validateMessage,
  validateSubject,
} from "@/lib/validation";

/** Initial empty form state */
const initialFormData: ContactFormData = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

/**
 * ============================================================
 * handleContactSubmit — DROP-IN POINT FOR TASK 4 API INTEGRATION
 * ============================================================
 * Replace the simulated delay + console.log below with a real
 * fetch() call to your /api/contact route once the backend is ready.
 *
 * Example (Task 4):
 *   const response = await fetch("/api/contact", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(data),
 *   });
 *   if (!response.ok) throw new Error("Failed to send message");
 */
async function handleContactSubmit(data: ContactFormData): Promise<void> {
  // Simulated network delay — remove when wiring to real API
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Temporary: log form payload until Task 4 backend is connected
  console.log("Contact form submitted:", data);
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /** Update a single field and re-validate if the field was already touched */
  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: getFieldError(field, value) ?? undefined,
      }));
    }
  };

  /** Mark field as touched and validate on blur */
  const handleBlur = (field: keyof ContactFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: getFieldError(field, formData[field]) ?? undefined,
    }));
  };

  /** Run the correct validator for a single field */
  function getFieldError(field: keyof ContactFormData, value: string): string | null {
    switch (field) {
      case "fullName":
        return validateFullName(value);
      case "email":
        return validateEmail(value);
      case "subject":
        return validateSubject(value);
      case "message":
        return validateMessage(value);
      default:
        return null;
    }
  }

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Mark all fields touched so every error shows on submit attempt
      setTouched({
        fullName: true,
        email: true,
        subject: true,
        message: true,
      });

      const validationErrors = validateContactForm(formData);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) return;

      setIsSubmitting(true);
      setShowSuccess(false);

      try {
        await handleContactSubmit(formData);
        setShowSuccess(true);
        setFormData(initialFormData);
        setTouched({});
        setErrors({});

        // Auto-hide success toast after 5 seconds
        setTimeout(() => setShowSuccess(false), 5000);
      } catch (error) {
        console.error("Contact form submission failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  const messageLength = formData.message.length;

  return (
    <section id="contact" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center sm:text-left"
        >
          <h2 className="section-underline font-heading text-3xl font-bold text-white sm:text-4xl">
            Contact
          </h2>
          <p className="mt-4 text-zinc-400">
            Have a question or want to collaborate? Send me a message.
          </p>
        </motion.div>

        {/* Success toast — shown after simulated submit */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            aria-live="polite"
            className="mb-6 flex items-center gap-3 rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-3 text-sm text-accent-cyan"
          >
            <CheckCircle size={20} aria-hidden="true" />
            Message sent successfully! (Demo mode — check console for payload.)
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          noValidate
          className="rounded-xl border border-white/10 bg-surface p-6 sm:p-8 shadow-glow"
        >
          {/* Full Name */}
          <div className="mb-5">
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-zinc-300">
              Full Name <span className="text-accent-purple">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/20"
              placeholder="Your full name"
            />
            {errors.fullName && (
              <p id="fullName-error" className="mt-1.5 text-sm text-red-400" role="alert">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-5">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
              Email <span className="text-accent-purple">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/20"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-sm text-red-400" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Subject (optional) */}
          <div className="mb-5">
            <label htmlFor="subject" className="mb-2 block text-sm font-medium text-zinc-300">
              Subject <span className="text-zinc-500">(optional)</span>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              onBlur={() => handleBlur("subject")}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "subject-error" : undefined}
              className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/20"
              placeholder="What's this about?"
            />
            {errors.subject && (
              <p id="subject-error" className="mt-1.5 text-sm text-red-400" role="alert">
                {errors.subject}
              </p>
            )}
          </div>

          {/* Message with character counter */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="message" className="text-sm font-medium text-zinc-300">
                Message <span className="text-accent-purple">*</span>
              </label>
              <span
                className={`text-xs ${
                  messageLength > MESSAGE_MAX_LENGTH ? "text-red-400" : "text-zinc-500"
                }`}
                aria-live="polite"
              >
                {messageLength}/{MESSAGE_MAX_LENGTH}
              </span>
            </div>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              onBlur={() => handleBlur("message")}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className="w-full resize-y rounded-xl border border-white/10 bg-background px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/20"
              placeholder="Tell me about your project or inquiry..."
            />
            {errors.message && (
              <p id="message-error" className="mt-1.5 text-sm text-red-400" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit button with loading spinner */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-accent px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-glow-hover hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                Sending...
              </>
            ) : (
              <>
                <Send size={18} aria-hidden="true" />
                Send Message
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
