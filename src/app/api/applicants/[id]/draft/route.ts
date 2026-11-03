/**
 * applicants/[id]/draft/route.ts
 *
 * Defines the GET api endpoint for our applicants database
 *
 * Author: Rim Badaoui, Carter Watabe
 * Date Created: 11/2/2026
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/[id]/draft
 *
 * Retrieving a specific applicant, admin can see full submission excluding drafts.
 *
 * Auth: public
 * @param request - HTTP request
 * @returns JSON, 200 or 404 if application not found
 * Errors:
 *  404 - applicant not found
 *  500 - unexpected database error
 */
export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  const applicant = await prisma.applicant.findFirst({
    where: { id, status: "DRAFT" },
    select: {
      id: true,
      status: true,
      // Step 1
      firstName: true,
      lastName: true,
      age: true,
      email: true,
      cellPhone: true,
      homePhone: true,
      proofOfResidenceUrl: true,
      street: true,
      city: true,
      state: true,
      zip: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
      emergencyContactRelationship: true,
      // Step 2
      positions: { select: { id: true } },
      availableDays: true,
      availableHours: true,
      hasDisability: true,
      disabilityDetails: true,
      // Step 3
      waiverAccepted: true,
      waiverSignature: true,
      agreementAccepted: true,
      agreementSignature: true,
      minorReleaseAccepted: true,
      minorGuardianSignature: true,
      minorSignature: true,
      // Step 4
      onboardingAvailability: true,
    },
  });

  // if nothing was found, return 404
  if (!applicant) {
    return Response.json({ error: "Applicant not found" }, { status: 404 });
  }
  // return 200 with { applicant }
  const { positions, ...rest } = applicant;
  return NextResponse.json(
    { applicant: { ...rest, positions: positions.map((p) => p.id) } },
    { headers: { "Cache-Control": "no-store" } },
  );
}
