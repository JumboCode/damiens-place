/**
 * hour-log.ts
 *
 * helper to normalize the data inside the POST and PATCH requests for hours logged
 *
 * Authors: Nirvaan Govind and Adrien Tabor
 */

import { Prisma } from "@/generated/prisma/client";
import { pantryDateTimeToUtc } from "./time-conversion";

type HourLogResult =
  | {
      data: {
        positionId: string;
        startsAt: Date;
        endsAt: Date;
        minutes: number;
        notes: string | null;
      };
    }
  | { error: string };

export const HOUR_LOG_SELECT = {
  id: true,
  positionId: true,
  position: { select: { name: true } },
  startsAt: true,
  endsAt: true,
  minutes: true,
  notes: true,
} satisfies Prisma.HourLogSelect;

/**
 * Validates the request body shared by the POST and PATCH hour-log endpoints.
 *
 * @param body - The parsed JSON request body.
 * @returns The cleaned values to save, including UTC timestamps and calculated
 * minutes, or an error naming the invalid field.
 */
export function validateHourLogFields(body: unknown): HourLogResult {
  // Check that the body is a JSON object.
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { error: "body must be a plain object" };
  }

  // Reject any unexpected fields.
  const allowedFields = ["date", "startTime", "endTime", "positionId", "notes"];
  for (const field of Object.keys(body)) {
    if (!allowedFields.includes(field)) {
      return { error: `Unexpected field: ${field}` };
    }
  }

  const { date, startTime, endTime, positionId, notes } = body as Record<
    string,
    unknown
  >;

  // Check the date separately using noon pantry time.
  if (typeof date !== "string" || !pantryDateTimeToUtc(date, "12:00")) {
    return { error: "date must be a valid date in YYYY-MM-DD format" };
  }

  // Check the start time and convert it to UTC.
  const startsAt =
    typeof startTime === "string" ? pantryDateTimeToUtc(date, startTime) : null;
  if (!startsAt) {
    return { error: "startTime must be a valid time in HH:MM format" };
  }

  // Check the end time and convert it to UTC.
  const endsAt =
    typeof endTime === "string" ? pantryDateTimeToUtc(date, endTime) : null;
  if (!endsAt) {
    return { error: "endTime must be a valid time in HH:MM format" };
  }

  // Check that the position ID is a non-blank string.
  if (typeof positionId !== "string" || positionId.trim() === "") {
    return { error: "positionId must be a non-empty string" };
  }

  // Check the type of the optional notes.
  if (notes !== undefined && notes !== null && typeof notes !== "string") {
    return { error: "notes must be a string or null" };
  }

  // Check that the shift ends after it starts.
  if (endsAt.getTime() <= startsAt.getTime()) {
    return { error: "endTime must be after startTime" };
  }

  // Check that the shift has already started.
  if (startsAt.getTime() > Date.now()) {
    return { error: "date and startTime cannot be in the future" };
  }

  // Calculate elapsed minutes and clean the text fields.
  return {
    data: {
      positionId: positionId.trim(),
      startsAt,
      endsAt,
      minutes: Math.floor((endsAt.getTime() - startsAt.getTime()) / 60_000),
      notes: typeof notes === "string" ? notes.trim() || null : null,
    },
  };
}
