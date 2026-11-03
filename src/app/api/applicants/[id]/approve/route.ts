/**
 * src/app/api/applicants/[id]/approve/route.ts
 *
 * approves submitted applicants and creates a volunteer record as well as preventing duplicate volunteers
 *
 * Author: Abby and Will
 * Date Created: 10/28/26
 */

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@/generated/prisma/client";
import { loadApplicantForReview } from "@/lib/admin-review";
import { normalizeEmail } from "@/lib/volunteer-identifiers";
import { normalizeCellPhone } from "@/lib/volunteer-identifiers";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/applicants/[id]/approve
 *
 * approves submitted applicants and creates a volunteer record as well as preventing duplicate volunteers
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
    const approved = await prisma.applicant.update({
      where: {
        id: id,
        status: "SUBMITTED",
      },

      data: {
        status: "APPROVED",
        reviewedAt: new Date(),
        reviewedByClerkId: userId,

        volunteer: {
          create: {
            firstName: applicant.firstName,
            lastName: applicant.lastName,
            cellPhone: normalizeCellPhone(applicant.cellPhone),
            homePhone: applicant.homePhone,
            email: normalizeEmail(applicant.email),
            emergencyContactName: applicant.emergencyContactName,
            emergencyContactPhone: applicant.emergencyContactPhone,
            emergencyContactRelationship:
              applicant.emergencyContactRelationship,

            positions: {
              connect: applicant.positions.map((position) => ({
                id: position.id,
              })),
            },
          },
        },
      },
      select: {
        id: true,
        status: true,
        volunteerId: true,
      },
    });

    return NextResponse.json({ applicant: approved }, { status: 200 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2025" || error.code === "P2002")
    ) {
      return NextResponse.json(
        {
          error:
            "Applicant could not be approved: their status changed or a volunteer already exists.",
        },
        { status: 409 },
      );
    }

    throw error;
  }
}
