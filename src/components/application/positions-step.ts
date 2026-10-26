/**
 * positions-step.ts
 *
 * Defines the data types and default values for the Positions step form.
 * Validates user inputs to ensure required fields are completed and correctly formatted.
 *
 * Carter & Rim 
 * Date Created: 10/26/2026
 */
 
// One position, exactly as GET /api/positions sends it
export type Position = {
  id: string;
  name: string;
  description: string;
  days: string;
  times: string;
  available: boolean;
};
 
export type PositionsStepValues = {
  positionIds: string[]; // the ids of every position the person picked
  availableDays: string[]; // "MONDAY" to "SUNDAY". They must match the DayOfWeek enum in schema.prisma exactly
  availableHours: string; // free text: the hours on those days, plus any comments
  hasDisability: boolean | null; // null means "not answered yet"
  disabilityDetails: string; // only used when hasDisability is true
};
 
// One error message per field that has a problem. Fields with no problem are left out.
export type PositionsStepErrors = Partial<
  Record<keyof PositionsStepValues, string>
>;
 
export const emptyPositionsStep: PositionsStepValues = {
  positionIds: [],
  availableDays: [],
  availableHours: "",
  hasDisability: null,
  disabilityDetails: "",
};
 
// The options for the days dropdown. The values must match the DayOfWeek enum in schema.prisma.
export const DAY_OPTIONS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];
 
/**
 * validatePositionsStep
 *
 * Checks the Positions Step form for unanswered 
 * and empty fields
 * 
 * @param values - the value of each input
 * @returns errors array
 */
export function validatePositionsStep(
  values: PositionsStepValues,
): PositionsStepErrors {
  const errors: PositionsStepErrors = {};
 
  // check at least one position chosen
  if (values.positionIds.length < 1) {
    errors.positionIds = "You must select at least one position.";
  } 
  
  // check hasDisability is not empty
  if (values.hasDisability == null) {
    errors.hasDisability = "You must provide at least one answer.";
  }
  // check availableDays has at least one chosen
  if (values.availableDays.length < 1) {
    errors.availableDays = "You must provide at least one answer."
  }
  // check availableHours is not empty once the spaces are trimmed off
  if (values.availableHours.trim() == "") {
    errors.availableHours = "This field may not be empty."
  }
 
  return errors;
}