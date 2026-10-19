/**
 * route.ts
 *
 * Defines the PATCH api endpoint for our positions DB
 *
 * Author: Carter Watabe & Alex Li
 * Date Created: 10/18/2026
 */
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH()
 *
 * Lists all positions in the prisma DB
 *
 * Auth: public
 * Params: none
 * Returns: 200 all items
 * Errors: TBD
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  // In Next.js 15+, params is a Promise, so you have to await it
  const { id } = await params;

  // TODO(natalie): add the admin check here once admin route protection is merged (BE-positions-api)
  // Leave this comment exactly as it is. Don't write any auth code.

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const { name, description, days, times, available } = (body ?? {}) as {
    name?: unknown;
    description?: unknown;
    days?: unknown;
    times?: unknown;
    available?: unknown;
  };

  if (Object.keys(body).length === 0) {
    return NextResponse.json(
      { error: "At least one field must be provided" },
      { status: 400 },
    );
  }

  if (
    Object.keys(body).some(
      (key) =>
        !["name", "description", "days", "times", "available"].includes(key),
    )
  ) {
    return NextResponse.json(
      { error: "Invalid field provided" },
      { status: 400 },
    );
  }
  if (typeof name !== "string" || name.trim() === "") {
    return NextResponse.json(
      { error: "'name' is required and must be a non-empty string" },
      { status: 400 },
    );
  }
  if (typeof description !== "string" || description.trim() === "") {
    return NextResponse.json(
      { error: "'description' is required and must be a non-empty string" },
      { status: 400 },
    );
  }
  if (typeof days !== "string" || days.trim() === "") {
    return NextResponse.json(
      { error: "'days' is required and must be a non-empty string" },
      { status: 400 },
    );
  }
  if (typeof times !== "string" || times.trim() === "") {
    return NextResponse.json(
      { error: "'times' is required and must be a non-empty string" },
      { status: 400 },
    );
  }
  if (typeof available !== "boolean") {
    return NextResponse.json(
      { error: "'done' must be a boolean if provided" },
      { status: 400 },
    );
  }
  let position;
  try {
    position = await prisma.position.update({
      where: { id },
      data: { name, description, days, times, available },
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Position not found" },
          { status: 404 },
        );
      }
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Name already taken" },
          { status: 409 },
        );
      }
    }
  }

  return NextResponse.json({ position }, { status: 200 });
}
