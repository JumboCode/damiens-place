/**
 * src/app/api/applicants/route.ts
 *
 * Checks if user is admin and returns a list of applicants with optional filtering.
 *
 * Author: Abby and William
 * Date Created: 10/22/26
 */

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/applicants
 *
 * Checks if user is admin and returns a list of applicants. Does not include drafts and there is an optional filter.
 *
 * @param request - HTTP request with filter option
 * @returns JSON, 200, or 400 for invalid status
 *
 */

export async function GET(request: Request) {
  // Admin check goes FIRST. null means allowed
  const denied = await requireAdmin();
  if (denied) return denied;

  const status = new URL(request.url).searchParams.get("status");

  if (
    status !== null &&
    status !== "REJECTED" &&
    status !== "APPROVED" &&
    status !== "SUBMITTED"
  ) {
    return Response.json(
      { message: "Status must be APPROVED, REJECTED, or SUBMITTED" },
      { status: 400 },
    );
  }

  // if a status was sent, it must be exactly SUBMITTED, APPROVED, or REJECTED.
  //   Anything else (including DRAFT, since admins never see drafts) gets a 400 with a message
  //   saying what the allowed values are.
  const applicants = await prisma.applicant.findMany({
    where: status !== null ? { status: status } : { status: { not: "DRAFT" } },

    orderBy: {
      submittedAt: "desc",
    },

    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      status: true,
      submittedAt: true,
    },
  });
  return Response.json({ applicants }, { status: 200 });
}
