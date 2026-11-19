/**
 * admin-api.ts
 *
 * calls POST and sends approval or rejection and returns if succeeded or not
 * calls GET and sends approval or rejects if succeeded or not
 *
 * Author: Abby, Alex, Carter, Jeremiah
 * Date Created: 11/06/26
 */

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

export type ApplicantSummary = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "SUBMITTED" | "APPROVED" | "REJECTED";
  submittedAt: string | null;
};

export type ApplicantsResult =
  { ok: true; applicants: ApplicantSummary[] } | { ok: false; message: string };

/**
 * fetchApplicants
 *
 * calls GET /api/applicants and returns every non-draft applicant,
 * newest first. does not throw, failure comes back as an error message
 *
 * @returns ApplicantsResult - applicant list or failure with an error message
 */
export async function fetchApplicants(): Promise<ApplicantsResult> {
  try {
    const response = await fetch("/api/applicants");
    const body = await response.json();

    if (response.ok) {
      if (
        typeof body !== "object" ||
        body === null ||
        !("applicants" in body) ||
        !Array.isArray(body.applicants)
      ) {
        return { ok: false, message: "Invalid applicants response." };
      }

      return { ok: true, applicants: body.applicants };
    }
    return { ok: false, message: body?.error ?? "Something went wrong" };
  } catch {
    return { ok: false, message: "Could not load applicants." };
  }
}
