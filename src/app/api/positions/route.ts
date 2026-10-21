/**
 * route.ts
 *
 * Defines the GET api endpoint for our positions DB
 *
 * Author: Carter Watabe & Alex Li
 * Date Created: 10/17/2026
 */

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

/**
 * GET()
 *
 * Lists all positions in the prisma DB
 *
 * Auth: public
 * Params: none
 * Returns: 200 all items
 * Errors: none
 */
export async function GET() {
  const positions = await prisma.position.findMany({
    orderBy: {
      name: "asc", // Sorts alphabetically from A to Z
    },
  });
  return NextResponse.json({ positions }, { status: 200 });
}
