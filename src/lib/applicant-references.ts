/*
 * applicant-references.ts
 *
 * Checks whether applicant position IDs exist in the database.
 *
 *
 * Author: Elijah and Jeremiah
 * Date Created: 10/25/2026
 *
 */

import { prisma } from "@/lib/prisma";

/**
 * checkApplicantReferences
 *
 * Checks whether the provided position IDs exist in the database.
 *
 * @param data - The validated applicant fields.
 * @returns an error message if position doesn't exist, or null if everything is fine
 */
export async function checkApplicantReferences(
  data: Record<string, unknown>,
): Promise<string | null> {
  if (data.positions === undefined) return null;

  const sent = Array.isArray(data.positions)
    ? data.positions
    : [data.positions];
  if (!sent.every((id): id is string => typeof id === "string")) {
    return "positions must be position ids";
  }

  const ids = [...new Set(sent)];
  // Verify that every provided position ID exists in the database.
  const count = await prisma.position.count({ where: { id: { in: ids } } });
  if (count < ids.length) {
    return "One or more positions do not exist";
  }
  return null;
}
