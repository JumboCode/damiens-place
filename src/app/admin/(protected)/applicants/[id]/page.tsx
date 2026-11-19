/**
 * page.tsx
 *
 * Admin applicant detail page.
 *
 * Author: Abby, Alex
 * Date Created: 11/18/26
 */

import ApplicantDetailView from "@/components/admin/ApplicantDetailView";
import { requireAdminPage } from "@/lib/admin-auth";

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();

  const { id } = await params;
  return <ApplicantDetailView applicantId={id} />;
}
