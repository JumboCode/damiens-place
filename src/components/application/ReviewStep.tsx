/**
 * ReviewStep.tsx
 *
 * Displays the applicant's answers in four sections: Personal Information, Positions, Materials, and Appointment.
 *
 * Author: Adrien and Luisa
 * Date Created: 11/03/2026
 */
import ReviewSection from "./ReviewSection";
import { REVIEW_EDIT_STEPS } from "./review-step";
import type { ReviewData } from "./review-step";

type ReviewStepProps = {
  data: ReviewData;
  // Called with the step number to go back to
  onEdit: (step: number) => void;
};

/**
 * Row
 *
 * Displays a label and its corresponding answer on the review page.
 * Shows a dash when the answer is empty.
 *
 * @param label - The label describing the applicant's answer.
 * @param value - The applicant's answer as a string, which may be empty.
 * @returns A label and answer pair, displaying "—" for empty answers.
 */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm font-medium">{label}</dt>
      <dd className="text-sm text-secondary">{value.trim() || "—"}</dd>
    </div>
  );
}

/**
 * ReviewStep
 *
 * Displays the applicant's answers in the four sections and allows them to return to a section by clicking its Edit button.
 *
 * @param data - The applicant's information to display on the review page.
 * @param onEdit - Function called with the step number when Edit is clicked.
 * @returns The review page containing all four sections and their answers.
 */
export default function ReviewStep({ data, onEdit }: ReviewStepProps) {
  return (
    <div className="flex flex-col gap-10">
      <h2>{/* TODO: the page heading, from the Figma */}</h2>

      <ReviewSection
        title="Personal Information"
        onEdit={() => onEdit(REVIEW_EDIT_STEPS.personalInfo)}
      >
        {/* TODO: a row (label + answer) for each personal info and emergency contact answer, and "Uploaded" for the proof of residence.
            Copy the section titles and labels from the Figma. The title above is just an example.
            It's worth making a tiny helper inside this file (like `Row`) that takes a label and a value and shows "—" when the value is empty. */}
      </ReviewSection>

      {/* TODO: the Positions section (REVIEW_EDIT_STEPS.positions): positions and days as comma-separated lists, hours, and
          the disability answer as "Yes" or "No" (plus the details if any). */}
      {/* TODO: the Materials section (REVIEW_EDIT_STEPS.materials): both signatures, and the two minor signatures only when data.isMinor. */}
      {/* TODO: the Appointment section (REVIEW_EDIT_STEPS.appointment): onboardingAvailability. */}
    </div>
  );
}
