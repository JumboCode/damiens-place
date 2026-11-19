/**
 * route.ts
 *
 * POST endpoint for creating a volunteer's logged hours entry
 *
 * Authors: Nirvaan Govind and Adrien Tabor
 */

import { NextResponse } from "next/server";
import { HOUR_LOG_SELECT, validateHourLogFields } from "@/lib/hour-log";
import { prisma } from "@/lib/prisma";
import { requireVolunteer } from "@/lib/volunteer-auth";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * @param request - incoming request with date, startTime, endTime,
 *   positionId, and optional notes
 * @param params - volunteer ID from the request
 * @returns 201 with { hourLog } holding the new entry
 * @returns 400 if the JSON or shift details are invalid, or the position doesn't exist
 * @returns 401 if there is no valid volunteer session
 * @returns 403 if the volunteer is inactive or the URL ID belongs to another volunteer
 * @returns 404 if the volunteer in the URL doesn't exist
 */
export async function POST(request: Request, { params }: RouteContext) {
  // Require a signed-in, active volunteer.
  const session = await requireVolunteer();
  if ("response" in session) return session.response;

  const { id } = await params;

  const volunteer = await prisma.volunteer.findUnique({
    where: { id },
    select: { id: true },
  });

  // Return 404 if the volunteer does not exist.
  if (!volunteer) {
    return NextResponse.json({ error: "Volunteer not found" }, { status: 404 });
  }

  // Check that the session id = the volunteer id
  if (session.volunteerId !== id) {
    return NextResponse.json({ error: "User unauthorized." }, { status: 403 });
  }

  // Read the request body and return 400 for invalid JSON.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  // Validate the fields and return 400 with the validator's message on error.
  const result = validateHourLogFields(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { data } = result;

  // Return 400 if the selected position does not exist.
  const position = await prisma.position.findUnique({
    where: { id: data.positionId },
    select: { id: true },
  });
  if (!position) {
    return NextResponse.json(
      { error: "positionId does not match an existing position" },
      { status: 400 },
    );
  }
  // Create the hour log and select the shared response fields.
  const hourLog = await prisma.hourLog.create({
    data: { ...data, volunteerId: id },
    select: HOUR_LOG_SELECT,
  });

  // Return the new hour log with status 201.
  return NextResponse.json({ hourLog }, { status: 201 });
}
