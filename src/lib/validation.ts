/**
 * Reusable contact form validation helpers.
 * Each function returns an error string or null (valid).
 * Used by ContactForm on blur and on submit for inline feedback.
 */

export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

/** Full Name: required, minimum 2 characters */
export function validateFullName(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Full name is required.";
  if (trimmed.length < 2) return "Name must be at least 2 characters.";
  return null;
}

/** Email: required, must match standard email pattern */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Email is required.";
  if (!EMAIL_REGEX.test(trimmed)) return "Please enter a valid email address.";
  return null;
}

/** Subject: optional, max 100 characters */
export function validateSubject(value: string): string | null {
  if (value.length > 100) return "Subject must be 100 characters or fewer.";
  return null;
}

/** Message: required, 10–1000 characters */
export const MESSAGE_MAX_LENGTH = 1000;
export const MESSAGE_MIN_LENGTH = 10;

export function validateMessage(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Message is required.";
  if (trimmed.length < MESSAGE_MIN_LENGTH) {
    return `Message must be at least ${MESSAGE_MIN_LENGTH} characters.`;
  }
  if (trimmed.length > MESSAGE_MAX_LENGTH) {
    return `Message must be ${MESSAGE_MAX_LENGTH} characters or fewer.`;
  }
  return null;
}

/** Run all field validators — returns an object of field errors (empty = valid) */
export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  const fullNameError = validateFullName(data.fullName);
  if (fullNameError) errors.fullName = fullNameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const subjectError = validateSubject(data.subject);
  if (subjectError) errors.subject = subjectError;

  const messageError = validateMessage(data.message);
  if (messageError) errors.message = messageError;

  return errors;
}

/** True when validateContactForm returns no errors */
export function isContactFormValid(data: ContactFormData): boolean {
  return Object.keys(validateContactForm(data)).length === 0;
}
