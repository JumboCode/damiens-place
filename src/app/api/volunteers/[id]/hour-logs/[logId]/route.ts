/**
 * route.ts
 *
 * PATCH endpoint for editing one of a volunteer's logged hour entries.
 * The edit form sends the whole entry again, and minutes is recomputed
 * by the server from the new start and end times.
 *
 * Authors: Adrien Tabor and Nirvaan Govind
 * Date created: 17 November 2026
 */

import { NextResponse } from "next/server";
import { HOUR_LOG_SELECT, validateHourLogFields } from "@/lib/hour-log";
import { prisma } from "@/lib/prisma";
import { requireVolunteer } from "@/lib/volunteer-auth";

type RouteContext = { params: Promise<{ id: string; logId: string }> };

/**
 * Edits one of the signed-in volunteer's hour log entries
 * @param request - incoming request; body has date, startTime, endTime,
 *   positionId, and optional notes (null clears them)
 * @param params - volunteer id and hour log id
 * @returns 200 with { hourLog } holding the updated entry
 * Errors:
 * 400 if the body isn't valid JSON, a field is missing, extra, or invalid,
 *     or the position doesn't exist
 * 401 if not signed in as a volunteer
 * 403 if the volunteer is inactive
 * 404 if the log doesn't exist or belongs to a different volunteer
 * 404 if the id isn't the signed-in volunteer's
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await requireVolunteer();
  if ("response" in session) return session.response;

  const { id, logId } = await params;

  // A volunteer can only edit their own hours
  if (session.volunteerId !== id) {
    return NextResponse.json({ error: "Hour log not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const result = validateHourLogFields(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { data } = result;

  // Treat another volunteer's log the same as a missing one, so we don't
  // reveal which log ids exist
  const existingLog = await prisma.hourLog.findUnique({
    where: { id: logId },
    select: { volunteerId: true },
  });
  if (!existingLog || existingLog.volunteerId !== id) {
    return NextResponse.json({ error: "Hour log not found" }, { status: 404 });
  }

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

  const hourLog = await prisma.hourLog.update({
    where: { id: logId },
    data,
    select: HOUR_LOG_SELECT,
  });

  // TODO(natalie): email the admins that this entry was edited, with the old and new values

  return NextResponse.json(
    { hourLog },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
