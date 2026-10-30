/**
 * applicants/[id]/route.ts
 *
 * PATCH: Updates the fields of an existing applicant in DRAFT status.
 * GET: Retrieving a specific applicant, admin can see full submission excluding drafts.
 *
 * Author: Elijah, Jeremiah, Abby, William
 * Date Created: 10/28/2026
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApplicantFields } from "@/lib/applicant-validation";
import { checkApplicantReferences } from "@/lib/applicant-references";
import { requireAdmin } from "@/lib/admin-auth";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/applicants/:id
 *
 * Updates only the provided fields of an existing DRAFT applicant.
 *
 * Auth: public
 * Body: One or more allowed applicant fields
 * Returns: 200 { applicant: { id, status } }
 * Errors:
 *   400 - malformed JSON, invalid fields, or invalid position reference
 *   404 - applicant does not exist
 *   409 - applicant is not in DRAFT status
 *   500 - unexpected database error
 */
export async function PATCH(request: Request, { params }: RouteContext) {
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

  try {
    const existingApplicant = await prisma.applicant.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!existingApplicant) {
      return NextResponse.json(
        { error: "Applicant does not exist" },
        { status: 404 },
      );
    }

    if (existingApplicant.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Only draft applications can be edited" },
        { status: 409 },
      );
    }

    const result = validateApplicantFields(body, { requireStep1: false });
    if ("error" in result) {
      return NextResponse.json(
        { error: String(result.error) },
        { status: 400 },
      );
    }

    const applicantData = result.data as Record<string, unknown>;

    if (Object.keys(applicantData).length === 0) {
      return NextResponse.json(
        { error: "At least one field must be provided" },
        { status: 400 },
      );
    }

    const referenceError = await checkApplicantReferences(applicantData);
    if (referenceError) {
      return NextResponse.json({ error: referenceError }, { status: 400 });
    }

    const { positions, ...data } = applicantData;

    // Update only the provided fields and replace existing positions if supplied.
    const applicant = await prisma.applicant.update({
      where: { id },
      data: {
        ...data,
        ...(positions !== undefined && {
          positions: {
            set: (positions as string[]).map((id) => ({ id })),
          },
        }),
      } as Parameters<typeof prisma.applicant.update>[0]["data"],
      select: { id: true, status: true },
    });

    return NextResponse.json({ applicant }, { status: 200 });
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "P2025") {
      return NextResponse.json(
        { error: "Applicant does not exist" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/*
 * GET /api/applicants/[id]
 *
 * Retrieving a specific applicant, admin can see full submission excluding drafts.
 *
 * @param request - HTTP request
 * @returns JSON, 200 or 404 if application not found
 *
 */
export async function GET(_request: Request, { params }: RouteContext) {
  // Admin check goes FIRST, before we even look the applicant up
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  const applicant = await prisma.applicant.findFirst({
    where: {
      id: id,
      status: { not: "DRAFT" },
    },
    include: {
      positions: true,
    },
  });

  // if nothing was found, return 404
  if (!applicant) {
    return Response.json({ error: "Applicant not found" }, { status: 404 });
  }
  // return 200 with { applicant }
  return Response.json({ applicant }, { status: 200 });
}
