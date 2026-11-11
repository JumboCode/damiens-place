/**
 * route.ts
 *
 * routing for GET endpoint for volunteer profiles
 * Authors: William Balz and Elijah Chandler
 * Date created: 7 November 2026
 */
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { validateVolunteerFields } from "@/lib/applicant-validation";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

// The fields of a volunteer's profile. GET and PATCH both use it, so they always send back the same shape.
const VOLUNTEER_PROFILE_SELECT = {
  id: true,
  status: true,
  firstName: true,
  lastName: true,
  email: true,
  cellPhone: true,
  homePhone: true,
  photoUrl: true,
  photoConsent: true,
  emergencyContactName: true,
  emergencyContactPhone: true,
  emergencyContactRelationship: true,
  positions: { select: { id: true, name: true } },
} satisfies Prisma.VolunteerSelect;

/**
 * GETs volunteer if the session is a volunteer and the volunteer to GET is unique
 * @param _request - the incoming request
 * @param  params - volunteer id
 * @returns 200; response if successful with volunteer
 * Erros:
 * 404 if not found
 */
export async function GET(_request: Request, { params }: RouteContext) {
  // TODO(natalie): require the volunteer session with requireVolunteer() and check that its volunteerId matches this id (BE-volunteer-profile)

  // In Next.js 15+, params is a Promise, so you have to await it
  const { id } = await params;

  const volunteer = await prisma.volunteer.findUnique({
    where: {
      id: id,
    },
    select: VOLUNTEER_PROFILE_SELECT,
  });

  if (!volunteer) {
    return Response.json({ error: "Volunteer not found" }, { status: 404 });
  }

  return Response.json(
    { volunteer },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}

/**
 * allow volunteers to edit editable volunteer fields
 * @param request - incoming request
 * @param param1 - volunteer id
 * Errors:
 * 400 if invalid json
 * 404 if not found
 * 409 if not unique
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  // TODO(natalie): require the volunteer session with requireVolunteer() and check that its volunteerId matches this id (BE-volunteer-profile)

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }
  const volunteerData = validateVolunteerFields(body);
  if ("error" in volunteerData) {
    return NextResponse.json(
      { error: String(volunteerData.error) },
      { status: 400 },
    );
  }
  const { data } = volunteerData;
  try {
    const updated = await prisma.volunteer.update({
      where: { id },
      data: data as Parameters<typeof prisma.volunteer.update>[0]["data"],
      select: VOLUNTEER_PROFILE_SELECT,
    });
    return Response.json(
      { volunteer: updated },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Volunteer does not exist" },
        { status: 404 },
      );
    }
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "Email + cell phone pair belongs to another volunteer" },
        { status: 409 },
      );
    }
    throw error;
  }
}
