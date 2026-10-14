import type { Config } from "jest";
import nextJest from "next/jest.js";

// next/jest loads our Next.js config and handles TypeScript for us
const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  // Pure functions only need Node, not a simulated browser
  testEnvironment: "node", // Lets tests resolve "@/..." imports the same way the app does
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
};

export default createJestConfig(config);
