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
 * Updates a position in the prisma DB
 *
 * Auth: public
 * Params: none
 * Returns: 200 all items
 * Errors: none
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

  if (Object.keys(body).length === 0) {
    return NextResponse.json(
      { error: "At least one field must be provided" },
      { status: 400 },
    );
  }
  const allowedFields = ["name", "description", "days", "times", "available"];

  if (Object.keys(body).some((field) => !allowedFields.includes(field))) {
    return NextResponse.json(
      { error: "Invalid field provided" },
      { status: 400 },
    );
  }

  const data: {
    name?: string;
    description?: string;
    days?: string;
    times?: string;
    available?: boolean;
  } = {};

  for (const field of ["name", "description", "days", "times"] as const) {
    const value = body[field];
    if (value === undefined) continue;
    if (typeof value !== "string" || value.trim() === "") {
      return NextResponse.json(
        { error: `'${field}' must be a non-empty string` },
        { status: 400 },
      );
    }
    data[field] = value.trim();
  }

  if (body["available"] !== undefined) {
    if (typeof body["available"] !== "boolean") {
      return NextResponse.json(
        { error: "'available' must be a boolean if provided" },
        { status: 400 },
      );
    }
    data.available = body["available"];
  }

  let position;
  try {
    position = await prisma.position.update({
      where: { id },
      data: data,
    });
    return NextResponse.json({ position }, { status: 200 });
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
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
