/**
 * page.tsx
 *
 * Placeholder page for edits section of admin dashboard.
 *
 * Author: Carter and Jeremiah
 * Date Created: 11/08/26
 */

import { requireAdminPage } from "@/lib/admin-auth";

export default async function AdminEditsPage() {
    
  await requireAdminPage();

  return (
    <section className="p-6">
      <h1>Edits</h1>
      <p>Coming soon.</p>
    </section>
  );
}