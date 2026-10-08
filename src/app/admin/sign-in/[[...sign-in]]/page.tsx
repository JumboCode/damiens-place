/**
 * page.tsx
 *
 * Admin sign-in page skeleton, likely to be amended with more specificity later.
 *
 * Author: William Balz and Nirvaan Govind
 * Date Created: 7 October 2026
 */

import { ClerkProvider, SignIn } from "@clerk/nextjs";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function AdminSignInPage() {
  return (
    <ClerkProvider>
      <AuthPageLayout user="Admin">
        <SignIn
          routing="path"
          path="/admin/sign-in"
          forceRedirectUrl="/admin"
          appearance={clerkAppearance}
        />
      </AuthPageLayout>
    </ClerkProvider>
  );
}
