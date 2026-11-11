/**
 * route.ts
 *
 * Volunteer logout. Clears the volunteer session cookie.
 *
 * Author: Adrien Tabor and Nirvaan Govind
 * Date Created: 11/8/2026
 */

import { NextResponse } from "next/server";
import { clearVolunteerSession } from "@/lib/volunteer-session";

/**
 * POST /api/auth/volunteer/logout
 *
 * Logs the volunteer out by deleting the session cookie. Safe to call when
 * not logged in.
 *
 * Auth: public
 * Returns: 200 { ok: true }
 */
export async function POST() {
  await clearVolunteerSession();
  return NextResponse.json({ ok: true });
}
