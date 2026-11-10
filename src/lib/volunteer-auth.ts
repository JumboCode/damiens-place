/**
 * volunteer-auth.ts
 *
 * Checks whether the current request belongs to an active volunteer
 *
 * Authors: Nirvaan Govind and Adrien Tabor
 * Date: Nov 9 2026
 */

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getVolunteerSessionId } from "@/lib/volunteer-session";

/**
 * requireVolunteer()
 *
 * ensures that the request has a valid volunteer session
 *
 * @returns A 401 error *if* the volunteer session is inaccessible for some reason
 *          OR the volunteer doesn't exist anymore
 * @returns A 403 error *if* the volunteer is inactive
 * @returns The active volunteer ID if the 2 checks above pass
 */
export async function requireVolunteer(): Promise<
  { volunteerId: string } | { response: NextResponse }
> {
  // get the volunteer ID from the session cookie
  const volunteerId = await getVolunteerSessionId();
  let volunteer = null;

  // look up the volunteer thru Prisma
  if (volunteerId) {
    volunteer = await prisma.volunteer.findUnique({
      where: { id: volunteerId },
      select: { id: true, status: true },
    });
  }

  // return a 401 if: there's no matching session OR there's no matching volunteer
  if (!volunteer) {
    return {
      response: NextResponse.json(
        { error: "User not signed in." },
        { status: 401 },
      ),
    };
  }

  // return a 403 if the volunteer is inactive
  if (volunteer.status !== "ACTIVE") {
    return {
      response: NextResponse.json(
        { error: "User unauthorized." },
        { status: 403 },
      ),
    };
  }

  // otherwise if all's good, return {volunteerId}
  return { volunteerId: volunteer.id };
}
