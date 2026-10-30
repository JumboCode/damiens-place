/**
 * email-templates.ts
 *
 * Provides reusable email templates for application notifications.
 * All HTML content is escaped before being rendered.
 *
 * Author: Alex Li
 * Date Created: 10/26/2026
 */

export type RenderedEmail = {
  subject: string;
  text: string;
  html: string;
};

/**
 * Escapes special HTML characters to prevent user input from being
 * interpreted as HTML.
 *
 * @param value - The string to escape.
 * @returns The HTML-safe string.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Renders an email with a consistent HTML layout and plain-text version.
 *
 * @param subject - The email subject.
 * @param paragraphs - The email paragraphs, in order.
 * @returns The rendered email with subject, text, and HTML versions.
 */
export function renderEmail({
  subject,
  paragraphs,
}: {
  subject: string;
  paragraphs: string[];
}): RenderedEmail {
  const text = paragraphs.join("\n\n");

  const htmlParagraphs = paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

  const html = `<div style="font-family: Arial, sans-serif; max-width: 600px;">${htmlParagraphs}</div>`;

  return { subject, text, html };
}
/**
 * Creates an email confirming receipt of a volunteer application.
 *
 * @param firstName - The applicant's first name.
 * @returns The rendered application-received email.
 */
export function applicationReceivedEmail(firstName: string): RenderedEmail {
  const message =
    "Thank you for your interest in volunteering with Damien's Food Pantry! Our Volunteer Coordinator will reach out to you directly to schedule your 30-minute onboarding appointment. We look forward to welcoming you to our team!";

  return renderEmail({
    subject: "We received your volunteer application",
    paragraphs: [`Hi ${firstName},`, message],
  });
}

/**
 * Creates an email notifying an applicant that their application was approved.
 *
 * @param firstName - The applicant's first name.
 * @returns The rendered application-approved email.
 */
export function applicationApprovedEmail(firstName: string): RenderedEmail {
  const message =
    "Great news! Your volunteer application has been approved. Our Volunteer Coordinator will be in touch with next steps. We're so glad to have you on the team!";

  return renderEmail({
    subject: "Welcome to Damien's Food Pantry!",
    paragraphs: [`Hi ${firstName},`, message],
  });
}

/**
 * Creates an email notifying an applicant that their application was rejected.
 *
 * @param firstName - The applicant's first name.
 * @returns The rendered application-rejected email.
 */
export function applicationRejectedEmail(firstName: string): RenderedEmail {
  const message =
    "Thank you for your interest in volunteering with Damien's Food Pantry. After reviewing your application, we are unable to offer you a volunteer position at this time. We appreciate your willingness to help our community.";

  return renderEmail({
    subject: "Your volunteer application",
    paragraphs: [`Hi ${firstName},`, message],
  });
}
