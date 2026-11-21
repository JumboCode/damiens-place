/**
 * route.ts
 * performs query based on search parameters supplied by parseVolunteerListQuery
 * created by William Balz and Alex Li on 21 November 2026
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { parseVolunteerListQuery } from "@/lib/admin-volunteers";

/**
 * executes query to get volunteers based on search parameters parsed by parseVolunteerListQuery
 * @params request - the current request for the query
 * @returns the list of volunteers sorted as requested
 * returns 400 if invalid order or sort type
 */
export async function GET(request: Request) {
  const adminResponse = await requireAdmin();
  if (adminResponse) {
    return adminResponse;
  }

  const url = await new URL(request.url);
  const parsed = parseVolunteerListQuery(url.searchParams);

  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { q, sort, order } = parsed.data;

  const volunteers = await prisma.volunteer.findMany({
    where: q
      ? {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { cellPhone: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      cellPhone: true,
      status: true,
      positions: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const hourTotals = await prisma.hourLog.groupBy({
    by: ["volunteerId"],
    _sum: {
      minutes: true,
    },
  });

  const totalsByVolunteer = new Map(
    hourTotals.map((total) => [total.volunteerId, total._sum.minutes ?? 0]),
  );

  const volunteersWithTotals = volunteers.map((volunteer) => ({
    ...volunteer,
    totalMinutes: totalsByVolunteer.get(volunteer.id) ?? 0,
  }));

  const direction = order === "asc" ? 1 : -1;

  volunteersWithTotals.sort((a, b) => {
    let comparison: number;

    if (sort == "hours") {
      comparison = a.totalMinutes - b.totalMinutes;
    } else {
      comparison =
        a.lastName.localeCompare(b.lastName) ||
        a.firstName.localeCompare(b.firstName);
    }
    return comparison * direction;
  });

  return NextResponse.json(
    { volunteers: volunteersWithTotals },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
