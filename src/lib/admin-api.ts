/**
 * admin-api.ts
 *
 * calls POST and sends approval or rejection and returns if succeeded or not
 *
 * Author: Abby, Alex
 * Date Created: 11/06/26
 */
import { ApplicantStatus, DayOfWeek } from "../generated/prisma/enums";
import type { Volunteer } from "../generated/prisma/client";

export type Decision = "approve" | "reject";

export type DecisionResult = { ok: true } | { ok: false; message: string };

/**
 * decideApplicant
 *
 * calls POST and sends approval or rejection and returns if succeeded or not
 *
 * @param applicantId - applicants id string
 * @param decision - approve/reject
 * @returns decisionResult - success or failure -> with error message
 *
 */
export async function decideApplicant(
  applicantId: string,
  decision: Decision,
): Promise<DecisionResult> {
  try {
    const response = await fetch(
      `/api/applicants/${encodeURIComponent(applicantId)}/${decision}`,
      {
        method: "POST",
      },
    );

    if (response.ok) {
      return { ok: true };
    } else {
      const data = await response.json();
      if (
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof data.error === "string"
      ) {
        return { ok: false, message: data.error };
      } else {
        return { ok: false, message: "sometthing went wrong" };
      }
    }
  } catch {
    return { ok: false, message: "something went wrong" };
  }
}

export type ApplicantDetail = {
  id: string;
  status: ApplicantStatus;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  cellPhone: string;
  homePHone: string | null;
  proofOfResidenceUrl: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string | null;
  positions: {
    id: string;
    name: string;
  }[];
  availableDays: DayOfWeek[];
  availableHours: string | null;
  hasDisability: boolean | null;
  disabilityDetails: string | null;
  materialsReviewedAt: string | null;
  wavierAccepted: boolean | null;
  waiverSignature: string | null;
  agreementAccpeted: boolean | null;
  agreementSignature: string | null;
  complianceAcceptedAt: string | null;
  minorReleaseAccepted: string | null;
  minorGuardianSignature: string | null;
  minorSignature: string | null;
  onboardingAvailability: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedByClerkId: string | null;
  volunteerId: string | null;
  volunteer: Volunteer;
  createdAt: string;
  updatedAt: string;
};

export type ApplicantDetailResult =
  | { ok: true; applicant: ApplicantDetail }
  | { ok: false; message: string; notFound: boolean };

/**
 * <GET> /src/lib/admin-api.ts
 *
 * Retrieves a specific applicants submission for admin
 *
 * Auth: admin
 * Params:
 *   id - applicants id
 *
 * Returns: 200 - ok: true
 * Errors:
 *   404 - failed to fetch applicant
 *
 */

export async function fetchApplicantDetail(
  id: string,
): Promise<ApplicantDetailResult> {
  try {
    const response = await fetch(`/api/applicants/${encodeURIComponent(id)}`);
    let data: { error?: string; applicant?: ApplicantDetail };

    try {
      data = await response.json();
    } catch {
      return {
        ok: false,
        message: "Invalid response from server.",
        notFound: response.status === 404,
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        message: data?.error ?? "Failed to fetch applicant.",
        notFound: response.status === 404,
      };
    }

    return {
      ok: true,
      applicant: data.applicant as ApplicantDetail,
    };
  } catch {
    return {
      ok: false,
      message: "Network error / Bad API call",
      notFound: false,
    };
  }
}
