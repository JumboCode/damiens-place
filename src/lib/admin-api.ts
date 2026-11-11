/**
 * admin-api.ts
 *
 * calls POST and sends approval or rejection and returns if succeeded or not
 *
 * Author: Abby, Alex
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
