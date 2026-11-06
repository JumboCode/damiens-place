/**
 * AdminProfileCard.tsx
 *
 * The signed-in admin's profile card, shown above the tab bar on every admin
 * dashboard page. Reads the admin's details from Clerk and fills the shared
 * ProfileCard with them.
 *
 * Author: Natalie
 * Date Created: 11/6/2026
 */
"use client";

import { useUser } from "@clerk/nextjs";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileInfoCard from "@/components/profile/ProfileInfo";

// Clerk never gives out the password, so the card only ever shows dots
const PASSWORD_DOTS = "••••••••";

/**
 * AdminProfileCard
 *
 * Shows the admin's name, photo, email, and a masked password. While Clerk is
 * still loading, shows an empty box the size of the card so the page doesn't jump.
 */
export default function AdminProfileCard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return (
      <div
        aria-hidden="true"
        className="h-90 animate-pulse rounded-xl bg-gray-100"
      />
    );
  }

  const name =
    user.fullName ??
    ([user.firstName, user.lastName].filter(Boolean).join(" ") || "Admin");

  return (
    <ProfileCard
      name={name}
      photoUrl={user.hasImage ? user.imageUrl : null}
      // TODO(natalie): open the edit profile page (FE-admin-applicants-table)
    >
      <ProfileInfoCard
        items={[
          {
            label: "Email",
            value: user.primaryEmailAddress?.emailAddress ?? "",
          },
          { label: "Password", value: PASSWORD_DOTS },
        ]}
      />
    </ProfileCard>
  );
}
