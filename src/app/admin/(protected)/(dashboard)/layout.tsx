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
    <div className=" inline-flex h-full w-full items-center justify-between bg-primary px-[30px] py-[20px]">
      <AdminTabs></AdminTabs>
      <main>{children}</main>
    </div>
  );
}
