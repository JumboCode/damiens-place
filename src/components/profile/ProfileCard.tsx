/**
 * ProfileCard.tsx
 *
 * Shared top half of the admin and volunteer profile dashboards:
 * banner, avatar, name, and the "Edit Profile" button.
 *
 * Info section differs per role, so it is passed in as children
 * (see ProfileInfo.tsx).
 *
 * Author: Natalie
 * Date Created: 11/5/2026
 */
"use client";

import type { ReactNode } from "react";

type ProfileCardProps = {
  name: string;
  // Falls back to a default person icon
  photoUrl?: string | null;
  // Falls back to the default gradient
  backgroundUrl?: string | null;
  // TODO(natalie): the Edit Profile page is a later ticket, so nothing is passed in yet
  onEditProfile?: () => void;
  // The info section (usually a <ProfileInfoCard />)
  children?: ReactNode;
};

/**
 * ProfileCard
 *
 * Shows the profile banner, avatar, name, and an Edit Profile button, with the
 * role-specific info section underneath.
 *
 * @param name - the full name to display
 * @param photoUrl - profile photo, or empty for the default icon
 * @param backgroundUrl - banner image, or empty for the default gradient
 * @param onEditProfile - called when Edit Profile is clicked
 * @param children - the info section
 */
export default function ProfileCard({
  name,
  photoUrl,
  backgroundUrl,
  onEditProfile,
  children,
}: ProfileCardProps) {
  return (
    <section
      aria-label="Profile"
      className="overflow-hidden rounded-xl border border-gray-200 bg-white"
    >
      <div
        className="h-28 bg-cover bg-center bg-linear-to-r from-banner-start via-banner-mid via-55% to-banner-end"
        style={
          backgroundUrl
            ? { backgroundImage: `url(${backgroundUrl})` }
            : undefined
        }
      />

      <div className="px-4 pb-6 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="-mt-10 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-200 text-gray-500">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={`${name}'s profile`}
                className="size-full object-cover"
              />
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
              </svg>
            )}
          </div>

          <button
            type="button"
            onClick={onEditProfile}
            className="mt-3 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Edit Profile
          </button>
        </div>

        <h2 className="mt-3 font-bold">{name}</h2>

        {children && <div className="mt-4">{children}</div>}
      </div>
    </section>
  );
}
