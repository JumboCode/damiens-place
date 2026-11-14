/**
 * resources.ts
 *
 * Seed data for the Resource table: the documents the app looks up by a fixed id.
 * These ids must match PROTECTED_RESOURCE_IDS in src/lib/resource.ts.
 *
 * Author: Natalie Phua
 * Date Created: 11/14/2026
 */

export type SeedResource = {
  id: string;
  title: string;
  fileUrl: string;
};

export const resources: SeedResource[] = [
  {
    id: "handbook",
    title: "Volunteer Handbook",
    fileUrl: "/documents/handbook.pdf",
  },
];
