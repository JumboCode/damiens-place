/**
 * appointment-step.ts
 *
 * Defines the data types and default values for the Appointment step form.
 * Validates user inputs to ensure required fields are completed.
 *
 * Carter & Rim
 * Date Created: 11/01/2026
 */

export type AppointmentStepValues = {
  onboardingAvailability: string; // free text, in the applicant's own words
};

// One error message per field that has a problem. Fields with no problem are left out.
export type AppointmentStepErrors = Partial<
  Record<keyof AppointmentStepValues, string>
>;

export const emptyAppointmentStep: AppointmentStepValues = {
  onboardingAvailability: "",
};

/**
 * validateAppointmentStep
 *
 * Checks the Appointment Step form for unanswered
 * and empty fields
 *
 * @param values - the value of each input
 * @returns an object with one error message per field that has a problem
 */
export function validateAppointmentStep(
  values: AppointmentStepValues,
): AppointmentStepErrors {
  const errors: AppointmentStepErrors = {};
  if (values.onboardingAvailability.trim() == "") {
    errors.onboardingAvailability = "This field may not be empty.";
  }

  return errors;
}
