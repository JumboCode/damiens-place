/**
 * seed.ts
 *
 * Takes data from positions.ts, applicants.ts, volunteers.ts, hour-log.ts, and
 * resources.ts and populates them in the prisma database
 *
 * Author: Carter Watabe & Alex Li
 * Date Created: 10/04/2026
 */

import "dotenv/config";
import { positions } from "./seed-data/positions";
import { applicants } from "./seed-data/applicants";
import { prisma } from "../src/lib/prisma";
import { volunteers } from "./seed-data/volunteers";
import { hourLogs } from "./seed-data/hour-log";
import { resources } from "./seed-data/resources";

//inserting positions, test applicants, test volunteers, hour logs, and resources into prisma database
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
    // Their hour logs go first, because a volunteer with hour logs can't be deleted.
    await prisma.hourLog.deleteMany({
      where: { volunteer: { applicant: { id } } },
    });
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

  // seeding hour logs for the test volunteers
  // Re-running the seed deletes every hour log the test volunteers have
  // (including ones made while testing), so their totals always match the seed data.
  await prisma.hourLog.deleteMany({
    where: { volunteerId: { in: volunteers.map((volunteer) => volunteer.id) } },
  });

  for (const { volunteerId, positionName, ...fields } of hourLogs) {
    await prisma.hourLog.create({
      data: {
        ...fields,
        volunteer: { connect: { id: volunteerId } },
        position: { connect: { name: positionName } },
      },
    });
  }
  console.log(`Seeded ${hourLogs.length} hour logs.`);

  // seeding resources (the documents the app looks up by a fixed id)
  // An existing row is left alone, so re-running the seed never undoes an admin's edit.
  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { id: resource.id },
      update: {},
      create: resource,
    });
  }
  console.log(`Seeded ${resources.length} resources.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
