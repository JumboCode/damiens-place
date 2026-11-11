/**
 * page.tsx
 *
 * Admin sign-in successful page, currently redirects to applicants tab
 *
 * Author: William Balz and Nirvaan Govind
 * Date created: 7 October 2026
 */

import { redirect } from "next/navigation";

export default function AdminDashboardPage() {
  redirect("/admin/(protected)/(dashboard)/applicants");
}
