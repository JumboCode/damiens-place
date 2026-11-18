/**
 * page.tsx
 *
 * Displays the dashboard for a signed-in volunteer.
 *
 * Author: Elijah
 * Date Created: 11/17/2026
 */

import { redirect } from "next/navigation";
import VolunteerDashboard from "@/components/volunteer/VolunteerDashboard";
import { getVolunteerSessionId } from "@/lib/volunteer-session";

/**
 * VolunteerPage
 *
 * Checks for a volunteer session and redirects unauthenticated
 * users to sign-in. Otherwise, renders the requested dashboard.
 *
 * @param params - The dynamic route parameters containing the volunteer ID
 */
export default async function VolunteerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sessionId = await getVolunteerSessionId();

  if (sessionId === null) {
    redirect("/sign-in");
  }

  const { id } = await params;

  return <VolunteerDashboard volunteerId={id} />;
}
