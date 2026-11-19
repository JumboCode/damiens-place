/**
 * page.tsx
 *
 * Placeholder page for applicants section of admin dashboard.
 *
 * Author: Carter and Jeremiah
 * Date Created: 11/08/26
 */

import { requireAdminPage } from "@/lib/admin-auth";
import ApplicantsTable from "@/components/admin/ApplicantsTable";

export default async function AdminApplicantsPage() {
  await requireAdminPage();

  return <ApplicantsTable />;
}
