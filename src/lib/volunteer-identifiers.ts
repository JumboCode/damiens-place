/**
 * volunteer-identifiers.ts
 *
 * This file normalizes inputs (email and phone numbers).
 * For emails: removes extra spaces and make it all lowercase
 * For phone numbers: keep only the numbers, and drop a 1 country code at the front
 *
 * Author: Adrien and Elijah
 * Date Created: 10/12/2026
 */

/**
 * normalizeEmail
 *
 * This function takes in an email and returns the
 * email with no empty spaces on the ends and all lower case, so emails can
 * be more easily used as data.
 *
 * @param input - a string that represents email
 * @returns the normalized email
 */
export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

/**
 * normalizeCellPhone
 *
 * This function takes in a phone number and returns the
 * phone number without the country code or parantheses/dashes, so phone numbers can
 * be more easily used as data.
 *
 * @param input - a string that represents a phone number
 * @returns the normalized phone number
 */
export function normalizeCellPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.at(0) === "1") {
    return digits.slice(1);
  }
  return digits;
}
