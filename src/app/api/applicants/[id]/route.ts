/**
 * src/app/api/applicants/[id]/route.ts
 *
 * Retrieving a specific applicant, admin can see full submission excluding drafts.
 *
 * Author: Abby and William
 * Date Created: 10/22/26
 */
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { ApplicantStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
// import prisma and requireAdmin

type RouteContext = { params: Promise<{ id: string }> };

/**
 * <GET>
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

  // In Next.js 15+, params is a Promise, so you have to await it
  const { id } = await params;
  const status = new URL(_request.url).searchParams.get("status");

  const applicant = await prisma.applicant.findFirst({
    where: {
      id: id,
      status: { not: "DRAFT" },
    },
    include: {
      positions: true,
    },
  });

  // look the applicant up with prisma.applicant.findFirst
  //   - where: this id AND status is not DRAFT
  //   - include: positions (so the full submission comes back in one go)
  //   Why findFirst: findUnique only searches by unique fields, and we also want to filter
  //   on status. This way a draft looks exactly like an applicant that doesn't exist.

  // if nothing was found, return 404
  if (!applicant) {
    return Response.json({ error: "Applicant not found" }, { status: 404 });
  }
  // return 200 with { applicant }
  return Response.json({ applicant }, { status: 200 });
}
