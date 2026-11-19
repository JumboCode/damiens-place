/**
 * page.tsx
 *
 * Redirects the volunteer dashboard root to the hours section.
 *
 * Author: Elijah
 * Date Created: 11/17/2026
 */

import { redirect } from "next/navigation";

export default async function VolunteerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/volunteer/${encodeURIComponent(id)}/hours`);
}
