/**
 * VolunteerDashboardShell.tsx
 *
 * Shared volunteer profile and navigation around the active dashboard page.
 *
 * Author: Elijah
 * Date Created: 11/17/2026
 */
"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import CommonTabs from "@/components/common/CommonTabs";
import { getVolunteerTabs } from "@/components/common/common-tabs";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileInfoCard from "@/components/profile/ProfileInfo";
import { fetchVolunteer, type Volunteer } from "@/lib/volunteer-api";
import { Mail, Phone, UserRound, UsersRound, Clock3 } from "lucide-react";
const ICON_CLASS = "size-5 shrink-0 text-gray-400";

/**
 * VolunteerDashboardShell
 *
 * Fetches the volunteer's profile and renders it with the shared dashboard
 * navigation and the active page's content.
 *
 * @param volunteerId - The volunteer's ID from the URL
 * @param children - The active volunteer dashboard page
 */
export default function VolunteerDashboardShell({
  volunteerId,
  children,
}: {
  volunteerId: string;
  children: ReactNode;
}) {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [error, setError] = useState<{
    message: string;
    notFound: boolean;
  } | null>(null);
  useEffect(() => {
    let cancelled = false;

    async function loadVolunteer() {
      setVolunteer(null);
      setError(null);

      const result = await fetchVolunteer(volunteerId);

      if (cancelled) return;

      if (result.ok) {
        setVolunteer(result.volunteer);
      } else {
        setError({
          message: result.message,
          notFound: result.notFound,
        });
      }
    }

    void loadVolunteer();

    return () => {
      cancelled = true;
    };
  }, [volunteerId]);

  if (error?.notFound) {
    return <p className="text-center text-gray-500">Volunteer not found</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error.message}</p>;
  }

  if (!volunteer) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  const name =
    [volunteer.firstName, volunteer.lastName].filter(Boolean).join(" ") ||
    "Volunteer";

  const displayValue = (value: string | null | undefined) =>
    value?.trim() || "—";

  return (
    <div className="mx-auto w-full max-w-8xl px-6 pt-6 sm:px-8">
      <ProfileCard name={name} photoUrl={volunteer.photoUrl}>
        <ProfileInfoCard
          items={[
            {
              label: "Email",
              icon: <Mail aria-hidden="true" className={ICON_CLASS} />,
              value: displayValue(volunteer.email),
            },
            {
              label: "Cell Phone",
              icon: <Phone aria-hidden="true" className={ICON_CLASS} />,
              value: displayValue(volunteer.cellPhone),
            },
            {
              label: "Photo Consent",
              icon: <UserRound aria-hidden="true" className={ICON_CLASS} />,
              value: volunteer.photoConsent ? "Yes" : "No",
            },
            {
              label: "Emergency Contact",
              icon: <UserRound aria-hidden="true" className={ICON_CLASS} />,
              value: displayValue(volunteer.emergencyContactName),
            },
            {
              label: "Emergency Contact Number",
              icon: <Phone aria-hidden="true" className={ICON_CLASS} />,
              value: displayValue(volunteer.emergencyContactPhone),
            },
            {
              label: "Relationship to Volunteer",
              icon: <UsersRound aria-hidden="true" className={ICON_CLASS} />,
              value: displayValue(volunteer.emergencyContactRelationship),
            },
            {
              label: "Total Volunteer Hours",
              icon: <Clock3 aria-hidden="true" className={ICON_CLASS} />,
              value: `${(volunteer.totalMinutes / 60).toLocaleString(
                undefined,
                { maximumFractionDigits: 2 },
              )}`,
            },
          ]}
        />
      </ProfileCard>

      <section className="mt-10">
        <CommonTabs
          tabs={getVolunteerTabs(volunteerId)}
          ariaLabel="Volunteer sections"
        />
        <div className="px-6 pt-6">{children}</div>
      </section>
    </div>
  );
}
