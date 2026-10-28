/**
 * src/app/api/applicants/[id]/route.ts
 *
 * Retrieving a specific applicant, admin can see full submission excluding drafts.
 *
 * Author: Abby and William
 * Date Created: 10/22/26
 */
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

/**
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
