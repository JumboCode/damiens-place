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
    where: {
      id: id,
      status: "DRAFT",
    },
    select: { positions: { select: { id: true } } },
  });

  // if nothing was found, return 404
  if (!applicant) {
    return Response.json({ error: "Applicant not found" }, { status: 404 });
  }
  // return 200 with { applicant }
  return NextResponse.json(
    { applicant },
    { headers: { "Cache-Control": "no-store" } },
  );
}
