"use client";

/**
 * ContactForm — validated contact form with polished styling and scroll entrance.
 */

import { FormEvent, useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, CheckCircle, Loader2, Send } from "lucide-react";
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
import { fadeUpVariants, sectionViewport } from "@/lib/motion";

const initialFormData: ContactFormData = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

async function handleContactSubmit(data: ContactFormData): Promise<void> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to send message");
  }
}

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/20";

export default function ContactForm() {
  const reduced = useReducedMotion();
  const item = fadeUpVariants(reduced);

  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ContactFormData, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: getFieldError(field, value) ?? undefined,
      }));
    }
  };

  const handleBlur = (field: keyof ContactFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: getFieldError(field, formData[field]) ?? undefined,
    }));
  };

  function getFieldError(
    field: keyof ContactFormData,
    value: string
  ): string | null {
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
      setSubmitError(null);

      try {
        await handleContactSubmit(formData);
        setShowSuccess(true);
        setFormData(initialFormData);
        setTouched({});
        setErrors({});
        setTimeout(() => setShowSuccess(false), 5000);
      } catch (error) {
        console.error("Contact form submission failed:", error);
        setSubmitError(
          error instanceof Error ? error.message : "Something went wrong."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  const messageLength = formData.message.length;

  return (
    <section
      id="contact"
      className="section-padding scroll-mt-24 border-t border-white/5"
    >
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={item}
          className="mb-10 text-center sm:text-left"
        >
          <h2 className="section-underline font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Contact
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
            Have a question or want to collaborate? Send me a message.
          </p>
        </motion.div>

        {showSuccess && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            aria-live="polite"
            className="mb-6 flex items-center gap-3 rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-3 text-sm text-accent-cyan"
          >
            <CheckCircle size={20} aria-hidden="true" />
            Message sent successfully! I&apos;ll get back to you soon.
          </motion.div>
        )}

        {submitError && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            <AlertCircle size={20} aria-hidden="true" />
            {submitError}
          </motion.div>
        )}

        <motion.form
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={item}
          onSubmit={handleSubmit}
          noValidate
          className="rounded-xl border border-white/10 bg-surface p-6 shadow-glow sm:p-8"
        >
          <div className="mb-5">
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
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
              className={inputClassName}
              placeholder="Your full name"
            />
            {errors.fullName && (
              <p
                id="fullName-error"
                className="mt-1.5 text-sm text-red-400"
                role="alert"
              >
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
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
              className={inputClassName}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-1.5 text-sm text-red-400"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="subject"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
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
              className={inputClassName}
              placeholder="What's this about?"
            />
            {errors.subject && (
              <p
                id="subject-error"
                className="mt-1.5 text-sm text-red-400"
                role="alert"
              >
                {errors.subject}
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="message"
                className="text-sm font-medium text-zinc-300"
              >
                Message <span className="text-accent-purple">*</span>
              </label>
              <span
                className={`text-xs ${
                  messageLength > MESSAGE_MAX_LENGTH
                    ? "text-red-400"
                    : "text-zinc-500"
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
              className={`${inputClassName} resize-y`}
              placeholder="Tell me about your project or inquiry..."
            />
            {errors.message && (
              <p
                id="message-error"
                className="mt-1.5 text-sm text-red-400"
                role="alert"
              >
                {errors.message}
              </p>
            )}
          </div>

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
