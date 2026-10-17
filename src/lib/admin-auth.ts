/**
 * admin-auth.ts
 *
 * Additional logic for admin sign in. Determines if user is admin, and defines behavior thereafter.
 *
 * Created on 15 Oct 2026
 *
 * By William Balz and Nirvaan Govind
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/**
 * function isAdmin
 * determines whether a user is an admin
 * @param sessionClaims
 * @returns true if admin, false otherwise
 */

function isAdmin(
  sessionClaims: { metadata?: { role?: string } } | null,
): boolean {
  if (sessionClaims?.metadata?.role === "admin") return true;
  return false;
}

/**
 * requireAdminPage
 * redirects user to corresponding page depending on user status
 * @returns nothing, technically, just redirects
 */

export async function requireAdminPage(): Promise<void> {
  const { userId, sessionClaims } = await auth();

  if (!userId) redirect("/admin/sign-in");
  if (!isAdmin(sessionClaims)) redirect("/admin/unauthorized");
}

/**
 * requireAdmin
 * handles errors for invalid sign-ins
 * @returns json with corresponding error status data depending on invalid sign-in type
 * @throws 401 if not signed in and accessing signed-in pages; 403 if unauthorized access attempted
 */

export async function requireAdmin(): Promise<NextResponse | null> {
  const { userId, sessionClaims } = await auth();

  if (userId && isAdmin(sessionClaims)) return null;

  if (!userId) {
    return NextResponse.json({ error: "User not signed in." }, { status: 401 });
  }

  if (userId && !isAdmin(sessionClaims)) {
    return NextResponse.json({ error: "User unauthorized." }, { status: 403 });
  }

  return null;
}
