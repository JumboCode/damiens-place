/**
 * applicants/route.ts
 *
 * Creates a new applicant in DRAFT status from the Step 1 application fields.
 *
 * Author: Elijah, Jeremiah
 * Date Created: 10/25/2026
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApplicantFields } from "@/lib/applicant-validation";
import { checkApplicantReferences } from "@/lib/applicant-references";

/**
 * POST /api/applicants
 *
 * Creates a new applicant in DRAFT status. Fails if the body is not valid
 * JSON, a required Step 1 field is missing or invalid, or a referenced
 * position is missing or does not exist.
 *
 * Auth: public
 * Body: STEP_1_REQUIRED_FIELDS,
 *       positionIds (string[], optional)
 * Returns: 201 { applicant: { id, status } }
 * Errors:
 *   400 - malformed JSON, invalid Step 1 field, or invalid position reference
 *   409 - an applicant with this email already exists
 *   500 - unexpected database error
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const result = validateApplicantFields(body, { requireStep1: true });
  if ("error" in result) {
    return NextResponse.json({ error: String(result.error) }, { status: 400 });
  }
  const applicantData = result.data as Record<string, unknown>;

  const referenceError = await checkApplicantReferences(applicantData);
  if (referenceError) {
    return NextResponse.json(
      { error: String(referenceError) },
      { status: 400 },
    );
  }

  const { positions, ...data } = applicantData;
  const ids = (
    Array.isArray(positions)
      ? positions
      : positions === undefined
        ? []
        : [positions]
  ).filter((id): id is string => typeof id === "string");

  try {
    const applicant = await prisma.applicant.create({
      data: {
        ...data,
        ...(ids.length > 0 && {
          positions: { connect: ids.map((id) => ({ id })) },
        }),
      } as Parameters<typeof prisma.applicant.create>[0]["data"],
      select: { id: true, status: true },
    });
    return NextResponse.json({ applicant }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      if (err.code === "P2002") {
        return NextResponse.json(
          { error: "An applicant with this email already exists" },
          { status: 409 },
        );
      }
      if (err.code === "P2025") {
        return NextResponse.json(
          { error: "One or more positions do not exist" },
          { status: 400 },
        );
      }
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
