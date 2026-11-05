/**
 * Application Api.ts
 *
 * API functions for the volunteer application form.
 *
 * Author: Elijah and Jeremiah
 * Date Created: 10/30/2026
 */

export type ApiResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: number;
      error: string;
      // Only on a 422 from the submit endpoint: the fields still missing
      missingFields?: string[];
    };

type ApplicantResponse = { applicant: { id: string; status: string } };

type SubmitResponse = ApplicantResponse & { emailSent: boolean };

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
    return {
      ok: false,
      status: response.status,
      error: response.statusText || "Request failed",
    };
  }

  if (!response.ok) {
    const message =
      body !== null &&
      typeof body === "object" &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : response.statusText || "Request failed";

    const missingFields =
      body !== null &&
      typeof body === "object" &&
      "missingFields" in body &&
      Array.isArray(body.missingFields) &&
      body.missingFields.every((field) => typeof field === "string")
        ? (body.missingFields as string[])
        : undefined;

    return {
      ok: false,
      status: response.status,
      error: message,
      missingFields,
    };
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
  return request<ApplicantResponse>("/api/applicants", {
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
  return request<ApplicantResponse>(
    `/api/applicants/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}

/**
 * submitApplicant
 *
 * Submits a completed application. A 422 result carries `missingFields`, and a 409 means the
 * application was already submitted.
 *
 * @param id - The ID of the applicant to submit.
 * @returns A promise resolving to the API result, including whether the confirmation email was sent.
 */
export function submitApplicant(id: string) {
  return request<SubmitResponse>(
    `/api/applicants/${encodeURIComponent(id)}/submit`,
    { method: "POST" },
  );
}
