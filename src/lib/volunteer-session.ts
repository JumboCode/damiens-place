/**
 * volunteer-session.ts
 *
 * Creates, reads, and clears the volunteer session cookie. The cookie holds a
 * signed JWT (HS256, signed with VOLUNTEER_SESSION_SECRET via jose) whose only
 * claim is the volunteer's id, so it can't be edited or forged. It is httpOnly
 * and lasts 7 days. Checking the database is left to requireVolunteer().
 *
 * Author: Adrien Tabor and Nirvaan Govind
 * Date Created: 11/8/2026
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const VOLUNTEER_SESSION_COOKIE = "volunteer_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * getSecretKey
 *
 * Reads VOLUNTEER_SESSION_SECRET and encodes it as bytes for jose.
 *
 * @returns the secret as a Uint8Array
 * @throws Error if VOLUNTEER_SESSION_SECRET is missing or empty
 */
function getSecretKey(): Uint8Array {
  const secret = process.env.VOLUNTEER_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "VOLUNTEER_SESSION_SECRET is not set. Copy it from Dev Resources into your .env.",
    );
  }
  return new TextEncoder().encode(secret);
}

/**
 * createVolunteerSession
 *
 * Signs a 7-day token holding { volunteerId } and sets it as the session
 * cookie (httpOnly, secure in production only, sameSite lax).
 *
 * @param volunteerId - id of the volunteer who just logged in
 * @returns nothing; sets the cookie on the outgoing response
 * @throws Error if VOLUNTEER_SESSION_SECRET is missing
 */
export async function createVolunteerSession(
  volunteerId: string,
): Promise<void> {
  const token = await new SignJWT({ volunteerId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(VOLUNTEER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

/**
 * getVolunteerSessionId
 *
 * Reads the session cookie and verifies its signature and expiry. Only checks
 * the token, not the database.
 *
 * @returns the volunteer id in the token, or null if the cookie is missing,
 *          tampered with, malformed, or expired
 * @throws Error if VOLUNTEER_SESSION_SECRET is missing
 */
export async function getVolunteerSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(VOLUNTEER_SESSION_COOKIE)?.value;
  if (!token) return null;

  // Read the key outside the try so a missing secret is a loud error, not a
  // silent logout
  const key = getSecretKey();

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return typeof payload.volunteerId === "string" ? payload.volunteerId : null;
  } catch {
    return null;
  }
}

/**
 * clearVolunteerSession
 *
 * Deletes the session cookie, logging the volunteer out.
 *
 * @returns nothing; removes the cookie on the outgoing response
 */
export async function clearVolunteerSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(VOLUNTEER_SESSION_COOKIE);
}
