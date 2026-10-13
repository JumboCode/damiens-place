import "dotenv/config"; // loads the database link from your .env file
import { positions } from "./seed-data/positions";
import { prisma } from "../src/lib/prisma";
// add in the rest of your imports... specifically prisma and positions

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
  // Go through every position, one at a time:
  // call await prisma.position.upsert
  // upsert = "update if it exists, insert if it doesn't"
  // We look it up by name. If a position with this name is already there,
  // we update it. If not, we create it. So no duplicates, ever!
  // Add a console log at the end saying how many positions you seeded
}

main()
  .catch((error) => {
    console.error("Failed to seed positions:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// Add a .catch(error) in case of seeding failure
// And also a .finally to close the prisma connection once you are done
