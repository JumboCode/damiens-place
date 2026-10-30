/**
 * volunteers.ts
 *
 * Test volunteers for the seed script used by the volunteer login and
 * profile tickets. Re-running the seed puts them back to exactly this data.
 *
 * Author: Natalie Phua
 * Date Created: 10/29/2026
 */

import { positions } from "./positions";

type VolunteerSeed = {
  id: string;
  status: "ACTIVE" | "INACTIVE";
  firstName: string;
  lastName: string;
  email: string; // already normalized (lowercase)
  cellPhone: string; // already normalized (digits only)
  homePhone: string | null;
  photoUrl: string | null;
  photoConsent: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string | null;
  positionNames: string[];
};

export const volunteers: VolunteerSeed[] = [
  {
    id: "test-volunteer-active",
    status: "ACTIVE",
    firstName: "Active",
    lastName: "Test",
    email: "active.volunteer@example.com",
    cellPhone: "6175550101",
    homePhone: "6175550111",
    photoUrl: null,
    photoConsent: false,
    emergencyContactName: "Alex Test",
    emergencyContactPhone: "6175550199",
    emergencyContactRelationship: "Friend",
    // The first seeded position, so the profile has one to show
    positionNames: [positions[0].name],
  },
  {
    id: "test-volunteer-inactive",
    status: "INACTIVE",
    firstName: "Inactive",
    lastName: "Test",
    email: "inactive.volunteer@example.com",
    cellPhone: "6175550102",
    homePhone: null,
    photoUrl: null,
    photoConsent: false,
    emergencyContactName: "Sam Test",
    emergencyContactPhone: "6175550198",
    emergencyContactRelationship: null,
    positionNames: [],
  },
];
