<<<<<<< HEAD
import "dotenv/config"; // loads the database link from your .env file
import { positions } from "./seed-data/positions";
import { prisma } from "../src/lib/prisma";
// add in the rest of your imports... specifically prisma and positions

=======
/**
 * seed.ts
 *
 * Takes data from positions.ts and populates them in the prisma database
 *
 * Author: Carter Watabe & Alex Li
 * Date Created: 10/04/2026
 */

import "dotenv/config";
import { positions } from "./seed-data/positions";
import { prisma } from "../src/lib/prisma";

//inserting positions into prisma database
>>>>>>> 79c06c5fcf9d0df2e2f994c7431b25024e51b65e
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
<<<<<<< HEAD
  // Go through every position, one at a time:
  // call await prisma.position.upsert
  // upsert = "update if it exists, insert if it doesn't"
  // We look it up by name. If a position with this name is already there,
  // we update it. If not, we create it. So no duplicates, ever!
  // Add a console log at the end saying how many positions you seeded
=======
>>>>>>> 79c06c5fcf9d0df2e2f994c7431b25024e51b65e
}

main()
  .catch((error) => {
    console.error("Failed to seed positions:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
<<<<<<< HEAD
// Add a .catch(error) in case of seeding failure
// And also a .finally to close the prisma connection once you are done
=======
>>>>>>> 79c06c5fcf9d0df2e2f994c7431b25024e51b65e
