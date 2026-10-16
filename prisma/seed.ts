/**
 * seed.ts
 *
 * Takes data from positions.ts and applicants.ts and populates them in the prisma database
 *
 * Author: Carter Watabe & Alex Li
 * Date Created: 10/04/2026
 */

import "dotenv/config";
import { positions } from "./seed-data/positions";
import { applicants } from "./seed-data/applicants";
import { prisma } from "../src/lib/prisma";

//inserting positions and test applicants into prisma database
async function main() {
  for (const position of positions) {
    await prisma.position.upsert({
      where: { name: position.name },
      update: {
        description: position.description,
        days: position.days,
        times: position.times,
        available: position.available,
      },
      create: position,
    });
  }
  console.log(`Seeded ${positions.length} positions.`);

  // seeding applicants
  for (const { id, positionNames, ...fields } of applicants) {
    const positionLinks = positionNames.map((name) => ({ name }));
    await prisma.applicant.upsert({
      where: { id },
      // "set" replaces the links so re-running the seed never piles up extras
      update: { ...fields, positions: { set: positionLinks } },
      create: { id, ...fields, positions: { connect: positionLinks } },
    });
  }
  console.log(`Seeded ${applicants.length} test applicants.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
