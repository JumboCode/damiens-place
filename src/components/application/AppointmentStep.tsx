/**
 * AppointmentStep.tsx
 *
 * Step 4 in the application form, where the applicant selects positions
 * and availability.
 *
 * Carter & Rim
 * Date Created: 11/01/2026
 */
"use client";

import FormTextArea from "./FormTextArea";
import type {
  AppointmentStepErrors,
  AppointmentStepValues,
} from "./appointment-step";

type AppointmentStepProps = {
  values: AppointmentStepValues;
  errors: AppointmentStepErrors;
  // Pass only the fields that changed
  onChange: (changes: Partial<AppointmentStepValues>) => void;
};

export default function AppointmentStep({
  values,
  errors,
  onChange,
}: AppointmentStepProps) {
  return (
    <div>
      <h2 className="text-2xl not-italic font-semibold leading-normal">
        Part 4: Schedule Onboarding Appointment
      </h2>
      <div className="flex flex-col gap-2 mt-8">
        <h3 className="text-xl font-semibold leading-normal">Time Available</h3>
        <FormTextArea
          label="Onboarding Time Availability"
          name="onboardingAvailability"
          required
          helperText="Please put down your availability for a 30 minute on-boarding appointment."
          value={values.onboardingAvailability}
          error={errors.onboardingAvailability}
          onChange={(newText) => onChange({ onboardingAvailability: newText })}
        />
      </div>
    </div>
  );
}
