/**
 * layout.tsx
 *
 * Configured layout of admin dashboard page.
 *
 * Author: Carter and Jeremiah
 * Date Created: 11/06/26
 */

import type { ReactNode } from "react";
import AdminTabs from "@/components/admin/AdminTabs";

/**
 * AdminDashboardLayout
 *
 * Renders the admin dashboard layout with an AdminTabs and content area
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
    <div className="flex items-center justify-start gap-2">
     <AdminTabs></AdminTabs>
      <main>{children}</main>
    </div>
  );
}
