// TODO: FILE HEADER
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/admin-auth";
import { loadApplicantForReview } from "@/lib/admin-review";
import { normalizeEmail } from "@/lib/volunteer-identifiers";
import { normalizeCellPhone } from "@/lib/volunteer-identifiers";
import { prisma } from "@/lib/prisma";

// TODO: import prisma, requireAdmin, and loadApplicantForReview

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/applicants/[id]/approve
 *
 * rejects submitted applicants and creates a volunteer record as well as preventing duplicate volunteers
 *
 * Auth: Admin
 * Params:
 *   ID - applicant ID (url)
 *
 * Returns: 200 - { applicant }
 * Errors:
 *   409 - volunteer with that pair exists
 *   401 - user id missing
 *
 */
export async function POST(_request: Request, { params }: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "userId missing" }, { status: 401 });
  }

  const { id } = await params;

  const loaded = await loadApplicantForReview(id);
  if ("response" in loaded) return loaded.response;
  const { applicant } = loaded;

  const normalizedCellPhone = normalizeCellPhone(applicant.cellPhone);
  const normalizedEmail = normalizeEmail(applicant.email);

  if (
    await prisma.volunteer.findUnique({
      where: {
        email_cellPhone: {
          email: normalizedEmail,
          cellPhone: normalizedCellPhone,
        },
      },
    })
  ) {
    return NextResponse.json(
      { error: "Volunteer already exists" },
      { status: 409 },
    );
  }

  try {
    const rejected = await prisma.applicant.update({
      where: {
        id: id,
        status: "SUBMITTED",
      },

      data: {
        status: "REJECTED",
        reviewedAt: new Date(),
        reviewedByClerkId: userId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    return NextResponse.json({ applicant: rejected }, { status: 200 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        {
          error:
            "Applicant could not be rejected: their status changed or a volunteer already exists.",
        },
        { status: 409 },
      );
    }
    throw error;
  }
}
