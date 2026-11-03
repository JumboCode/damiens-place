/**
 * src/lib/applicant-review.ts
 *
 * Checks if applicant status is SUBMITTED for admin to review.
 *
 * Author: Abby and Will
 * Date Created: 10/28/26
 */

import { requireAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * loadApplicantForReview /src/lib
 *
 * Checks if applicant status is SUBMITTED for admin to review.
 *
 * Auth: admin
 * Params:
 *   id - user id string
 *
 * Returns: JSON
 * Errors:
 *   404 - no info found
 *   409 - status not SUBMITTED
 */

export async function loadApplicantForReview(id: string) {
  const denied = await requireAdmin();
  if (denied) return { response: denied };
  const applicant = await prisma.applicant.findFirst({
    where: {
      id: id,
      status: { not: "DRAFT" },
    },
    include: {
      positions: { select: { id: true } },
    },
  });

  if (!applicant) {
    return {
      response: NextResponse.json(
        { error: "Applicant not found" },
        { status: 404 },
      ),
    };
  }
  if (applicant.status !== "SUBMITTED") {
    return {
      response: NextResponse.json(
        { error: "Status not SUBMITTED" },
        { status: 409 },
      ),
    };
  }
  return { applicant };
}
