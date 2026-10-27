/*
 * applicant-references.ts
 *
 * Normalizes endpoints between checking for positions in one call
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
 * handles errors for invalid sign-ins
 * 
 * @returns an error message if position doesn't, or null if everything is fine
 * @throws 401 if a position doesn't exist
 */
export async function checkApplicantReferences(
  data: Record<string, unknown>,
): Promise<string | null> {
  if (data.positions === undefined) return null;

  const sent = Array.isArray(data.positions) ? data.positions : [data.positions];
  if (!sent.every((id): id is string => typeof id === "string")) {
    return "positions must be position ids";
  }

  const ids = [...new Set(sent)];
  const count = await prisma.position.count({ where: { id: { in: ids } } });
  if (count < ids.length) {
    return "One or more positions do not exist";
  }
  return null;
}