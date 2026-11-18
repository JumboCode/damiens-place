
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

// what needs to be returned
const HOUR_LOG_SELECT = {
    id: true,
    positionId: true,
    position: {
        select: {
            name: true,
        },
    },
    startsAt: true,
    endsAt: true,
    minutes: true,
    notes: true,
} satisfies Prisma.HourLogSelect;

/**
 * GET
 *
 * Retrieves a volunteer's hour history, optionally filtered by month,
 * along with monthly and all-time totals.
 *
 * @param request - The incoming request containing the optional month query.
 * @param params - The volunteer ID from the URL.
 * @returns A JSON response with hour logs and totals, or an error response.
 */
export async function GET(request: Request, { params }: RouteContext) {
  //require the volunteer session with requireVolunteer() and check that its volunteerId matches this id
  const session = await requireVolunteer();
  if ("response" in session) return session.response;
  const { id } = await params;

  // A volunteer can only use their own profile
  if (session.volunteerId !== id) {
    return Response.json({ error: "User unauthorized." }, { status: 403 });
  }

  const volunteer = await prisma.volunteer.findUnique({
    where: {
      id: id,
    },
    select: { id: true },
  });

  if (!volunteer) {
    return Response.json({ error: "Volunteer not found" }, { status: 404 });
  }

  // read `month` from the request's query string. If it's sent, get its range with pantryMonthRange. 400 if that returns null.
  const month = new URL(request.url).searchParams.get("month");
  let range = null;
  if (month !== null){
    range = pantryMonthRange(month);
  }
    


  if (month !== null && !range) {
  return Response.json({ error: "Invalid month." }, { status: 400 });
  }
  
  //   monthMinutes (the sum of the filtered entries, or null with no month)
    const where: Prisma.HourLogWhereInput = {
      volunteerId: id,
      ...(range && {startsAt: {gte: range.start, lt: range.end}}),
    };

    const [hourLogs, allTime] = await Promise.all([
      prisma.hourLog.findMany({
        where,
        select: HOUR_LOG_SELECT,
        orderBy: {startsAt: "desc"},
      }),
      prisma.hourLog.aggregate({
        where: {volunteerId: id},
        _sum: {minutes: true},
      }),
    ]);
  
  const totalMinutes = allTime._sum.minutes ?? 0;
  const monthTotal = range
    ? await prisma.hourLog.aggregate({
        where,
        _sum: { minutes: true },
    })
    : null;

const monthMinutes = monthTotal
    ? (monthTotal._sum.minutes ?? 0)
    : null;


  return Response.json(
    {hourLogs, totalMinutes, monthMinutes},
    {status: 200, headers: {"Cache-Control": "no-store"}},
  );

}