/**
 * hour-log.ts
 *
 * stub for BE-hour-log
 *
 */

type HourLogResult =
  | {
      data: {
        positionId: string;
        startsAt: Date;
        endsAt: Date;
        minutes: number;
        notes: string | null;
      };
    }
  | { error: string };

// TODO: replace with the real implementation (BE-hour-log)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function validateHourLogFields(_body: unknown): HourLogResult {
  throw new Error("Not implemented");
}
