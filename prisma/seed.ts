/**
 * <seed.ts>
 *
 * <Takes data from positions.ts and populates them in the prisma databse>
 *
 * Author: <Carter Watabe & Alex Li>
 * Date Created: <10/04/2026>
 */

import "dotenv/config";
import { positions } from "./seed-data/positions";
import { prisma } from "../src/lib/prisma";

//inserting positions into prisma database
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
}

main()
  .catch((error) => {
    console.error("Failed to seed positions:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
