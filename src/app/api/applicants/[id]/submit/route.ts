/**
 * Applicant Submission API Route
 *
 * Handles submitting an applicant's completed application.
 * Validates application completeness, updates the applicant's
 * status and submission timestamps, and sends an application
 * received confirmation email.
 *
 * Authentication: Public
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { findMissingFields } from "@/lib/applicant-validation";
import { applicationReceivedEmail } from "@/lib/email-templates";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Submits an applicant's completed application.
 *
 * @param _request - The incoming request (no request body is required).
 * @param params - Contains the applicant's ID from the dynamic route.
 * @returns 200 if successfully submitted, 404 if the applicant does not exist,
 *          409 if the applicant has already been submitted, or
 *          422 if the application is incomplete.
 */
export async function POST(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  const applicant = await prisma.applicant.findUnique({
    where: { id },
    include: {
      positions: {
        select: { id: true },
      },
    },
  });

  // Return 404 if applicant not found
  if (!applicant) {
    return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
  }

  if (applicant.status !== "DRAFT") {
    return NextResponse.json(
      { error: "Applicant has already been submitted" },
      { status: 409 },
    );
  }

  const missingFields = findMissingFields(applicant);

  if (missingFields.length > 0) {
    return NextResponse.json(
      {
        error: "Application is incomplete",
        missingFields,
      },
      { status: 422 },
    );
  }

  const now = new Date();

  const result = await prisma.applicant.updateMany({
    where: {
      id,
      status: "DRAFT",
    },
    data: {
      status: "SUBMITTED",
      submittedAt: now,
      materialsReviewedAt: now,
      complianceAcceptedAt: now,
    },
  });

  // If another request submitted it first, no rows will be updated.
  if (result.count === 0) {
    return NextResponse.json(
      { error: "Applicant has already been submitted" },
      { status: 409 },
    );
  }

  // Send the application-received email.
  const emailResult = await sendEmail({
    to: applicant.email,
    ...applicationReceivedEmail(applicant.firstName),
  });

  return NextResponse.json(
    {
      applicant: {
        id,
        status: "SUBMITTED",
      },
      emailSent: emailResult.ok,
    },
    { status: 200 },
  );
}
