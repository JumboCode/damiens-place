/**
 * layout.tsx
 *
 * Shared profile and navigation for all volunteer dashboard pages.
 *
 * Author: Elijah
 * Date Created: 11/17/2026
 */

import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import VolunteerDashboardShell from "@/components/volunteer/VolunteerDashboardShell";
import { getVolunteerSessionId } from "@/lib/volunteer-session";

export default async function VolunteerDashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const sessionId = await getVolunteerSessionId();
  if (sessionId === null) {
    redirect("/sign-in");
  }

  const { id } = await params;
  return (
    <VolunteerDashboardShell volunteerId={id}>
      {children}
    </VolunteerDashboardShell>
  );
}
