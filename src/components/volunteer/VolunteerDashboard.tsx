/**
 * VolunteerDashboard.tsx
 *
 * Displays the volunteer's profile information and dashboard tabs.
 *
 * Author: Elijah
 * Date Created: 11/17/2026
 */
"use client";

import { useEffect, useState } from "react";
import AdminTabs from "@/components/admin/AdminTabs";
import { getVolunteerTabs } from "@/components/admin/admin-tabs";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileInfoCard from "@/components/profile/ProfileInfo";
import { fetchVolunteer, type Volunteer } from "@/lib/volunteer-api";
import { Mail, Phone, UserRound, UsersRound, Clock3 } from "lucide-react";
const ICON_CLASS = "size-5 shrink-0 text-gray-400";

/**
 * VolunteerDashboard
 *
 * Fetches and displays the volunteer's profile information and
 * dashboard tabs.
 *
 * @param volunteerId - The volunteer's ID from the URL
 */
export default function VolunteerDashboard({
  volunteerId,
}: {
  volunteerId: string;
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
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  const name =
    [volunteer.firstName, volunteer.lastName].filter(Boolean).join(" ") ||
    "Volunteer";

  const displayValue = (value: string | null | undefined) =>
    value?.trim() || "—";

  return (
    <>
      <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-10">
        <ProfileCard name={name} photoUrl={volunteer.photoUrl}>
          {/* TODO(natalie): total volunteer hours from the hour history endpoint (FE-volunteer-dashboard). Show a dash for now */}

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
              // TODO(natalie): total volunteer hours from the hour history endpoint (FE-volunteer-dashboard). Show a dash for now
              {
                label: "Total Volunteer Hours",
                icon: <Clock3 aria-hidden="true" className={ICON_CLASS} />,
                value: "—",
              },
            ]}
          />
        </ProfileCard>

        <section className="rounded-xl border border-input-hover-frame bg-white p-4 sm:p-6">
          <AdminTabs
            tabs={getVolunteerTabs(volunteerId)}
            ariaLabel="Volunteer sections"
          />

          <div className="mt-6">
            {/* TODO(natalie): plug in the hours history (FE-volunteer-dashboard) */}
            <div id="volunteer-hours-history-slot" />

            {/* TODO(natalie): plug in the Log Hours button (FE-volunteer-dashboard) */}
            <div id="volunteer-log-hours-slot" />
          </div>
        </section>
      </div>
    </>
  );
}
