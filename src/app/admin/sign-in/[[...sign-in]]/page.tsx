/**
 * page.tsx
 *
 * Admin sign-in page skeleton, likely to be amended with more specificity later.
 *
 * Author: William Balz and Nirvaan Govind
 * Date Created: 7 October 2026
 */

"use client";
import { ClerkProvider } from "@clerk/nextjs";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import AdminSignInForm from "@/components/auth/AdminSignInForm"

export default function AdminSignInPage() {
  return (
    <ClerkProvider>
      <AuthPageLayout user="Admin">
        <AdminSignInForm />
      </AuthPageLayout>
    </ClerkProvider>
  );
}
