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
  // TODO: if data.positions was sent, count how many positions in the database have one of those ids
  //   (hint: prisma.position.count({ where: { id: { in: ids } } })).
  //   If the count is less than the number of ids sent, return a message saying a position doesn't exist.
    if(data.positions === undefined) {
        return "position was not sent";
    }
   
    const positions = Array.isArray(data.positions) ? data.positions : [data.positions];

    
    return null;
}