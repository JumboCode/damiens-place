/**
 * email.ts
 *
 * Helpers for sending emails. Validates emails and handles delivery errors
 *
 * By Nirvaan Govind and Alex Li
 * Date Created: 10/22/2026
 */

import { resendEmailProvider } from "./resend-email-provider";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string; // the plain-text version
  html?: string; // the fancier version (optional)
};

// A provider delivers one message. It throws if delivery fails.
export type EmailProvider = (message: EmailMessage) => Promise<void>;

export type SendEmailResult = { ok: true } | { ok: false; error: string };

/**
 * consoleEmailProvider
 *
 * For now, this just prints an email's recipient, subject, and text in the terminal
 *
 * @param message - the EmailMessage containing the recipient, subject, and text of an email
 * @returns nothing, just prints the recipient/subject/text
 */
// Prints the email in the terminal instead of sending it, so we can build and test without an email account.
export const consoleEmailProvider: EmailProvider = async (message) => {
  console.log(message.to);
  console.log(message.subject);
  console.log(message.text);
};

/**
 * getDefaultProvider
 *
 * Picks how emails are delivered when sendEmail isn't given a provider. Resend is used when
 * RESEND_API_KEY is set (production, or Natalie's machine). Everyone else prints to the terminal,
 * so nobody needs an email account to build and test.
 *
 * @returns resendEmailProvider if RESEND_API_KEY is set, otherwise consoleEmailProvider
 */
function getDefaultProvider(): EmailProvider {
  const useResend =
    process.env.RESEND_API_KEY && process.env.NODE_ENV !== "test";
  return useResend ? resendEmailProvider : consoleEmailProvider;
}

/**
 * sendEmail
 *
 * validates and sends an email, and never throws anything.
 *
 * @param message - the email to send
 * @param provider -  the function used to send the email
 * @returns {ok: false, error:...} if invalid recipient/subject/text respectively
 * @returns {ok: true} on success and {ok: false, error:...} if provider throws
 */
export async function sendEmail(
  message: EmailMessage,
  provider: EmailProvider = getDefaultProvider(),
): Promise<SendEmailResult> {
  // recipient email address should be valid
  const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // picked this up from applicant-validation.ts
  if (!emailFormat.test(message.to)) {
    return { ok: false, error: "invalid email" };
  }

  // email subject should not be empty
  const emailSubject = message.subject.trim();
  if (emailSubject === "") {
    return { ok: false, error: "empty email subject" };
  }

  // email text should not be empty
  const emailText = message.text.trim();
  if (emailText === "") {
    return { ok: false, error: "empty email text" };
  }

  // try-catch block to call the provider
  try {
    await provider(message);
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    } else {
      return { ok: false, error: "email delivery failed" };
    }
  }
}
