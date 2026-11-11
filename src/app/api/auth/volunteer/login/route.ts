/**
 * route.ts
 *
 * helps to sign in an active volunteer using their email and phone number
 *
 * Authors: Nirvaan Govind and Adrien Tabor
 * Date: Nov 9 2026
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  normalizeCellPhone,
  normalizeEmail,
} from "@/lib/volunteer-identifiers";
import { createVolunteerSession } from "@/lib/volunteer-session";

/**
 * @returns a 400 *if* the API request's body isn't valid JSON
 * @returns a 400 *if* the API request's body isn't a JSON object
 * @returns a 400 *if* the email and cellPhone fields in the requests aren't both non-empty strings
 * @returns a 401 *if* the credentials don't match an active volunteer
 * @returns *else*, the expected API response and a successful 200
 */
export async function POST(request: Request) {
  let body: unknown;

  // returning a 400 if the body isn't JSON
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  // return a 400 if the body isn't even a JSON object
  if (body === null || typeof body !== "object") {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  const { email, cellPhone } = body as {
    email?: unknown;
    cellPhone?: unknown;
  };

  // return a 400 if email and cellPhone aren't both non-empty strings
  if (
    typeof email !== "string" ||
    email.trim() === "" ||
    typeof cellPhone !== "string" ||
    cellPhone.trim() === ""
  ) {
    return NextResponse.json(
      { error: "Email and cell phone must be non-empty strings." },
      { status: 400 },
    );
  }

  // retrieving the specific volunteer thru prisma
  const volunteer = await prisma.volunteer.findUnique({
    where: {
      email_cellPhone: {
        email: normalizeEmail(email),
        cellPhone: normalizeCellPhone(cellPhone),
      },
    },
    select: { id: true, firstName: true, status: true },
  });

  // return a 401 if volunteer either doesn't exist or isn't active
  if (!volunteer || volunteer.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "Invalid email or cell phone" },
      { status: 401 },
    );
  }

  // creating the session
  await createVolunteerSession(volunteer.id);

  // return a 200
  return NextResponse.json(
    {
      volunteer: {
        id: volunteer.id,
        firstName: volunteer.firstName,
      },
    },
    { status: 200 },
  );
}
