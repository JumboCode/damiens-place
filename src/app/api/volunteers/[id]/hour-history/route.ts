
/**
 * route.ts
 *
 * GET endpoint for retrieving a volunteer's hour history,
 * including monthly and all-time totals.
 *
 * Authors: Luisa Garciarramos and Rim Badaoui
 * Date Created: 11/17/2026
 */

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireVolunteer } from "@/lib/volunteer-auth";
import { pantryMonthRange } from "@/lib/time-conversion";

type RouteContext = { params: Promise<{ id: string }> };

type RouteContext = { params: Promise<{ id: string }> };

// TODO: HOUR_LOG_SELECT: the fields each entry sends back (see "Things to know"), `satisfies Prisma.HourLogSelect`
const HOUR_LOG_SELECT = {};

// TODO: function contract
export async function GET(request: Request, { params }: RouteContext) {
  // TODO: require the volunteer session with requireVolunteer() and check that its volunteerId matches this id
  // HINT: i recommend checking out /src/app/api/volunteers/[id]/route.ts for an example of how this can be done!

  const { id } = await params;

  // TODO: read `month` from the request's query string. If it's sent, get its range with pantryMonthRange. 400 if that returns null.
  // TODO: 404 if the volunteer doesn't exist.
  // TODO: get the entries (filtered by the range when there is one, newest first), the all-time total, and
  //   monthMinutes (the sum of the filtered entries, or null with no month)
  // TODO: return 200 with { hourLogs, totalMinutes, monthMinutes } and the header Cache-Control: no-store
}