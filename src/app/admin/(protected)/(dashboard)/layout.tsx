/**
 * layout.tsx
 *
 * Configured layout of admin dashboard page.
 *
 * Author: Carter and Jeremiah
 * Date Created: 11/06/26
 */

import type { ReactNode } from "react";
import AdminProfileCard from "@/components/admin/AdminProfileCard";
import CommonTabs from "@/components/common/CommonTabs";

/**
 * AdminDashboardLayout
 *
 * Renders the admin dashboard layout with the admin's profile card, a CommonTabs
 * bar, and a content area
 *
 * @param children - The rows of tab information displayed each section
 * @returns rendered admin dashboard layout
 */
export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-8xl px-6 pt-6 sm:px-8">
      <AdminProfileCard />
      <div className="mt-10">
        <CommonTabs ariaLabel="Admin sections" />
      </div>
      <div>{children}</div>
    </div>
  );
}
