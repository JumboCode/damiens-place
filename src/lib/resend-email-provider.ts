/**
 * resend-email-provider.ts
 *
 * Sends emails through Resend, our email service. It's an EmailProvider, so
 * sendEmail can use it in place of consoleEmailProvider without any other change.
 *
 * Author: Natalie Phua
 * Date Created: 10/30/2026
 */

import { Resend } from "resend";
import type { EmailProvider } from "./email";

/**
 * resendEmailProvider
 *
 * Delivers one email through Resend. The API key and the "from" address come from the
 * RESEND_API_KEY and EMAIL_FROM environment variables.
 *
 * @param message - the EmailMessage containing the recipient, subject, text, and optional html
 * @returns nothing when Resend accepts the email
 * @throws if either environment variable is missing, or if Resend rejects the email
 */
export const resendEmailProvider: EmailProvider = async (message) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    throw new Error(
      "Email is not configured: set RESEND_API_KEY and EMAIL_FROM",
    );
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });

  // Resend reports problems in `error` instead of throwing, but a provider has to throw
  // so sendEmail can turn the failure into { ok: false }
  if (error) {
    throw new Error(error.message);
  }
};
