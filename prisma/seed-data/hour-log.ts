/**
 * hour-log.ts
 *
 * Seed data for the HourLog table: three months of logged hours for
 * test-volunteer-active, so the hours history table has data to show.
 * test-volunteer-inactive has no entries on purpose (the empty state).
 *
 * Times are stored in UTC. The comment on each entry is the pantry time
 * (America/New_York: EDT is UTC-4 through Oct 31, EST is UTC-5 from Nov 1).
 *
 * Totals: Sept 600 min, Oct 480 min, Nov 585 min, all-time 1665 min (27h 45m)
 *
 * Author: Natalie Phua
 * Date Created: 11/14/2026
 */

import { positions } from "./positions";

export type SeedHourLog = {
  id: string;
  volunteerId: string;
  positionName: string;
  startsAt: Date;
  endsAt: Date;
  minutes: number; // must match startsAt/endsAt
  notes: string | null;
};

const VOLUNTEER_ID = "test-volunteer-active";

// Any two positions work: hours can be logged for any position
const POSITION_A = positions[0].name;
const POSITION_B = positions[1].name;

export const hourLogs: SeedHourLog[] = [
  // ---- September 2026 (600 min) ----
  {
    // Sep 3, 7:30 AM - 12:00 PM
    id: "test-hour-log-01",
    volunteerId: VOLUNTEER_ID,
    positionName: POSITION_A,
    startsAt: new Date("2026-09-03T11:30:00Z"),
    endsAt: new Date("2026-09-03T16:00:00Z"),
    minutes: 270,
    notes: null,
  },
  {
    // Sep 12, 9:00 AM - 12:30 PM
    id: "test-hour-log-02",
    volunteerId: VOLUNTEER_ID,
    positionName: POSITION_B,
    startsAt: new Date("2026-09-12T13:00:00Z"),
    endsAt: new Date("2026-09-12T16:30:00Z"),
    minutes: 210,
    notes: "Covered for another volunteer",
  },
  {
    // Sep 24, 4:00 PM - 6:00 PM
    id: "test-hour-log-03",
    volunteerId: VOLUNTEER_ID,
    positionName: POSITION_A,
    startsAt: new Date("2026-09-24T20:00:00Z"),
    endsAt: new Date("2026-09-24T22:00:00Z"),
    minutes: 120,
    notes: null,
  },

  // ---- October 2026 (480 min) ----
  {
    // Oct 8, 7:30 AM - 12:00 PM
    id: "test-hour-log-04",
    volunteerId: VOLUNTEER_ID,
    positionName: POSITION_A,
    startsAt: new Date("2026-10-08T11:30:00Z"),
    endsAt: new Date("2026-10-08T16:00:00Z"),
    minutes: 270,
    notes: null,
  },
  {
    // Oct 17, 10:00 AM - 1:15 PM
    id: "test-hour-log-05",
    volunteerId: VOLUNTEER_ID,
    positionName: POSITION_B,
    startsAt: new Date("2026-10-17T14:00:00Z"),
    endsAt: new Date("2026-10-17T17:15:00Z"),
    minutes: 195,
    notes: "Unloaded the delivery truck",
  },
  {
    // Oct 31, 11:30 PM - 11:45 PM. Timezone check: Nov 1 in UTC, but OCTOBER in the pantry
    id: "test-hour-log-06",
    volunteerId: VOLUNTEER_ID,
    positionName: POSITION_A,
    startsAt: new Date("2026-11-01T03:30:00Z"),
    endsAt: new Date("2026-11-01T03:45:00Z"),
    minutes: 15,
    notes: "Timezone check: belongs to October",
  },

  // ---- November 2026 (585 min) ----
  {
    // Nov 1, 12:30 AM - 1:00 AM (still EDT: clocks change at 2 AM). Timezone check: NOVEMBER
    id: "test-hour-log-07",
    volunteerId: VOLUNTEER_ID,
    positionName: POSITION_A,
    startsAt: new Date("2026-11-01T04:30:00Z"),
    endsAt: new Date("2026-11-01T05:00:00Z"),
    minutes: 30,
    notes: "Timezone check: belongs to November",
  },
  {
    // Nov 5, 7:30 AM - 12:00 PM
    id: "test-hour-log-08",
    volunteerId: VOLUNTEER_ID,
    positionName: POSITION_A,
    startsAt: new Date("2026-11-05T12:30:00Z"),
    endsAt: new Date("2026-11-05T17:00:00Z"),
    minutes: 270,
    notes: null,
  },
  {
    // Nov 7, 9:00 AM - 11:00 AM
    id: "test-hour-log-09",
    volunteerId: VOLUNTEER_ID,
    positionName: POSITION_B,
    startsAt: new Date("2026-11-07T14:00:00Z"),
    endsAt: new Date("2026-11-07T16:00:00Z"),
    minutes: 120,
    notes: null,
  },
  {
    // Nov 12, 1:00 PM - 3:45 PM
    id: "test-hour-log-10",
    volunteerId: VOLUNTEER_ID,
    positionName: POSITION_B,
    startsAt: new Date("2026-11-12T18:00:00Z"),
    endsAt: new Date("2026-11-12T20:45:00Z"),
    minutes: 165,
    notes: "Stocked shelves after the food drive",
  },
];
