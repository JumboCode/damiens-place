/**
 * volunteer-api.ts
 *
 * Fetches volunteer profiles and logs volunteers out without throwing
 *
 * Author: William
 * Date created: 15 November 2026
 */

export type Volunteer = {
  id: string;
  status: "ACTIVE" | "INACTIVE";
  firstName: string;
  lastName: string;
  email: string;
  cellPhone: string;
  homePhone: string | null;
  photoUrl: string | null;
  photoConsent: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string | null;
  positions: { id: string; name: string }[];
};

export type VolunteerResult =
  | { ok: true; volunteer: Volunteer }
  | { ok: false; message: string; notFound: boolean };

/**
 * GET a volunteer's profile using their encoded id
 * returns the profile on success or a message on failure, including fetch and
 * json parsing failures. notFound only triggered by 404
 */
export async function fetchVolunteer(id: string): Promise<VolunteerResult> {
  let notFound = false;

  try {
    const response = await fetch(`/api/volunteers/${encodeURIComponent(id)}`, {
      method: "GET",
    });
    notFound = response.status === 404;
    const data = await response.json();

    if (response.ok) {
      return { ok: true, volunteer: data.volunteer };
    }

    return {
      ok: false,
      message:
        typeof data?.error === "string"
          ? data.error
          : "Unable to load volunteer.",
      notFound,
    };
  } catch {
    return { ok: false, message: "Unable to load volunteer.", notFound };
  }
}

/**
 * POST to the volunteer logout endpoint.
 * Returns true for a 2xx response and false for any other response or failed
 * fetch. Never throws.
 */
export async function logoutVolunteer(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/volunteer/logout", {
      method: "POST",
    });
    return response.ok;
  } catch {
    return false;
  }
}
