/**
 * Application-Api.ts
 *
 * API functions for the volunteer application form.
 *
 * Author: Elijah and Jeremiah
 * Date Created: 10/30/2026
 */

export type ApiResult<T> =
  { ok: true; data: T } | { ok: false; status: number; error: string };

type ApplicantResponse = { applicant: { id: string; status: string } };

/**
 * request
 *
 * Sends a request to the specified URL and returns the response.
 *
 * @param url - The URL to send the request to.
 * @param init - The request initialization options.
 * @returns A promise resolving to the API result.
 */
async function request<T>(
  url: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch {
    return { ok: false, status: 0, error: "Network error" };
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    let message = "Request failed";

    if (body && typeof body === "object" && "error" in body) {
      message = String((body as { error: unknown }).error);
    }
    return { ok: false, status: response.status, error: message };
  }

  if (body === null) {
    return {
      ok: false,
      status: response.status,
      error: "Invalid response from server",
    };
  }
  return { ok: true, data: body as T };
}

/**
 * createApplicant
 *
 * Creates a new applicant in the database.
 *
 * @param payload - The applicant data to create.
 * @returns A promise resolving to the API result.
 */
export function createApplicant(
  payload: Record<string, unknown>,
): Promise<ApiResult<ApplicantResponse>> {
  // call the endpoints you made last sprint!
  return request<ApplicantResponse>("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * updateApplicant
 *
 * Updates an existing applicant in the database.
 *
 * @param id - The ID of the applicant to update.
 * @param payload - The updated applicant data.
 * @returns A promise resolving to the API result.
 */
export function updateApplicant(id: string, payload: Record<string, unknown>) {
  return request<ApplicantResponse>(id, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
