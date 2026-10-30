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
import { volunteers } from "./seed-data/volunteers";

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

    // Re-running the seed puts each applicant back to the status in the seed
    // data, so it also undoes any approval made while testing: delete the
    // Volunteer created from this applicant (the applicant's volunteerId is
    // cleared automatically), then clear the review fields below.
    // This keeps the approve/reject tests repeatable!
    await prisma.volunteer.deleteMany({ where: { applicant: { id } } });

    await prisma.applicant.upsert({
      where: { id },
      update: {
        ...fields,
        reviewedAt: null,
        reviewedByClerkId: null,
        positions: { set: positionLinks },
      },
      create: { id, ...fields, positions: { connect: positionLinks } },
    });
  }
  console.log(`Seeded ${applicants.length} test applicants.`);

  // seeding test volunteers (these don't come from an applicant)
  for (const { id, positionNames, ...fields } of volunteers) {
    const positionLinks = positionNames.map((name) => ({ name }));

    // Re-running the seed resets each one to the seed data
    await prisma.volunteer.upsert({
      where: { id },
      update: { ...fields, positions: { set: positionLinks } },
      create: { id, ...fields, positions: { connect: positionLinks } },
    });
  }
  console.log(`Seeded ${volunteers.length} test volunteers.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
