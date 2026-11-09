/**
 * page.tsx
 *
 * Admin sign-in successful page
 *
 * Author: William Balz and Nirvaan Govind
 * Date created: 7 October 2026
 */

import AdminApplicantsPage from "./(dashboard)/applicants/page";
import AdminDashboardLayout from "./(dashboard)/layout";

export default function AdminDashboardPage() {
  return (
    <AdminDashboardLayout>
      <AdminApplicantsPage>
      </AdminApplicantsPage>
    </AdminDashboardLayout>
  );
}
